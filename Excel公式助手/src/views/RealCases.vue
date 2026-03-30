<template>
  <div class="real-cases-container">
    <div class="header">
      <h1>📂 实战案例库</h1>
      <p>数码3C行业真实场景，20个实战案例</p>
      <div class="header-actions">
        <button @click="goToPractice" class="btn-practice">
          📝 交互式练习
        </button>
        <button @click="showPersonalSubmit" class="btn-submit">
          ➕ 提交个人案例
        </button>
      </div>
    </div>

    <div class="filters">
      <div class="filter-group">
        <label>行业：</label>
        <select v-model="selectedIndustry" @change="filterCases">
          <option value="">全部</option>
          <option v-for="industry in industries" :key="industry" :value="industry">
            {{ industry }}
          </option>
        </select>
      </div>

      <div class="filter-group">
        <label>类别：</label>
        <select v-model="selectedCategory" @change="filterCases">
          <option value="">全部</option>
          <option v-for="category in categories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
      </div>

      <div class="filter-group">
        <label>难度：</label>
        <select v-model="selectedDifficulty" @change="filterCases">
          <option value="">全部</option>
          <option value="初级">初级</option>
          <option value="中级">中级</option>
          <option value="高级">高级</option>
        </select>
      </div>

      <div class="search-box">
        <input
          v-model="searchKeyword"
          @input="filterCases"
          placeholder="搜索案例..."
          class="search-input"
        />
      </div>
    </div>

    <!-- 案例统计 -->
    <div class="stats">
      <div class="stat-item">
        <div class="stat-label">总案例</div>
        <div class="stat-value">{{ caseStats.total }}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">初级</div>
        <div class="stat-value">{{ caseStats.byDifficulty[0].count }}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">中级</div>
        <div class="stat-value">{{ caseStats.byDifficulty[1].count }}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">高级</div>
        <div class="stat-value">{{ caseStats.byDifficulty[2].count }}</div>
      </div>
    </div>

    <!-- 案例列表 -->
    <div v-if="filteredCases.length === 0" class="empty-state">
      <p>没有找到匹配的案例</p>
    </div>

    <div v-else class="cases-list">
      <div v-for="caseItem in filteredCases" :key="caseItem.id" class="case-card">
        <div class="case-header">
          <div class="case-info">
            <h2>{{ caseItem.title }}</h2>
            <div class="case-tags">
              <span class="tag industry">{{ caseItem.industry }}</span>
              <span class="tag category">{{ caseItem.category }}</span>
              <span class="tag" :class="caseItem.difficulty">
                {{ caseItem.difficulty }}
              </span>
            </div>
          </div>
          <div class="case-icon">📋</div>
        </div>

        <div class="case-description">
          <p>{{ caseItem.scenario }}</p>
        </div>

        <div class="case-data-preview">
          <label>数据模板：</label>
          <table class="data-table">
            <thead>
              <tr>
                <th v-for="(header, index) in caseItem.dataTemplate.headers.slice(0, 3)" :key="index">
                  {{ header }}
                </th>
                <th v-if="caseItem.dataTemplate.headers.length > 3">
                  ...
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, rowIndex) in caseItem.dataTemplate.rows.slice(0, 2)" :key="rowIndex">
                <td v-for="(cell, cellIndex) in row.slice(0, 3)" :key="cellIndex">
                  {{ cell }}
                </td>
                <td v-if="row.length > 3">
                  ...
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="case-steps">
          <label>实施步骤（{{ caseItem.steps.length }}步）：</label>
          <div class="steps-preview">
            <div v-for="(step, index) in caseItem.steps.slice(0, 3)" :key="index" class="step-item">
              <span class="step-number">{{ step.step }}</span>
              <span class="step-desc">{{ step.description }}</span>
            </div>
            <div v-if="caseItem.steps.length > 3" class="step-more">
              ... 等{{ caseItem.steps.length }}步
            </div>
          </div>
        </div>

        <div class="case-formulas">
          <label>关键公式：</label>
          <div class="formulas-list">
            <n-tag
              v-for="formula in caseItem.keyFormulas"
              :key="formula"
              type="info"
              size="small"
            >
              {{ formula }}
            </n-tag>
          </div>
        </div>

        <div class="case-actions">
          <button @click="viewCase(caseItem.id)" class="btn-detail">
            📖 查看详情
          </button>
          <button @click="downloadTemplate(caseItem)" class="btn-download">
            📥 下载模板
          </button>
          <button @click="applyCase(caseItem)" class="btn-apply">
            ✨ 应用案例
          </button>
          <button @click="copyFormulas(caseItem)" class="btn-copy">
            📋 复制公式
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
import { NTag } from 'naive-ui'
import { realCases, getAllIndustries, getAllCategories, getCaseStats } from '../utils/realCases'
import type { RealCase } from '../types'

