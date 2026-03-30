<template>
  <div class="compare-container">
    <div class="header">
      <h1>公式对比</h1>
      <n-button type="primary" @click="addComparison" :disabled="selectedFormulas.length < 2">
        开始对比
      </n-button>
    </div>

    <div class="content">
      <div class="formula-selector">
        <h3>选择要对比的公式（最多3个）</h3>
        <div class="formula-list">
          <div
            v-for="formula in allFormulas"
            :key="formula.id"
            class="formula-item"
            :class="{ selected: isSelected(formula.id) }"
            @click="toggleSelection(formula.id)"
          >
            <div class="formula-info">
              <span class="formula-name">{{ formula.name }}</span>
              <span class="formula-brief">{{ formula.formula }}</span>
            </div>
            <div class="select-indicator" v-if="isSelected(formula.id)">
              ✅
            </div>
          </div>
        </div>
      </div>

      <div v-if="showComparison" class="comparison-result">
        <h3>对比结果</h3>
        <div class="comparison-table">
          <table>
            <thead>
              <tr>
                <th>对比项</th>
                <th v-for="formula in comparisonFormulas" :key="formula.id">
                  {{ formula.name }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>公式</td>
                <td v-for="formula in comparisonFormulas" :key="formula.id">
                  <code>{{ formula.formula }}</code>
                </td>
              </tr>
              <tr>
                <td>描述</td>
                <td v-for="formula in comparisonFormulas" :key="formula.id">
                  {{ formula.description }}
                </td>
              </tr>
              <tr>
                <td>标签</td>
                <td v-for="formula in comparisonFormulas" :key="formula.id">
                  <n-tag
                    v-for="tag in formula.tags"
                    :key="tag"
                    size="small"
                    type="info"
                  >
                    {{ tag }}
                  </n-tag>
                </td>
              </tr>
              <tr>
                <td>使用场景</td>
                <td v-for="formula in comparisonFormulas" :key="formula.id">
                  {{ getScenario(formula.id) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { NButton, NTag } from 'naive-ui'
import { formulas as allFormulas } from '../utils/data'
import type { Formula } from '../types'

const selectedFormulas = ref<string[]>([])
const showComparison = ref(false)

const comparisonFormulas = computed(() => {
  return allFormulas.filter((f: Formula) => selectedFormulas.value.includes(f.id))
})

const scenarios: Record<string, string> = {
  '1': '根据产品编号查找对应的单价',
  '2': '统计某类别的总销售额',
  '3': '双向查找，比VLOOKUP更灵活',
  '4': '统计任务完成情况',
}

function getScenario(formulaId: string): string {
  return scenarios[formulaId] || '-'
}

function isSelected(formulaId: string): boolean {
  return selectedFormulas.value.includes(formulaId)
}

function toggleSelection(formulaId: string) {
  if (isSelected(formulaId)) {
    // 取消选择
    const index = selectedFormulas.value.indexOf(formulaId)
    selectedFormulas.value.splice(index, 1)
  } else {
    // 添加选择（最多3个）
    if (selectedFormulas.value.length < 3) {
      selectedFormulas.value.push(formulaId)
    }
  }

  // 如果选择少于2个，隐藏对比结果
  if (selectedFormulas.value.length < 2) {
    showComparison.value = false
  }
}

function addComparison() {
  if (selectedFormulas.value.length >= 2) {
    showComparison.value = true
  }
}
</script>

<style scoped lang="scss">
.compare-container {
  min-height: 100vh;
  background: #f9fafb;
  padding: 2rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  background: white;
  padding: 1.5rem 2rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.header h1 {
  margin: 0;
  font-size: 1.5rem;
  color: #111827;
}

.content {
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 2rem;
  align-items: start;
}

.formula-selector {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  max-height: calc(100vh - 200px);
  overflow-y: auto;
}

.formula-selector h3 {
  margin: 0 0 1rem 0;
  font-size: 1.125rem;
  color: #111827;
}

.formula-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.formula-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #3b82f6;
    background: #eff6ff;
  }

  &.selected {
    border-color: #10b981;
    background: #d1fae5;
  }
}

.formula-info {
  flex: 1;
}

.formula-name {
  display: block;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.25rem;
}

.formula-brief {
  display: block;
  font-size: 0.875rem;
  color: #6b7280;
  font-family: 'Courier New', monospace;
}

.select-indicator {
  font-size: 1.25rem;
}

.comparison-result {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.comparison-result h3 {
  margin: 0 0 1.5rem 0;
  font-size: 1.25rem;
  color: #111827;
}

.comparison-table {
  overflow-x: auto;
}

.comparison-table table {
  width: 100%;
  border-collapse: collapse;
}

.comparison-table th,
.comparison-table td {
  border: 1px solid #e5e7eb;
  padding: 1rem;
  text-align: left;
}

.comparison-table th {
  background: #f3f4f6;
  font-weight: 600;
  color: #111827;
  white-space: nowrap;
}

.comparison-table td:first-child {
  background: #f9fafb;
  font-weight: 600;
  color: #374151;
  white-space: nowrap;
}

.comparison-table code {
  display: block;
  padding: 0.5rem;
  background: #f3f4f6;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
  color: #2563eb;
  word-break: break-all;
}

@media (max-width: 1024px) {
  .content {
    grid-template-columns: 1fr;
  }

  .formula-selector {
    max-height: none;
  }
}
</style>
