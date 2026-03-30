<template>
  <div class="formula-detail-container">
    <div class="header">
      <n-button text @click="router.push('/formulas')">
        ← 返回
      </n-button>
    </div>

    <div class="content">
      <div class="formula-header">
        <h1>{{ formula.name }}</h1>
        <n-button
          :type="isFav ? 'error' : 'default'"
          @click="toggleFavorite"
        >
          {{ isFav ? '❤️ 已收藏' : '🤍 收藏' }}
        </n-button>
      </div>

      <div class="formula-section">
        <h2>公式</h2>
        <div class="formula-box">
          <code>{{ formula.formula }}</code>
          <button @click="copyFormula" class="copy-btn">📋 复制</button>
        </div>
      </div>

      <div class="formula-section">
        <h2>描述</h2>
        <p>{{ formula.description }}</p>
      </div>

      <div class="formula-section">
        <h2>标签</h2>
        <div class="tags-list">
          <n-tag v-for="tag in formula.tags" :key="tag" type="info">
            {{ tag }}
          </n-tag>
        </div>
      </div>

      <div class="formula-section">
        <h2>示例</h2>
        <n-tabs type="line" animated>
          <n-tab-pane name="basic" tab="基础示例">
            <ExampleDisplay :example="formula.examples.basic" />
          </n-tab-pane>
          <n-tab-pane name="advanced" tab="高级示例">
            <ExampleDisplay :example="formula.examples.advanced" />
          </n-tab-pane>
          <n-tab-pane name="nested" tab="嵌套示例">
            <ExampleDisplay :example="formula.examples.nested" />
          </n-tab-pane>
          <n-tab-pane name="real" tab="实战场景">
            <div v-if="formula.examples.real" class="real-scenario">
              <div class="scenario-box">
                <h4>场景：</h4>
                <p>{{ getScenario(formula.id) }}</p>
              </div>
              <ExampleDisplay :example="formula.examples.real" />
            </div>
          </n-tab-pane>
        </n-tabs>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMainStore } from '../store'
import { useMessage } from 'naive-ui'
import { NButton, NTabs, NTabPane, NTag } from 'naive-ui'
import { formulas } from '../utils/data'
import type { Formula } from '../types'
import ExampleDisplay from '../components/ExampleDisplay.vue'

const route = useRoute()
const router = useRouter()
const store = useMainStore()
const message = useMessage()

const formula = ref<Formula>(formulas[0])

const isFav = computed(() => store.isFavorite(formula.value.id))

const scenarios: Record<string, string> = {
  '1': '在一个销售记录表中，根据产品编号查找对应的单价',
  '2': '统计某类别的总销售额，例如统计所有"电子产品"的销售额',
  '3': '双向查找：可以根据行标题和列标题交叉查找值，比VLOOKUP更灵活',
  '4': '统计任务完成情况，计算已完成任务的数量',
}

function getScenario(formulaId: string): string {
  return scenarios[formulaId] || '实际应用场景示例'
}

function toggleFavorite() {
  if (isFav.value) {
    store.removeFavorite(formula.value.id)
  } else {
    store.addFavorite(formula.value.id)
  }
}

function copyFormula() {
  navigator.clipboard.writeText(formula.value.formula).then(() => {
    message.success('📋 公式已复制到剪贴板')
  }).catch(() => {
    message.error('❌ 复制失败，请重试')
  })
}

onMounted(() => {
  const formulaId = route.params.id as string
  const found = formulas.find((f) => f.id === formulaId)
  if (found) {
    formula.value = found
  }
})
</script>

<style scoped lang="scss">
.formula-detail-container {
  min-height: 100vh;
  background: #f9fafb;
  padding: 2rem;
}

.header {
  margin-bottom: 2rem;
}

.content {
  max-width: 900px;
  margin: 0 auto;
}

.formula-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.formula-header h1 {
  margin: 0;
  font-size: 2rem;
  color: #111827;
}

.formula-section {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.formula-section h2 {
  margin: 0 0 1rem 0;
  font-size: 1.25rem;
  color: #111827;
}

.formula-section p {
  color: #6b7280;
  line-height: 1.6;
}

.formula-box {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1.5rem;
  border-radius: 8px;
  overflow-x: auto;
  position: relative;
}

.copy-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  backdrop-filter: blur(10px);
}

.copy-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

.formula-box code {
  font-family: 'Courier New', monospace;
  font-size: 1rem;
  color: white;
  font-weight: 600;
}

.tags-list {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.real-scenario {
  .scenario-box {
    background: #eff6ff;
    border-left: 4px solid #3b82f6;
    padding: 1rem;
    margin-bottom: 1.5rem;
    border-radius: 4px;
  }

  .scenario-box h4 {
    margin: 0 0 0.5rem 0;
    color: #1e40af;
  }

  .scenario-box p {
    margin: 0;
    color: #6b7280;
  }
}

@media (max-width: 768px) {
  .formula-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .formula-section {
    padding: 1.5rem;
  }
}
</style>
