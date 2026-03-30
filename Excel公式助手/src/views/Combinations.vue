<template>
  <div class="combinations-container">
    <div class="header">
      <h1>🔗 公式组合</h1>
      <p>多个公式组合使用，解决复杂问题</p>
      <div class="header-actions">
        <button @click="goToGenerator" class="btn-generator">
          🧩 公式生成器
        </button>
      </div>
    </div>

    <div class="filters">
      <div class="filter-group">
        <label>难度：</label>
        <select v-model="selectedDifficulty" @change="filterCombinations">
          <option value="">全部</option>
          <option value="初级">初级</option>
          <option value="中级">中级</option>
          <option value="高级">高级</option>
        </select>
      </div>
      <div class="filter-group">
        <label>常用度：</label>
        <select v-model="selectedPopularity" @change="filterCombinations">
          <option value="">全部</option>
          <option value="5">★★★★★</option>
          <option value="4">★★★★☆</option>
          <option value="3">★★★☆☆</option>
          <option value="2">★★☆☆☆</option>
        </select>
      </div>
      <div class="search-box">
        <input
          v-model="searchKeyword"
          @input="filterCombinations"
          placeholder="搜索组合..."
          class="search-input"
        />
      </div>
    </div>

    <div class="content">
      <div v-if="filteredCombinations.length === 0" class="empty-state">
        <p>没有找到匹配的组合</p>
      </div>

      <div v-else class="combinations-list">
        <div v-for="combo in filteredCombinations" :key="combo.id" class="combo-card">
          <div class="combo-header">
            <h2>{{ combo.name }}</h2>
            <div class="combo-tags">
              <span class="tag" :class="combo.difficulty">
                {{ combo.difficulty }}
              </span>
              <span class="tag popularity">
                {{ '★'.repeat(combo.popularity) }}
              </span>
            </div>
          </div>

          <div class="combo-formulas">
            <n-tag
              v-for="formula in combo.formulas"
              :key="formula"
              type="info"
              size="small"
            >
              {{ formula }}
            </n-tag>
          </div>

          <div class="combo-description">
            <p>{{ combo.description }}</p>
          </div>

          <div class="combo-formula-display">
            <label>组合公式</label>
            <code>{{ combo.combinationFormula }}</code>
          </div>

          <div class="combo-stats">
            <div class="stat-item">
              <div class="stat-label">性能</div>
              <div class="stat-value">{{ combo.performance.vsSingleFormula }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">适用数据量</div>
              <div class="stat-value">{{ combo.performance.dataSize }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">加载时间</div>
              <div class="stat-value">{{ combo.performance.loadTime }}</div>
            </div>
          </div>

          <div class="combo-actions">
            <button @click="startPractice(combo.id)" class="btn-practice">
              📝 开始练习
            </button>
            <button @click="copyFormula(combo.combinationFormula)" class="btn-copy">
              📋 复制公式
            </button>
            <button @click="showDetail(combo)" class="btn-detail">
              📖 查看详情
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { NTag } from 'naive-ui'
import { useRouter } from 'vue-router'
import { formulaCombinations } from '../utils/formulaCombinations'
import type { FormulaCombination } from '../types'

const router = useRouter()

const selectedDifficulty = ref('')
const selectedPopularity = ref('')
const searchKeyword = ref('')
const filteredCombinations = ref<FormulaCombination[]>([])

onMounted(() => {
  filterCombinations()
})

function filterCombinations() {
  filteredCombinations.value = formulaCombinations.filter(combo => {
    // 难度筛选
    if (selectedDifficulty.value && combo.difficulty !== selectedDifficulty.value) {
      return false
    }

    // 常用度筛选
    if (selectedPopularity.value && combo.popularity < parseInt(selectedPopularity.value)) {
      return false
    }

    // 关键词搜索
    if (searchKeyword.value) {
      const keyword = searchKeyword.value.toLowerCase()
      const searchText = `${combo.name} ${combo.description} ${combo.formulas.join(' ')}`.toLowerCase()
      if (!searchText.includes(keyword)) {
        return false
      }
    }

    return true
  })
}

function goToGenerator() {
  router.push('/combinations/generator')
}

function startPractice(id: number) {
  router.push(`/combinations/practice/${id}`)
}

function copyFormula(formula: string) {
  navigator.clipboard.writeText(formula).then(() => {
    // TODO: 显示复制成功提示
  })
}

function showDetail(combo: FormulaCombination) {
  // TODO: 显示详情对话框
  console.log(combo)
}
</script>

<style scoped>
.combinations-container {
  min-height: 100vh;
  background: #f9fafb;
  padding: 20px;
}

.header {
  text-align: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #e5e7eb;
}

.header h1 {
  margin: 0 0 8px 0;
  font-size: 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.header p {
  margin: 0 0 16px 0;
  color: #6b7280;
  font-size: 16px;
}

.header-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.btn-generator {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-generator:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.filters {
  max-width: 900px;
  margin: 0 auto 30px auto;
  display: flex;
  gap: 20px;
  align-items: center;
  background: white;
  padding: 16px 20px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-group label {
  font-weight: 600;
  color: #374151;
  font-size: 14px;
}

.filter-group select {
  padding: 8px 12px;
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-group select:focus {
  outline: none;
  border-color: #667eea;
}

.search-box {
  flex: 1;
}

.search-input {
  width: 100%;
  padding: 8px 12px;
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.content {
  max-width: 900px;
  margin: 0 auto;
}

.empty-state {
  text-align: center;
  padding: 40px;
  background: white;
  border-radius: 12px;
  color: #6b7280;
}

.combinations-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.combo-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.2s;
}

.combo-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.combo-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  gap: 12px;
}

.combo-header h2 {
  margin: 0;
  font-size: 20px;
  color: #111827;
}

.combo-tags {
  display: flex;
  gap: 8px;
}

.tag {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
}

.tag.初级 {
  background: #d4edda;
  color: #155724;
}

.tag.中级 {
  background: #fff3cd;
  color: #856404;
}

.tag.高级 {
  background: #f8d7da;
  color: #721c24;
}

.tag.popularity {
  background: #e2e3e5;
  color: #383d41;
}

.combo-formulas {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.combo-description {
  margin-bottom: 16px;
}

.combo-description p {
  margin: 0;
  color: #6b7280;
  line-height: 1.6;
}

.combo-formula-display {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 16px;
}

.combo-formula-display label {
  display: block;
  color: rgba(255, 255, 255, 0.9);
  font-size: 13px;
  margin-bottom: 8px;
  font-weight: 600;
}

.combo-formula-display code {
  display: block;
  color: white;
  font-family: 'Courier New', monospace;
  font-size: 15px;
  font-weight: 600;
  word-break: break-all;
  line-height: 1.6;
}

.combo-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 20px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
}

.stat-item {
  text-align: center;
}

.stat-label {
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 4px;
  font-weight: 600;
}

.stat-value {
  font-size: 14px;
  color: #111827;
  font-weight: 600;
}

.combo-actions {
  display: flex;
  gap: 12px;
}

.combo-actions button {
  flex: 1;
  padding: 12px 16px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.combo-actions button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn-practice {
  background: #667eea;
  color: white;
}

.btn-practice:hover {
  background: #5568d3;
}

.btn-copy {
  background: #48bb78;
  color: white;
}

.btn-copy:hover {
  background: #38a169;
}

.btn-detail {
  background: #ed8936;
  color: white;
}

.btn-detail:hover {
  background: #dd6b20;
}

@media (max-width: 768px) {
  .filters {
    flex-direction: column;
  }

  .filter-group,
  .search-box {
    width: 100%;
  }

  .combo-header {
    flex-direction: column;
  }

  .combo-tags {
    width: 100%;
  }

  .combo-stats {
    grid-template-columns: 1fr;
  }

  .combo-actions {
    flex-direction: column;
  }
}
</style>
