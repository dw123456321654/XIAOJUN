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

export const useChatStore = defineStore('chat', () => {
  // 当前会话的消息列表
  const messages = ref<ChatMessage[]>([])
  
  // 当前会话 key
  const sessionKey = ref<string>('main')
  
  // 上下文使用情况
  const contextUsage = ref<ContextUsage>({
    used: 0,
    max: 200000, // 默认 200k
    percentage: 0,
    lastUpdated: 0
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

  // 添加消息
  function addMessage(msg: ChatMessage) {
    messages.value.push(msg)
    saveToLocalStorage()
  }
  
  // 更新最后一条消息（流式消息用）
  function updateLastMessage(content: string, pending: boolean = false) {
    if (messages.value.length > 0) {
      const lastMsg = messages.value[messages.value.length - 1]
      if (lastMsg.role === 'assistant') {
        lastMsg.content = content
        lastMsg.pending = pending
        saveToLocalStorage()
      }
    }
  }
  
  // 清空消息
  function clearMessages() {
    messages.value = []
    contextUsage.value = {
      used: 0,
      max: 200000,
      percentage: 0,
      lastUpdated: 0
    }
    saveToLocalStorage()
  }
  
  // 更新上下文使用情况
  function updateContextUsage(used: number, max?: number) {
    const maxTokens = max || contextUsage.value.max
    contextUsage.value = {
      used,
      max: maxTokens,
      percentage: maxTokens > 0 ? Math.round((used / maxTokens) * 100) : 0,
      lastUpdated: Date.now()
    }
  }
  
  // 估算消息的 token 数（粗略估算：字符数 / 4）
  function estimateTokens(content: string): number {
    // 中文约 2 字符/token，英文约 4 字符/token
    // 取中间值 3 字符/token
    return Math.ceil(content.length / 3)
  }
  
  // 重新计算所有消息的 token 总数
  function recalculateTokens() {
    let total = 0
    for (const msg of messages.value) {
      if (msg.tokens) {
        total += msg.tokens
      } else {
        total += estimateTokens(msg.content)
      }
    }
    // 加上系统提示词估算（约 5000 tokens）
    total += 5000
    updateContextUsage(total)
  }
  
  // 格式化上下文显示（如 "22K/200K tokens"）
  function formatContext(): string {
    const { used, max } = contextUsage.value
    const usedK = Math.round(used / 1000)
    const maxK = Math.round(max / 1000)
    return `${usedK}K/${maxK}K tokens`
  }

  // 保存到 localStorage
  function saveToLocalStorage() {
    try {
      localStorage.setItem('clawdesk-chat-messages', JSON.stringify(messages.value))
    } catch (e) {
      console.error('[ChatStore] Save error:', e)
    }
  }
  
  // 从 localStorage 加载
  function loadFromLocalStorage() {
    try {
      const saved = localStorage.getItem('clawdesk-chat-messages')
      if (saved) {
        messages.value = JSON.parse(saved)
        // 加载后重新计算 token
        recalculateTokens()
      }
    } catch (e) {
      console.error('[ChatStore] Load error:', e)
    }
  }
  
  // 初始化时加载
  loadFromLocalStorage()
  
  return {
    messages,
    sessionKey,
    contextUsage,
    contextStatus,
    shouldWarn,
    shouldAlert,
    addMessage,
    updateLastMessage,
    clearMessages,
    updateContextUsage,
    recalculateTokens,
    estimateTokens,
    formatContext
  }
})
