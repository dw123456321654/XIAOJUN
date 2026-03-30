import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

const FAVORITES_KEY = 'excel-helper-favorites'
const SETTINGS_KEY = 'excel-helper-settings'

// 从 localStorage 加载数据
function loadFavorites(): string[] {
  try {
    const data = localStorage.getItem(FAVORITES_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

function loadSettings() {
  try {
    const data = localStorage.getItem(SETTINGS_KEY)
    return data
      ? JSON.parse(data)
      : {
          theme: 'light',
          fontSize: 'medium',
        }
  } catch {
    return {
      theme: 'light',
      fontSize: 'medium',
    }
  }
}

// 保存到 localStorage
function saveFavorites(favorites: string[]) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
}

function saveSettings(settings: any) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}

export const useMainStore = defineStore('main', () => {
  // 收藏的公式列表
  const favorites = ref<string[]>(loadFavorites())

  // 设置
  const settings = ref(loadSettings())

  // 监听变化，自动保存
  watch(
    favorites,
    (newFavorites) => {
      saveFavorites(newFavorites)
    },
    { deep: true }
  )

  watch(
    settings,
    (newSettings) => {
      saveSettings(newSettings)
    },
    { deep: true }
  )

  // 添加收藏
  function addFavorite(formulaId: string) {
    if (!favorites.value.includes(formulaId)) {
      favorites.value.push(formulaId)
    }
  }

  // 移除收藏
  function removeFavorite(formulaId: string) {
    const index = favorites.value.indexOf(formulaId)
    if (index > -1) {
      favorites.value.splice(index, 1)
    }
  }

  // 判断是否已收藏
  function isFavorite(formulaId: string): boolean {
    return favorites.value.includes(formulaId)
  }

  // 清空收藏
  function clearFavorites() {
    favorites.value = []
  }

  // 更新设置
  function updateSetting(key: string, value: any) {
    settings.value[key] = value
  }

  return {
    favorites,
    settings,
    addFavorite,
    removeFavorite,
    isFavorite,
    clearFavorites,
    updateSetting,
  }
})
