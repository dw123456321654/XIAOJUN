import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: number
  pending?: boolean
  tokens?: number // 消息使用的 token 数
}

// 上下文使用情况
export interface ContextUsage {
  used: number      // 已使用 token
  max: number       // 最大 token
  percentage: number // 使用百分比
  lastUpdated: number // 最后更新时间
}

// 角色会话
export interface RoleSession {
  roleId: string
  messages: ChatMessage[]
  contextUsage: ContextUsage
  lastActive: number
}

// 会话存储（所有角色的会话）
interface SessionStore {
  [roleId: string]: RoleSession
}

export const useChatStore = defineStore('chat', () => {
  // 当前角色 ID
  const currentRoleId = ref<string>('')
  
  // 所有角色的会话数据
  const sessions = ref<SessionStore>({})
  
  // 是否正在等待响应
  const isWaiting = ref(false)
  
  // 当前角色的会话（计算属性）
  const currentSession = computed<RoleSession | undefined>(() => {
    if (!currentRoleId.value) return undefined
    return sessions.value[currentRoleId.value]
  })
  
  // 当前消息列表
  const messages = computed<ChatMessage[]>({
    get: () => currentSession.value?.messages || [],
    set: (val) => {
      if (currentRoleId.value) {
        ensureSession(currentRoleId.value)
        sessions.value[currentRoleId.value].messages = val
      }
    }
  })
  
  // 上下文使用情况
  const contextUsage = computed<ContextUsage>(() => {
    return currentSession.value?.contextUsage || {
      used: 0,
      max: 200000,
      percentage: 0,
      lastUpdated: 0
    }
  })
  
  // 上下文状态枚举
  const contextStatus = computed(() => {
    const pct = contextUsage.value.percentage
    if (pct >= 95) return 'critical'
    if (pct >= 80) return 'warning'
    if (pct >= 60) return 'caution'
    return 'normal'
  })
  
  // 是否需要显示警告
  const shouldWarn = computed(() => contextUsage.value.percentage >= 80)
  
  // 是否需要弹窗警告
  const shouldAlert = computed(() => contextUsage.value.percentage >= 95)

  // 确保会话存在
  function ensureSession(roleId: string): RoleSession {
    if (!sessions.value[roleId]) {
      sessions.value[roleId] = {
        roleId,
        messages: [],
        contextUsage: {
          used: 0,
          max: 200000,
          percentage: 0,
          lastUpdated: 0
        },
        lastActive: Date.now()
      }
    }
    return sessions.value[roleId]
  }

  // 切换角色会话
  function switchRoleSession(roleId: string): boolean {
    // 检查是否有进行中的任务
    if (isWaiting.value && currentRoleId.value && currentRoleId.value !== roleId) {
      return false // 需要用户确认
    }
    
    // 保存当前会话的最后活跃时间
    if (currentRoleId.value && sessions.value[currentRoleId.value]) {
      sessions.value[currentRoleId.value].lastActive = Date.now()
    }
    
    // 切换到新角色
    currentRoleId.value = roleId
    ensureSession(roleId)
    saveToLocalStorage()
    
    return true
  }
  
  // 强制切换角色会话（忽略进行中的任务）
  function forceSwitchRoleSession(roleId: string) {
    // 中断当前任务
    isWaiting.value = false
    
    // 清除 pending 状态
    if (currentRoleId.value && sessions.value[currentRoleId.value]) {
      const msgs = sessions.value[currentRoleId.value].messages
      if (msgs.length > 0 && msgs[msgs.length - 1].pending) {
        msgs[msgs.length - 1].pending = false
      }
    }
    
    // 切换角色
    switchRoleSession(roleId)
  }

  // 添加消息
  function addMessage(msg: ChatMessage) {
    if (!currentRoleId.value) return
    ensureSession(currentRoleId.value)
    sessions.value[currentRoleId.value].messages.push(msg)
    sessions.value[currentRoleId.value].lastActive = Date.now()
    saveToLocalStorage()
  }
  
  // 更新最后一条消息（流式消息用）
  function updateLastMessage(content: string, pending: boolean = false) {
    if (!currentRoleId.value) return
    const msgs = sessions.value[currentRoleId.value]?.messages
    if (msgs && msgs.length > 0) {
      const lastMsg = msgs[msgs.length - 1]
      if (lastMsg.role === 'assistant') {
        lastMsg.content = content
        lastMsg.pending = pending
        saveToLocalStorage()
      }
    }
  }
  
  // 设置等待状态
  function setWaiting(waiting: boolean) {
    isWaiting.value = waiting
  }
  
  // 清空当前角色的消息
  function clearMessages() {
    if (!currentRoleId.value) return
    if (sessions.value[currentRoleId.value]) {
      sessions.value[currentRoleId.value].messages = []
      sessions.value[currentRoleId.value].contextUsage = {
        used: 0,
        max: 200000,
        percentage: 0,
        lastUpdated: 0
      }
      saveToLocalStorage()
    }
  }
  
  // 更新上下文使用情况
  function updateContextUsage(used: number, max?: number) {
    if (!currentRoleId.value) return
    ensureSession(currentRoleId.value)
    const maxTokens = max || sessions.value[currentRoleId.value].contextUsage.max
    sessions.value[currentRoleId.value].contextUsage = {
      used,
      max: maxTokens,
      percentage: maxTokens > 0 ? Math.round((used / maxTokens) * 100) : 0,
      lastUpdated: Date.now()
    }
  }
  
  // 估算消息的 token 数（粗略估算：字符数 / 3）
  function estimateTokens(content: string): number {
    return Math.ceil(content.length / 3)
  }
  
  // 重新计算所有消息的 token 总数
  function recalculateTokens() {
    if (!currentRoleId.value || !sessions.value[currentRoleId.value]) return
    let total = 0
    for (const msg of sessions.value[currentRoleId.value].messages) {
      if (msg.tokens) {
        total += msg.tokens
      } else {
        total += estimateTokens(msg.content)
      }
    }
    total += 5000 // 系统提示词估算
    updateContextUsage(total)
  }
  
  // 格式化上下文显示
  function formatContext(): string {
    const { used, max } = contextUsage.value
    const usedK = Math.round(used / 1000)
    const maxK = Math.round(max / 1000)
    return `${usedK}K/${maxK}K tokens`
  }
  
  // 获取当前角色的 sessionKey
  function getSessionKey(): string {
    return `role_${currentRoleId.value}`
  }

  // 保存到 localStorage
  function saveToLocalStorage() {
    try {
      localStorage.setItem('clawdesk-sessions', JSON.stringify(sessions.value))
      localStorage.setItem('clawdesk-current-role', currentRoleId.value)
    } catch (e) {
      console.error('[ChatStore] Save error:', e)
    }
  }
  
  // 从 localStorage 加载
  function loadFromLocalStorage() {
    try {
      // 加载当前角色
      const savedRole = localStorage.getItem('clawdesk-current-role')
      if (savedRole) {
        currentRoleId.value = savedRole
      }
      
      // 加载所有会话
      const saved = localStorage.getItem('clawdesk-sessions')
      if (saved) {
        sessions.value = JSON.parse(saved)
      }
      
      // 重新计算 token
      if (currentRoleId.value) {
        recalculateTokens()
      }
    } catch (e) {
      console.error('[ChatStore] Load error:', e)
    }
  }
  
  // 初始化时加载
  loadFromLocalStorage()
  
  return {
    // 状态
    currentRoleId,
    messages,
    contextUsage,
    contextStatus,
    shouldWarn,
    shouldAlert,
    isWaiting,
    
    // 方法
    switchRoleSession,
    forceSwitchRoleSession,
    addMessage,
    updateLastMessage,
    setWaiting,
    clearMessages,
    updateContextUsage,
    recalculateTokens,
    estimateTokens,
    formatContext,
    getSessionKey
  }
})
