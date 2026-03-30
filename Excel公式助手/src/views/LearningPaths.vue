<template>
  <div class="learning-paths-container">
    <div class="header">
      <h1>📚 学习路径</h1>
      <p>系统化学习Excel公式，从入门到精通</p>
    </div>

    <div class="content">
      <div class="paths-list">
        <div
          v-for="path in learningPaths"
          :key="path.id"
          class="path-card"
          :class="getDifficultyClass(path.difficulty)"
        >
          <div class="path-header">
            <div class="path-info">
              <div class="path-difficulty">
                <n-tag :type="getDifficultyType(path.difficulty)">
                  {{ getDifficultyText(path.difficulty) }}
                </n-tag>
              </div>
              <h2>{{ path.name }}</h2>
              <p class="path-description">{{ path.description }}</p>
            </div>
            <div class="path-meta">
              <div class="meta-item">
                <span class="meta-icon">📖</span>
                <span>{{ path.formulaIds.length }} 个公式</span>
              </div>
              <div class="meta-item">
                <span class="meta-icon">⏱️</span>
                <span>{{ path.estimatedTime }} 分钟</span>
              </div>
            </div>
          </div>

          <div class="path-formulas">
            <h3>包含公式</h3>
            <div class="formulas-grid">
              <div
                v-for="formulaId in path.formulaIds"
                :key="formulaId"
                class="formula-item"
                @click="viewFormula(formulaId)"
              >
                {{ getFormulaName(formulaId) }}
              </div>
            </div>
          </div>

          <div class="path-actions">
            <n-button type="primary" @click="startPath(path.id)">
              开始学习
            </n-button>
            <n-button @click="toggleExpand(path.id)">
              {{ isExpanded(path.id) ? '收起' : '展开' }}
            </n-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { NButton, NTag } from 'naive-ui'
import { learningPaths, formulas } from '../utils/data'

const router = useRouter()
const expandedPaths = ref<string[]>([])

function getDifficultyClass(difficulty: string): string {
  return `path-${difficulty}`
}

function getDifficultyType(difficulty: string): 'default' | 'primary' | 'info' | 'success' | 'warning' | 'error' {
  const types: Record<string, 'default' | 'primary' | 'info' | 'success' | 'warning' | 'error'> = {
    beginner: 'success',
    intermediate: 'warning',
    advanced: 'error',
  }
  return types[difficulty] || 'default'
}

function getDifficultyText(difficulty: string): string {
  const texts: Record<string, string> = {
    beginner: '初级',
    intermediate: '中级',
    advanced: '高级',
  }
  return texts[difficulty] || '未知'
}

function getFormulaName(formulaId: string): string {
  const formula = formulas.find((f) => f.id === formulaId)
  return formula ? formula.name : '未知'
}

function viewFormula(formulaId: string) {
  router.push(`/formulas/${formulaId}`)
}

function startPath(pathId: string) {
  // 开始学习路径
  const path = learningPaths.find((p) => p.id === pathId)
  if (path && path.formulaIds.length > 0) {
    // 跳转到第一个公式
    router.push(`/formulas/${path.formulaIds[0]}`)
  }
}

function toggleExpand(pathId: string) {
  const index = expandedPaths.value.indexOf(pathId)
  if (index > -1) {
    expandedPaths.value.splice(index, 1)
  } else {
    expandedPaths.value.push(pathId)
  }
}

function isExpanded(pathId: string): boolean {
  return expandedPaths.value.includes(pathId)
}
</script>

<style scoped lang="scss">
.learning-paths-container {
  min-height: 100vh;
  background: #f9fafb;
  padding: 2rem;
}

.header {
  text-align: center;
  margin-bottom: 3rem;
}

.header h1 {
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
  color: #111827;
}

.header p {
  margin: 0;
  color: #6b7280;
  font-size: 1.125rem;
}

.content {
  max-width: 900px;
  margin: 0 auto;
}

.paths-list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.path-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 2px solid transparent;
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  &.path-beginner {
    border-color: #10b981;
  }

  &.path-intermediate {
    border-color: #f59e0b;
  }

  &.path-advanced {
    border-color: #ef4444;
  }
}

.path-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  gap: 1.5rem;
}

.path-info {
  flex: 1;
}

.path-difficulty {
  margin-bottom: 0.75rem;
}

.path-header h2 {
  margin: 0.5rem 0;
  font-size: 1.5rem;
  color: #111827;
}

.path-description {
  margin: 0;
  color: #6b7280;
  line-height: 1.6;
}

.path-meta {
  display: flex;
  gap: 1.5rem;
  flex-shrink: 0;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 0.875rem;
}

.meta-icon {
  font-size: 1.25rem;
}

.path-formulas {
  margin-bottom: 1.5rem;
  overflow: hidden;
  max-height: 0;
  transition: max-height 0.3s ease-out;

  &.expanded {
    max-height: 500px;
  }
}

.path-formulas h3 {
  margin: 0 0 1rem 0;
  font-size: 1.125rem;
  color: #111827;
}

.formulas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.75rem;
}

.formula-item {
  background: #f3f4f6;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  text-align: center;
  font-size: 0.875rem;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #e5e7eb;
    color: #111827;
  }
}

.path-actions {
  display: flex;
  gap: 0.75rem;
}

@media (max-width: 768px) {
  .path-header {
    flex-direction: column;
  }

  .path-meta {
    flex-direction: column;
    gap: 0.5rem;
  }

  .formulas-grid {
    grid-template-columns: 1fr;
  }

  .path-actions {
    flex-direction: column;

    .n-button {
      width: 100%;
    }
  }
}
</style>