const router = useRouter()
const message = useMessage()

// 筛选条件
const selectedIndustry = ref('')
const selectedCategory = ref('')
const selectedDifficulty = ref('')
const searchKeyword = ref('')

// 计算属性
const industries = computed(() => {
  try {
    return getAllIndustries()
  } catch (e) {
    console.error('Error getting industries:', e)
    return []
  }
})
const categories = computed(() => {
  try {
    return getAllCategories()
  } catch (e) {
    console.error('Error getting categories:', e)
    return []
  }
})
const filteredCases = ref<RealCase[]>([])
const caseStats = computed(() => {
  try {
    return getCaseStats()
  } catch (e) {
    console.error('Error getting case stats:', e)
    return { total: 0, byIndustry: [], byCategory: [], byDifficulty: [] }
  }
})

// 初始化
onMounted(() => {
  filterCases()
})

// 方法
function goToPractice() {
  router.push('/practice/interactive')
}

function showPersonalSubmit() {
  router.push('/real-cases/submit')
}

function filterCases() {
  try {
    let filtered = realCases

    // 行业筛选
    if (selectedIndustry.value) {
      filtered = filtered.filter(c => c.industry === selectedIndustry.value)
    }

    // 类别筛选
    if (selectedCategory.value) {
      filtered = filtered.filter(c => c.category === selectedCategory.value)
    }

    // 难度筛选
    if (selectedDifficulty.value) {
      filtered = filtered.filter(c => c.difficulty === selectedDifficulty.value)
    }

    // 关键词搜索
    if (searchKeyword.value) {
      const keyword = searchKeyword.value.toLowerCase()
      filtered = filtered.filter(c =>
        c.title.toLowerCase().includes(keyword) ||
        c.scenario.toLowerCase().includes(keyword) ||
        c.industry.toLowerCase().includes(keyword) ||
        c.category.toLowerCase().includes(keyword)
      )
    }

    filteredCases.value = filtered
  } catch (e) {
    console.error('Error in filterCases:', e)
    filteredCases.value = []
  }
}

function viewCase(id: string) {
  router.push(`/real-cases/${id}`)
}

function downloadTemplate(caseItem: RealCase) {
  // TODO: 实现模板下载功能
  message.info(`📥 下载模板：${caseItem.title}`)
  console.log('Download template:', caseItem.downloadUrl)
}

function applyCase(caseItem: RealCase) {
  // TODO: 实现案例应用功能
  message.info(`✨ 应用案例：${caseItem.title}`)
  console.log('Apply case:', caseItem)
}

function copyFormulas(caseItem: RealCase) {
  const formulas = caseItem.keyFormulas.join('\n')
  navigator.clipboard.writeText(formulas).then(() => {
    message.success('📋 公式已复制到剪贴板')
  }).catch(() => {
    message.error('❌ 复制失败')
  })
}
</script>

<style scoped>
.real-cases-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.header {
  text-align: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
}

.header h1 {
  margin: 0 0 8px 0;
  font-size: 32px;
  color: white;
}

