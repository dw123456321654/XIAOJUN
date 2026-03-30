<template>
  <div class="favorites-container">
    <div class="header">
      <h1>我的收藏</h1>
      <n-tag :bordered="false" type="info" size="large">
        {{ favorites.length }} 个公式
      </n-tag>
    </div>

    <div v-if="favorites.length === 0" class="empty-state">
      <div class="empty-icon">⭐</div>
      <p>还没有收藏任何公式</p>
      <n-button type="primary" size="large" @click="router.push('/formulas')">
        浏览公式
      </n-button>
    </div>

    <div v-else class="formulas-list">
      <div
        v-for="formula in favorites"
        :key="formula.id"
        class="formula-card"
        @click="router.push(`/formulas/${formula.id}`)"
      >
        <div class="formula-header">
          <h3>{{ formula.name }}</h3>
          <n-button
            text
            type="error"
            @click.stop="removeFavorite(formula.id)"
          >
            ❌
          </n-button>
        </div>
        <p class="formula-text">{{ formula.formula }}</p>
        <p class="formula-description">{{ formula.description }}</p>
        <div class="formula-tags">
          <n-tag v-for="tag in formula.tags" :key="tag" size="small" type="info">
            {{ tag }}
          </n-tag>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useMainStore } from '../store'
import { NButton, NTag } from 'naive-ui'
import { formulas } from '../utils/data'
import type { Formula } from '../types'

const router = useRouter()
const store = useMainStore()

const favorites = computed(() => {
  return formulas.filter((f: Formula) => store.favorites.includes(f.id))
})

function removeFavorite(formulaId: string) {
  store.removeFavorite(formulaId)
}
</script>

<style scoped lang="scss">
.favorites-container {
  min-height: 100vh;
  background: #f9fafb;
  padding: 2rem;
}

.header {
  background: white;
  padding: 1.5rem 2rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.header h1 {
  margin: 0;
  font-size: 1.5rem;
  color: #111827;
}

.empty-state {
  text-align: center;
  padding: 6rem 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.empty-icon {
  font-size: 5rem;
  margin-bottom: 1.5rem;
  opacity: 0.6;
}

.empty-state p {
  color: #6b7280;
  font-size: 1.125rem;
  margin-bottom: 2rem;
}

.formulas-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.formula-card {
  background: white;
  padding: 1.75rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;

  &:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
    transform: translateY(-4px);
    border-color: #3b82f6;
  }
}

.formula-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.formula-header h3 {
  margin: 0;
  font-size: 1.375rem;
  color: #111827;
}

.formula-text {
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  padding: 0.875rem 1rem;
  border-radius: 6px;
  font-family: 'Courier New', monospace;
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
  color: #2563eb;
  word-break: break-all;
}

.formula-description {
  color: #6b7280;
  font-size: 0.9375rem;
  margin-bottom: 0.75rem;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.formula-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .formulas-list {
    grid-template-columns: 1fr;
  }

  .formula-card {
    padding: 1.5rem;
  }
}
</style>
