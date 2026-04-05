import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Role } from '@/types/role'
import { PRESET_ROLES, DEFAULT_ROLE } from '@/types/role'
import { useChatStore } from './chat'

export const useRoleStore = defineStore('role', () => {
  // 当前角色
  const currentRole = ref<Role>(loadSavedRole())
  
  // 可用角色列表
  const availableRoles = ref<Role[]>([...PRESET_ROLES])
  
  // 是否有进行中的任务（需要确认才能切换）
  const hasPendingTask = computed(() => {
    const chatStore = useChatStore()
    return chatStore.isWaiting
  })
  
  // 当前进行中的角色名
  const pendingRoleName = computed(() => {
    if (!hasPendingTask.value) return null
    const chatStore = useChatStore()
    const roleId = chatStore.currentRoleId
    const role = availableRoles.value.find(r => r.id === roleId)
    return role?.nickname || role?.name || 'AI'
  })
  
  // 计算属性：当前角色索引
  const currentIndex = computed(() => 
    availableRoles.value.findIndex(r => r.id === currentRole.value.id)
  )
  
  // 切换角色（返回 true=成功，false=需要确认）
  const switchRole = (roleId: string): boolean => {
    // 同一个角色，不做处理
    if (roleId === currentRole.value.id) {
      return true
    }
    
    const chatStore = useChatStore()
    
    // 尝试切换会话
    const success = chatStore.switchRoleSession(roleId)
    
    if (!success) {
      // 有进行中的任务，返回 false 让调用方处理确认
      return false
    }
    
    // 切换成功，更新角色
    const role = availableRoles.value.find(r => r.id === roleId)
    if (role) {
      currentRole.value = role
      saveRole(role)
    }
    
    return true
  }
  
  // 强制切换角色（忽略进行中的任务）
  const forceSwitchRole = (roleId: string) => {
    const chatStore = useChatStore()
    chatStore.forceSwitchRoleSession(roleId)
    
    const role = availableRoles.value.find(r => r.id === roleId)
    if (role) {
      currentRole.value = role
      saveRole(role)
    }
  }
  
  // 初始化会话
  const initSession = () => {
    const chatStore = useChatStore()
    chatStore.switchRoleSession(currentRole.value.id)
  }
  
  // 保存角色到本地存储
  const saveRole = (role: Role) => {
    try {
      localStorage.setItem('clawdesk-current-role-id', role.id)
    } catch (e) {
      console.error('保存角色失败:', e)
    }
  }
  
  return {
    currentRole,
    availableRoles,
    currentIndex,
    hasPendingTask,
    pendingRoleName,
    switchRole,
    forceSwitchRole,
    initSession
  }
})

/**
 * 从本地存储加载保存的角色
 */
function loadSavedRole(): Role {
  try {
    const savedId = localStorage.getItem('clawdesk-current-role-id')
    if (savedId) {
      const found = PRESET_ROLES.find(r => r.id === savedId)
      if (found) {
        return found
      }
    }
  } catch (e) {
    console.error('加载角色失败:', e)
  }
  return DEFAULT_ROLE
}
