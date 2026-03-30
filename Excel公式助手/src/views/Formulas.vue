<template>
  <div class="formulas-container">
    <div class="header">
      <h1>公式浏览</h1>
      <n-input
        v-model:value="searchQuery"
        placeholder="搜索公式..."
        clearable
        style="width: 300px"
      >
        <template #prefix>
          <span>🔍</span>
        </template>
      </n-input>
    </div>

    <div class="content">
      <div class="filters">
        <h3>标签筛选</h3>
        <n-tag
          v-for="tag in allTags"
          :key="tag"
          :type="selectedTags.includes(tag) ? 'primary' : 'default'"
          :bordered="selectedTags.includes(tag)"
          checkable
          @update:checked="toggleTag(tag)"
        >
          {{ tag }}
        </n-tag>
      </div>

      <div class="formulas-list">
        <div
          v-for="formula in filteredFormulas"
          :key="formula.id"
          class="formula-card"
          @click="router.push(`/formulas/${formula.id}`)"
        >
          <h3>{{ formula.name }}</h3>
          <p class="formula-text">{{ formula.formula }}</p>
          <p class="formula-description">{{ formula.description }}</p>
          <div class="formula-tags">
            <n-tag v-for="tag in formula.tags" :key="tag" size="small">
              {{ tag }}
            </n-tag>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { NInput, NTag } from 'naive-ui'
import { formulas, tags as allTags } from '../utils/data'
import { searchFormulas, filterFormulasByTags } from '../utils/formulaHelper'
import type { Formula } from '../types'

const router = useRouter()
const searchQuery = ref('')
const selectedTags = ref<string[]>([])

const filteredFormulas = computed(() => {
  let result = formulas as Formula[]

  if (selectedTags.value.length > 0) {
    result = filterFormulasByTags(result, selectedTags.value)
  }

  if (searchQuery.value) {
    result = searchFormulas(result, searchQuery.value)
  }

  return result
})

function toggleTag(tag: string) {
  const index = selectedTags.value.indexOf(tag)
  if (index > -1) {
    selectedTags.value.splice(index, 1)
  } else {
    selectedTags.value.push(tag)
  }
}
</script>

<style scoped lang="scss">
.formulas-container {
  min-height: 100vh;
  background: #f9fafb;
  padding: 2rem;
}

.header {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.header h1 {
  margin: 0;
  font-size: 1.5rem;
}

.content {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 1.5rem;
}

.filters {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  position: sticky;
  top: 1rem;
  height: fit-content;
}

.filters h3 {
  margin: 0 0 0.75rem 0;
  font-size: 1rem;
}

.filters :deep(.n-tag) {
  margin-bottom: 0.5rem;
  width: 100%;
}

.formulas-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.formula-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
}

.formula-card h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
  color: #111827;
}

.formula-text {
  background: #f3f4f6;
  padding: 0.75rem;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  margin: 0.5rem 0;
  font-size: 0.875rem;
  color: #2563eb;
  word-break: break-all;
}

.formula-description {
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0.5rem 0;
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
  margin-top: 0.5rem;
}

@media (max-width: 768px) {
  .content {
    grid-template-columns: 1fr;
  }

  .filters {
    position: static;
  }

  .formulas-list {
    grid-template-columns: 1fr;
  }
}
</style>
