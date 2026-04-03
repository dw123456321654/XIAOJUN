<template>
  <div class="formulas-container">
    <div class="header">
      <h1>公式浏览</h1>
      <n-input
        v-model:value="searchQuery"
        placeholder="搜索公式..."
        clearable
        style="width: 300px"
        @update:value="onSearchChange"
      >
        <template #prefix>
          <span>🔍</span>
        </template>
      </n-input>
    </div>

    <div class="content">
      <div class="filters">
        <h3>标签筛选</h3>
        <div class="tag-list">
          <span
            v-for="tag in allTags"
            :key="tag"
            class="tag-item"
            :class="{ active: selectedTags.includes(tag) }"
            @click="toggleTag(tag)"
          >
            {{ tag }}
          </span>
        </div>
        <div v-if="selectedTags.length > 0" class="selected-info">
          已选: {{ selectedTags.join(', ') }}
          <span class="clear-btn" @click="clearTags">清除</span>
        </div>
      </div>

      <div class="formulas-list">
        <div class="result-count">共 {{ displayFormulas.length }} 个公式</div>
        <div
          v-for="formula in displayFormulas"
          :key="formula.id"
          class="formula-card"
          @click="router.push(`/formulas/${formula.id}`)"
        >
          <h3>{{ formula.name }}</h3>
          <p class="formula-text">{{ formula.formula }}</p>
          <p class="formula-description">{{ formula.description }}</p>
          <div class="formula-tags">
            <span v-for="tag in formula.tags" :key="tag" class="formula-tag">
              {{ tag }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { NInput } from 'naive-ui'
import { formulas, tags as allTags } from '../utils/data'
import type { Formula } from '../types'

const router = useRouter()
const searchQuery = ref('')
const selectedTags = ref<string[]>([])
const displayFormulas = ref<Formula[]>([...formulas] as Formula[])

// 过滤函数
function updateDisplay() {
  let result = [...formulas] as Formula[]
  
  // 按标签筛选
  if (selectedTags.value.length > 0) {
    result = result.filter(f => 
      f.tags.some(tag => selectedTags.value.includes(tag))
    )
  }
  
  // 按搜索词筛选
  const query = searchQuery.value.trim().toLowerCase()
  if (query) {
    result = result.filter(f =>
      f.name.toLowerCase().includes(query) ||
      f.formula.toLowerCase().includes(query) ||
      f.description.toLowerCase().includes(query)
    )
  }
  
  displayFormulas.value = result
}

function toggleTag(tag: string) {
  const index = selectedTags.value.indexOf(tag)
  if (index > -1) {
    selectedTags.value.splice(index, 1)
  } else {
    selectedTags.value.push(tag)
  }
  updateDisplay()
}

function clearTags() {
  selectedTags.value = []
  updateDisplay()
}

function onSearchChange() {
  updateDisplay()
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
  grid-template-columns: 220px 1fr;
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

.tag-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tag-item {
  padding: 6px 12px;
  background: #f3f4f6;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
  
  &:hover {
    background: #e5e7eb;
  }
  
  &.active {
    background: #2563eb;
    color: white;
  }
}

.selected-info {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #e5e7eb;
  font-size: 12px;
  color: #6b7280;
}

.clear-btn {
  color: #2563eb;
  cursor: pointer;
  margin-left: 8px;
  
  &:hover {
    text-decoration: underline;
  }
}

.formulas-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.result-count {
  color: #6b7280;
  font-size: 14px;
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

.formula-tag {
  background: #e5e7eb;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  color: #374151;
}

@media (max-width: 768px) {
  .content {
    grid-template-columns: 1fr;
  }

  .filters {
    position: static;
  }
}
</style>