.header p {
  margin: 0 0 16px 0;
  color: rgba(255, 255, 255, 0.9);
  font-size: 16px;
}

.header-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.header-actions button {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-practice {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  backdrop-filter: blur(10px);
}

.btn-practice:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.btn-submit {
  background: #48bb78;
  color: white;
}

.btn-submit:hover {
  background: #38a169;
  transform: translateY(-2px);
}

.filters {
  max-width: 1200px;
  margin: 0 auto 30px auto;
  display: flex;
  gap: 20px;
  align-items: center;
  background: rgba(255, 255, 255, 0.95);
  padding: 16px 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  flex-wrap: wrap;
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
  background: white;
}

.filter-group select:focus {
  outline: none;
  border-color: #667eea;
}

.search-box {
  flex: 1;
  min-width: 200px;
}

.search-input {
  width: 100%;
  padding: 8px 12px;
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.2s;
  background: white;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.stats {
  max-width: 1200px;
  margin: 0 auto 30px auto;
  display: flex;
  gap: 24px;
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  justify-content: space-around;
  flex-wrap: wrap;
}

.stat-item {
  text-align: center;
}

.stat-label {
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 8px;
  font-weight: 600;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #667eea;
}

.empty-state {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
  padding: 40px;
  background: white;
  border-radius: 12px;
  color: #6b7280;
}

.cases-list {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.case-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.2s;
}

.case-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.case-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  gap: 16px;
}

.case-info h2 {
  margin: 0 0 8px 0;
  font-size: 20px;
  color: #111827;
}

.case-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
}

.tag.industry {
  background: #d4edda;
  color: #155724;
}

.tag.category {
  background: #cce5ff;
  color: #004085;
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

.case-icon {
  font-size: 48px;
}

.case-description {
  margin-bottom: 16px;
}

.case-description p {
  margin: 0;
  color: #6b7280;
  line-height: 1.6;
}

.case-data-preview {
  margin-bottom: 16px;
}

.case-data-preview label {
  display: block;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
  font-size: 14px;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  background: #f9fafb;
  border-radius: 8px;
  overflow: hidden;
}

.data-table th,
.data-table td {
  padding: 10px 12px;
  text-align: center;
  border-bottom: 1px solid #e5e7eb;
  font-size: 13px;
}

.data-table th {
  background: #f3f4f6;
  font-weight: 600;
  color: #374151;
}

.data-table td {
  background: white;
}

.case-steps {
  margin-bottom: 16px;
}

.case-steps label {
  display: block;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
  font-size: 14px;
}

.steps-preview {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.step-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.step-number {
  background: #667eea;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
  flex-shrink: 0;
}

.step-desc {
  color: #6b7280;
  font-size: 14px;
  line-height: 1.5;
}

.step-more {
  color: #9ca3af;
  font-size: 13px;
  font-style: italic;
  padding-left: 36px;
}

.case-formulas {
  margin-bottom: 20px;
}

.case-formulas label {
  display: block;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
  font-size: 14px;
}

.formulas-list {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.case-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.case-actions button {
  flex: 1;
  min-width: 120px;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.case-actions button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn-detail {
  background: #667eea;
  color: white;
}

.btn-detail:hover {
  background: #5568d3;
}

.btn-download {
  background: #48bb78;
  color: white;
}

.btn-download:hover {
  background: #38a169;
}

.btn-apply {
  background: #ed8936;
  color: white;
}

.btn-apply:hover {
  background: #dd6b20;
}

.btn-copy {
  background: #9f7aea;
  color: white;
}

.btn-copy:hover {
  background: #805ad5;
}

@media (max-width: 768px) {
  .filters {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-group,
  .search-box {
    width: 100%;
  }

  .stats {
    flex-direction: column;
    gap: 16px;
  }

  .case-header {
    flex-direction: column;
  }

  .case-actions {
    flex-direction: column;
  }
}
</style>
