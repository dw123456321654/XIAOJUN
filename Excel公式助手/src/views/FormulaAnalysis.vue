<template>
  <div class="formula-analysis-container">
    <div class="container">
      <div class="header">
        <button @click="goBack" class="back-btn">← 返回</button>
        <h1>📊 公式分析</h1>
        <div class="file-info" v-if="excelData">
          <n-tag type="info">{{ excelData.fileName }}</n-tag>
          <span class="file-size">{{ formatFileSize(excelData.fileSize) }}</span>
        </div>
      </div>

      <!-- 加载中 -->
      <div v-if="!excelData" class="loading">
        <p>正在加载Excel数据...</p>
      </div>

      <!-- 分析内容 -->
      <div v-else>
        <!-- 统计概览 -->
        <div class="stats-overview">
          <h2>📈 公式统计概览</h2>
          <div class="stats-grid">
            <div class="stat-card primary">
              <div class="stat-icon">📝</div>
              <div class="stat-number">{{ excelData.formulaStats.totalCount }}</div>
              <div class="stat-label">总公式数</div>
            </div>
            <div class="stat-card success">
              <div class="stat-icon">📑</div>
              <div class="stat-number">{{ excelData.sheets.length }}</div>
              <div class="stat-label">工作表数</div>
            </div>
            <div class="stat-card warning">
              <div class="stat-icon">📑</div>
              <div class="stat-number">{{ Object.keys(excelData.formulaStats.formulasBySheet).length }}</div>
              <div class="stat-label">使用公式数</div>
            </div>
            <div class="stat-card danger">
              <div class="stat-icon">⚠️</div>
              <div class="stat-number">{{ excelData.formulaStats.complexityStats.complex }}</div>
              <div class="stat-label">复杂公式</div>
            </div>
          </div>
        </div>

        <!-- 公式复杂度分析 -->
        <div class="complexity-section">
          <h2>🔍 公式复杂度分析</h2>
          <div class="complexity-stats">
            <div class="complexity-item simple">
              <div class="complexity-label">简单公式</div>
              <div class="complexity-bar">
                <div
                  class="complexity-progress simple"
                  :style="{ width: getComplexityPercentage('simple') + '%' }"
                ></div>
              </div>
              <div class="complexity-value">
                {{ excelData.formulaStats.complexityStats.simple }}
                ({{ getComplexityPercentage('simple') }}%)
              </div>
            </div>
            <div class="complexity-item medium">
              <div class="complexity-label">中等公式</div>
              <div class="complexity-bar">
                <div
                  class="complexity-progress medium"
                  :style="{ width: getComplexityPercentage('medium') + '%' }"
                ></div>
              </div>
              <div class="complexity-value">
                {{ excelData.formulaStats.complexityStats.medium }}
                ({{ getComplexityPercentage('medium') }}%)
              </div>
            </div>
            <div class="complexity-item complex">
              <div class="complexity-label">复杂公式</div>
              <div class="complexity-bar">
                <div
                  class="complexity-progress complex"
                  :style="{ width: getComplexityPercentage('complex') + '%' }"
                ></div>
              </div>
              <div class="complexity-value">
                {{ excelData.formulaStats.complexityStats.complex }}
                ({{ getComplexityPercentage('complex') }}%)
              </div>
            </div>
          </div>
        </div>

        <!-- 公式分布 -->
        <div class="distribution-section">
          <div class="section-header">
            <h2>📊 公式分布（Top 10）</h2>
            <div class="view-toggle">
              <button
                @click="viewType = 'table'"
                class="toggle-btn"
                :class="{ active: viewType === 'table' }"
              >
                📋 表格
              </button>
              <button
                @click="viewType = 'chart'"
                class="toggle-btn"
                :class="{ active: viewType === 'chart' }"
              >
                📊 图表
              </button>
            </div>
          </div>

          <!-- 表格视图 -->
          <div v-if="viewType === 'table'" class="distribution-table">
            <table class="data-table">
              <thead>
                <tr>
                  <th>排名</th>
                  <th>公式</th>
                  <th>数量</th>
                  <th>占比</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in excelData.formulaStats.formulaDistribution" :key="index">
                  <td>{{ index + 1 }}</td>
                  <td>
                    <code>{{ item.formula }}</code>
                  </td>
                  <td>{{ item.count }}</td>
                  <td>{{ item.percentage.toFixed(1) }}%</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- 图表视图 -->
          <div v-else class="distribution-chart">
            <div class="chart-container">
              <n-data
                type="pie"
                :data="chartData"
                :options="chartOptions"
              />
            </div>
            <div class="chart-legend">
              <div v-for="(item, index) in excelData.formulaStats.formulaDistribution.slice(0, 5)" :key="index" class="legend-item">
                <div class="legend-color" :style="{ backgroundColor: getChartColor(index) }"></div>
                <span class="legend-label">{{ item.formula }}</span>
                <span class="legend-value">{{ item.percentage.toFixed(1) }}%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 公式分类统计 -->
        <div class="category-section">
          <h2>📂 公式分类统计</h2>
          <div class="category-list">
            <div
              v-for="(count, category) in excelData.formulaStats.formulasByType"
              :key="category"
              class="category-item"
            >
              <div class="category-info">
                <div class="category-icon">{{ getCategoryIcon(category) }}</div>
                <div class="category-label">{{ category }}</div>
              </div>
              <div class="category-count">{{ count }} 个</div>
            </div>
          </div>
        </div>

        <!-- 工作表统计 -->
        <div class="sheet-section">
          <h2>📑 工作表统计</h2>
          <div class="sheet-list">
            <div
              v-for="(count, sheet) in excelData.formulaStats.formulasBySheet"
              :key="sheet"
              class="sheet-item"
            >
              <div class="sheet-info">
                <div class="sheet-icon">📊</div>
                <div class="sheet-label">{{ sheet }}</div>
              </div>
              <div class="sheet-count">{{ count }} 个</div>
            </div>
          </div>
        </div>

        <!-- 公式列表 -->
        <div class="formulas-section">
          <div class="section-header">
            <h2>📋 所有公式列表</h2>
            <div class="search-box">
              <input
                v-model="searchKeyword"
                @input="filterFormulas"
                placeholder="搜索公式..."
                class="search-input"
              />
            </div>
          </div>

          <div class="formulas-list">
            <div v-for="(formula, index) in filteredFormulas" :key="index" class="formula-item">
              <div class="formula-header">
                <div class="formula-address">{{ formula.address }}</div>
                <div class="formula-sheet">{{ formula.sheet }}</div>
              </div>
              <div class="formula-content">
                <code>{{ formula.formula }}</code>
              </div>
            </div>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="actions-section">
          <div class="section-header">
            <h2>🎯 操作</h2>
          </div>
          <div class="action-buttons">
            <button @click="viewOptimizationSuggestions" class="btn-optimize">
              ⚡ 优化建议
            </button>
            <button @click="generateLearningPath" class="btn-learn">
              📚 学习路径
            </button>
            <button @click="generateCases" class="btn-case">
              📂 生成案例
            </button>
            <button @click="saveTemplate" class="btn-template">
              💾 保存为模板
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { NTag, useMessage } from 'naive-ui'
import { excelParser, type ExcelData } from '../utils/excelParser'

