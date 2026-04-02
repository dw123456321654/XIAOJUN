<template>
  <div class="settings-container">
    <div class="header">
      <h1>设置</h1>
    </div>

    <div class="content">
      <div class="settings-section">
        <h2>外观设置</h2>

        <div class="setting-item">
          <div class="setting-info">
            <label class="setting-label">主题</label>
            <p class="setting-description">选择应用的主题风格</p>
          </div>
          <n-radio-group v-model:value="theme" @update:value="updateTheme">
            <n-radio value="light">浅色</n-radio>
            <n-radio value="dark">深色</n-radio>
          </n-radio-group>
        </div>

        <div class="setting-item">
          <div class="setting-info">
            <label class="setting-label">字体大小</label>
            <p class="setting-description">调整应用的字体大小</p>
          </div>
          <n-select
            v-model:value="fontSize"
            :options="fontSizeOptions"
            @update:value="updateFontSize"
            style="width: 150px"
          />
        </div>
      </div>

      <div class="settings-section">
        <h2>数据管理</h2>

        <div class="setting-item">
          <div class="setting-info">
            <label class="setting-label">收藏列表</label>
            <p class="setting-description">您当前收藏了 {{ favorites.length }} 个公式</p>
          </div>
          <n-button type="error" @click="clearFavorites">
            清空收藏
          </n-button>
        </div>
      </div>

      <div class="settings-section">
        <h2>关于</h2>

        <div class="setting-item">
          <div class="setting-info">
            <label class="setting-label">应用版本</label>
            <p class="setting-description">Excel公式助手 v0.2.3</p>
          </div>
        </div>

        <div class="setting-item">
          <div class="setting-info">
            <label class="setting-label">技术栈</label>
            <p class="setting-description">
              Tauri + Vue 3 + TypeScript + Naive UI
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useMainStore } from '../store'
import { NRadioGroup, NRadio, NSelect, NButton } from 'naive-ui'

const store = useMainStore()
const favorites = ref<string[]>([])
const theme = ref('light')
const fontSize = ref('medium')

const fontSizeOptions = [
  { label: '小', value: 'small' },
  { label: '中', value: 'medium' },
  { label: '大', value: 'large' },
]

onMounted(() => {
  favorites.value = store.favorites
  theme.value = store.settings.theme
  fontSize.value = store.settings.fontSize
  applyFontSize()
})

function updateTheme(value: string) {
  theme.value = value
  store.updateSetting('theme', value)
}

function updateFontSize(value: string) {
  fontSize.value = value
  store.updateSetting('fontSize', value)
  applyFontSize()
}

function applyFontSize() {
  const fontSizeMap: Record<string, string> = {
    small: '14px',
    medium: '16px',
    large: '18px',
  }
  document.documentElement.style.fontSize = fontSizeMap[fontSize.value]
}

function clearFavorites() {
  if (confirm('确定要清空所有收藏吗？')) {
    store.clearFavorites()
    favorites.value = []
  }
}

// 监听store中favorites的变化
watch(() => store.favorites, (newFavorites) => {
  favorites.value = newFavorites
})
</script>

<style scoped lang="scss">
.settings-container {
  min-height: 100vh;
  background: #f9fafb;
  padding: 2rem;
}

.header {
  background: white;
  padding: 1.5rem 2rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.header h1 {
  margin: 0;
  font-size: 1.5rem;
  color: #111827;
}

.content {
  max-width: 800px;
  margin: 0 auto;
}

.settings-section {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.settings-section h2 {
  margin: 0 0 1.5rem 0;
  font-size: 1.25rem;
  color: #111827;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 0.75rem;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 0;
  border-bottom: 1px solid #e5e7eb;

  &:last-child {
    border-bottom: none;
  }
}

.setting-info {
  flex: 1;
}

.setting-label {
  display: block;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.375rem;
  font-size: 1rem;
}

.setting-description {
  margin: 0;
  color: #6b7280;
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .settings-section {
    padding: 1.5rem;
  }

  .setting-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}
</style>
