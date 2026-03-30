<template>
  <n-config-provider :theme="theme" :theme-overrides="themeOverrides">
    <n-message-provider>
      <div class="app-container">
        <n-layout>
          <n-layout-header bordered>
          <div class="header">
            <div class="logo" @click="router.push('/')">
              <span class="logo-icon">📊</span>
              <span class="logo-text">Excel公式助手</span>
            </div>
            <nav class="nav">
              <n-button
                text
                :type="route.path === '/recommend' ? 'primary' : 'default'"
                @click="router.push('/recommend')"
              >
                🔮 公式推荐
              </n-button>
              <n-button
                text
                :type="route.path === '/formulas' ? 'primary' : 'default'"
                @click="router.push('/formulas')"
              >
                公式浏览
              </n-button>
              <n-button
                text
                :type="route.path === '/practice' ? 'primary' : 'default'"
                @click="router.push('/practice')"
              >
                练习
              </n-button>
              <n-button
                text
                :type="route.path === '/learning-paths' ? 'primary' : 'default'"
                @click="router.push('/learning-paths')"
              >
                📚 学习路径
              </n-button>
              <n-button
                text
                :type="route.path === '/real-cases' ? 'primary' : 'default'"
                @click="router.push('/real-cases')"
              >
                💼 实战案例
              </n-button>
              <n-button
                text
                :type="route.path === '/compare' ? 'primary' : 'default'"
                @click="router.push('/compare')"
              >
                公式对比
              </n-button>
              <n-button
                text
                :type="route.path === '/combinations' ? 'primary' : 'default'"
                @click="router.push('/combinations')"
              >
                🔗 公式组合
              </n-button>
              <n-button
                text
                :type="route.path === '/favorites' ? 'primary' : 'default'"
                @click="router.push('/favorites')"
              >
                收藏
              </n-button>
              <n-button
                text
                :type="route.path === '/settings' ? 'primary' : 'default'"
                @click="router.push('/settings')"
              >
                设置
              </n-button>
            </nav>
          </div>
        </n-layout-header>

        <n-layout-content content-style="padding: 24px;">
          <router-view />
        </n-layout-content>

        <n-layout-footer bordered>
          <div class="footer">
            <p>© 2026 Excel公式助手 - 让Excel更简单</p>
          </div>
        </n-layout-footer>
      </n-layout>
    </div>
    </n-message-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { NConfigProvider, NMessageProvider, NLayout, NLayoutHeader, NLayoutContent, NLayoutFooter, NButton, darkTheme, lightTheme, type GlobalTheme } from 'naive-ui'
import { useMainStore } from './store'

const route = useRoute()
const router = useRouter()
const store = useMainStore()

// 根据设置的主题选择主题
const theme = computed<GlobalTheme | null>(() => {
  return store.settings.theme === 'dark' ? darkTheme : null
})

// 主题覆盖设置
const themeOverrides = computed(() => {
  if (store.settings.theme === 'dark') {
    return {
      common: {
        primaryColor: '#60a5fa',
        primaryColorHover: '#93c5fd',
        primaryColorPressed: '#3b82f6',
        primaryColorSuppl: '#60a5fa',
      }
    }
  }
  return {}
})

onMounted(() => {
  // 应用HTML类
  applyTheme()
})

// 监听主题变化
watch(() => store.settings.theme, () => {
  applyTheme()
})

function applyTheme() {
  const html = document.documentElement
  if (store.settings.theme === 'dark') {
    html.classList.add('dark')
  } else {
    html.classList.remove('dark')
  }
}
</script>

<style scoped lang="scss">
.app-container {
  min-height: 100vh;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 1.25rem;
  font-weight: 600;
}

.logo-icon {
  font-size: 1.5rem;
}

.logo-text {
  color: #2563eb;
}

.nav {
  display: flex;
  gap: 0.5rem;
}

.footer {
  text-align: center;
  padding: 1rem;
  color: #6b7280;
}

.footer p {
  margin: 0;
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    gap: 1rem;
  }

  .nav {
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>