const router = useRouter()
const message = useMessage()

// 数据
const excelData = ref<ExcelData | null>(null)
const viewType = ref<'table' | 'chart'>('table')
const searchKeyword = ref('')

// 图表数据
const chartData = computed(() => {
  if (!excelData.value) return []
  return excelData.value.formulaStats.formulaDistribution.map(item => ({
    name: item.formula,
    value: item.count
  }))
})

const chartOptions = {
  legend: {
    show: false
  },
  tooltip: {
    trigger: 'item'
  }
}

// 过滤后的公式
const filteredFormulas = computed(() => {
  if (!excelData.value) return []
  const allFormulas = excelData.value.sheets.flatMap(sheet =>
    sheet.formulas.map(f => ({
      address: f.address,
      formula: f.formula,
      sheet: f.sheet
    }))
  )

  if (!searchKeyword.value) return allFormulas

  const keyword = searchKeyword.value.toLowerCase()
  return allFormulas.filter(f =>
    f.formula.toLowerCase().includes(keyword) ||
    f.address.toLowerCase().includes(keyword) ||
    f.sheet.toLowerCase().includes(keyword)
  )
})

// 生命周期
onMounted(() => {
  loadData()
})

// 方法
function loadData() {
  const data = sessionStorage.getItem('uploaded-excel-data')
  if (data) {
    excelData.value = JSON.parse(data)
  } else {
    message.warning('没有找到Excel数据，请先上传文件')
    router.push('/settings')
  }
}

function goBack() {
  router.push('/settings')
}

function getComplexityPercentage(type: 'simple' | 'medium' | 'complex'): number {
  if (!excelData.value) return 0
  const total = excelData.value.formulaStats.totalCount
  if (total === 0) return 0

  const stats = excelData.value.formulaStats.complexityStats
  const count = type === 'simple' ? stats.simple : type === 'medium' ? stats.medium : stats.complex
  return (count / total) * 100
}

function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    '数学': '🔢',
    '文本': '📝',
    '日期': '📅',
    '查找': '🔍',
    '逻辑': '🤔',
    '条件': '📊',
    '其他': '📋'
  }
  return icons[category] || '📋'
}

function getChartColor(index: number): string {
  const colors = ['#667eea', '#764ba2', '#48bb78', '#ed8936', '#f6ad55']
  return colors[index % colors.length]
}

function filterFormulas() {
  // 由computed自动处理
}

function viewOptimizationSuggestions() {
  router.push('/upload/optimization-suggestions')
}

function generateLearningPath() {
  router.push('/upload/learning-path')
}

function generateCases() {
  router.push('/upload/case-generator')
}

function saveTemplate() {
  router.push('/upload/template-manager')
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
}
</script>

<style scoped>
.formula-analysis-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #f0f0f0;
}

.back-btn {
  background: none;
  border: none;
  font-size: 18px;
  color: #667eea;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.2s;
}

.back-btn:hover {
  background: #f0f4ff;
}

h1 {
  margin: 0;
  font-size: 28px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.loading {
  text-align: center;
  padding: 60px;
  color: #666;
  font-size: 16px;
}

.stats-overview h2,
.complexity-section h2,
.distribution-section h2,
.category-section h2,
.sheet-section h2,
.formulas-section h2,
.actions-section h2 {
  margin: 0 0 24px 0;
  font-size: 22px;
  color: #333;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  font-size: 32px;
  margin-bottom: 12px;
}

.stat-number {
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  opacity: 0.9;
}

.complexity-section {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 30px;
}

.complexity-stats {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.complexity-item {
  display: flex;
  align-items: center;
  gap: 16px;
}

.complexity-label {
  width: 120px;
  font-weight: 600;
  color: #333;
}

.complexity-bar {
  flex: 1;
  height: 12px;
  background: #e9ecef;
  border-radius: 6px;
  overflow: hidden;
}

.complexity-progress {
  height: 100%;
  border-radius: 6px;
  transition: width 0.5s ease;
}

.complexity-progress.simple {
  background: #48bb78;
}

.complexity-progress.medium {
  background: #f6ad55;
}

.complexity-progress.complex {
  background: #ed8936;
}

.complexity-value {
  width: 100px;
  text-align: right;
  font-weight: 600;
  color: #333;
}

.distribution-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 30px;
  border: 2px solid #e9ecef;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h2 {
  margin: 0;
}

.view-toggle {
  display: flex;
  gap: 8px;
}

.toggle-btn {
  padding: 8px 16px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  background: white;
}

.toggle-btn.active {
  border-color: #667eea;
  background: #f0f4ff;
  color: #667eea;
}

.toggle-btn:hover:not(.active) {
  background: #f8f9fa;
}

.distribution-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #e9ecef;
}

.data-table th {
  background: #f8f9fa;
  font-weight: 600;
  color: #333;
}

.data-table code {
  background: #1e293b;
  color: #a5b4fc;
  padding: 4px 8px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 13px;
}

.distribution-chart {
  display: flex;
  gap: 40px;
  align-items: flex-start;
}

.chart-container {
  flex: 1;
  min-height: 300px;
}

.chart-legend {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  flex-shrink: 0;
}

.legend-label {
  font-weight: 600;
  color: #333;
}

.legend-value {
  color: #666;
  font-size: 13px;
}

.category-section,
.sheet-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 30px;
  border: 2px solid #e9ecef;
}

.category-list,
.sheet-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
}

.category-item,
.sheet-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8f9fa;
  padding: 16px 20px;
  border-radius: 8px;
  transition: all 0.2s;
}

.category-item:hover,
.sheet-item:hover {
  background: #f0f4ff;
  border-color: #667eea;
}

.category-info,
.sheet-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.category-icon,
.sheet-icon {
  font-size: 24px;
}

.category-label,
.sheet-label {
  font-weight: 600;
  color: #333;
}

.category-count,
.sheet-count {
  padding: 4px 12px;
  background: white;
  border-radius: 12px;
  font-weight: 600;
  color: #667eea;
}

.formulas-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 30px;
  border: 2px solid #e9ecef;
}

.search-box {
  margin-bottom: 20px;
}

.search-input {
  width: 100%;
  padding: 10px 16px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.formulas-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.formula-item {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px 20px;
  border: 2px solid #e9ecef;
  transition: all 0.2s;
}

.formula-item:hover {
  border-color: #667eea;
  background: #f0f4ff;
}

.formula-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.formula-address {
  font-family: 'Courier New', monospace;
  font-weight: 600;
  color: #667eea;
}

.formula-sheet {
  color: #666;
  font-size: 13px;
}

.formula-content code {
  display: block;
  background: #1e293b;
  color: #a5b4fc;
  padding: 12px 16px;
  border-radius: 6px;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  word-break: break-all;
}

.actions-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 24px;
  color: white;
}

.actions-section h2 {
  color: white;
}

.action-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.action-buttons button {
  padding: 14px 20px;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.action-buttons button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

@media (max-width: 768px) {
  .container {
    padding: 20px;
  }

  .header {
    flex-direction: column;
    align-items: flex-start;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .distribution-chart {
    flex-direction: column;
  }

  .category-list,
  .sheet-list {
    grid-template-columns: 1fr;
  }

  .action-buttons {
    flex-direction: column;
  }
}
</style>
