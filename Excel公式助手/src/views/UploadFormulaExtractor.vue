<template>
  <div class="formula-extractor-container">
    <div class="header">
      <h1>📋 公式提取</h1>
      <p>从Excel文件中提取所有公式，便于学习和复用</p>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading">
      <n-spin size="large" />
      <p>正在提取公式...</p>
    </div>

    <!-- 空状态 -->
    <div v-else-if="!hasAnalysisData" class="empty-state">
      <div class="empty-icon">📂</div>
      <h3>暂无数据</h3>
      <p>请先上传Excel文件并进行分析</p>
      <n-button type="primary" @click="goToUpload">
        上传文件
      </n-button>
    </div>

    <!-- 公式提取内容 -->
    <div v-else class="content">
      <!-- 操作按钮区 -->
      <div class="actions-header">
        <div class="filter-box">
          <label>按工作表筛选：</label>
          <n-select
            v-model:value="selectedSheet"
            :options="sheetOptions"
            @update:value="filterFormulas"
          />
        </div>
        <div class="filter-box">
          <label>按公式类型筛选：</label>
          <n-select
            v-model:value="selectedCategory"
            :options="categoryOptions"
            @update:value="filterFormulas"
          />
        </div>
        <div class="search-box">
          <input
            v-model="searchKeyword"
            @input="filterFormulas"
            placeholder="搜索公式..."
            class="search-input"
          />
        </div>
        <div class="action-buttons">
          <button @click="selectAll" class="btn-select">
            全选
          </button>
          <button @click="deselectAll" class="btn-deselect">
            取消全选
          </button>
          <button @click="exportSelected" class="btn-export">
            📥 导出选中
          </button>
        </div>
      </div>

      <!-- 公式统计 -->
      <div class="stats-section">
        <div class="stat-card primary">
          <div class="stat-icon">📝</div>
          <div class="stat-content">
            <div class="stat-value">{{ filteredFormulas.length }}</div>
            <div class="stat-label">显示的公式</div>
          </div>
        </div>
        <div class="stat-card success">
          <div class="stat-icon">✅</div>
          <div class="stat-content">
            <div class="stat-value">{{ selectedCount }}</div>
            <div class="stat-label">已选中</div>
          </div>
        </div>
        <div class="stat-card warning">
          <div class="stat-icon">📂</div>
          <div class="stat-content">
            <div class="stat-value">{{ sheets.length }}</div>
            <div class="stat-label">工作表数</div>
          </div>
        </div>
        <div class="stat-card info">
          <div class="stat-icon">📊</div>
          <div class="stat-content">
            <div class="stat-value">{{ categories.length }}</div>
            <div class="stat-label">公式类型</div>
          </div>
        </div>
      </div>

      <!-- 公式列表 -->
      <div class="formulas-section">
        <div class="section-header">
          <h2>📋 公式列表</h2>
          <div class="view-options">
            <button
              :class="{ 'active': viewMode === 'list' }"
              @click="viewMode = 'list'"
              class="view-btn"
            >
              📝 列表
            </button>
            <button
              :class="{ 'active': viewMode === 'compact' }"
              @click="viewMode = 'compact'"
              class="view-btn"
            >
              📄 紧凑
            </button>
          </div>
        </div>

        <div v-if="filteredFormulas.length === 0" class="empty-formulas">
          <p>没有找到匹配的公式</p>
        </div>

        <div v-else class="formulas-list" :class="viewMode">
          <div
            v-for="(formula, index) in filteredFormulas"
            :key="formula.id"
            class="formula-item"
          >
            <div class="formula-select">
              <input
                type="checkbox"
                v-model="formula.selected"
                @change="updateSelectedCount"
              />
            </div>

            <div class="formula-main">
              <div class="formula-header">
                <div class="formula-number">{{ index + 1 }}</div>
                <div class="formula-info">
                  <div class="formula-location">
                    <span class="sheet-badge">{{ formula.sheet }}</span>
                    <span class="address-badge">{{ formula.address }}</span>
                  </div>
                  <div class="formula-tags">
                    <span class="tag" :class="formula.category">
                      {{ getCategoryText(formula.category) }}
                    </span>
                    <span class="tag complexity" :class="formula.complexity">
                      {{ getComplexityText(formula.complexity) }}
                    </span>
                  </div>
                </div>
              </div>

              <div class="formula-content">
                <code class="formula-code">{{ formula.formula }}</code>
              </div>

              <div v-if="formula.description" class="formula-description">
                <p>{{ formula.description }}</p>
              </div>
            </div>

            <div class="formula-actions">
              <button @click="copyFormula(formula.formula)" class="btn-copy">
                📋 复制
              </button>
              <button @click="viewFormula(formula)" class="btn-view">
                👁️ 详情
              </button>
              <button @click="addToFavorites(formula)" class="btn-favorite">
                ⭐ 收藏
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 批量操作 -->
      <div class="batch-actions">
        <h2>⚡ 批量操作</h2>
        <div class="action-buttons">
          <button @click="exportAllFormulas" class="btn-primary">
            📥 导出所有公式
          </button>
          <button @click="exportSelectedFormulas" class="btn-secondary">
            📥 导出选中公式
          </button>
          <button @click="saveAsTemplate" class="btn-secondary">
            ➕ 保存为模板
          </button>
          <button @click="goToAnalysis" class="btn-back">
            ← 返回分析
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
import { NSpin, NButton, NSelect } from 'naive-ui'

const router = useRouter()
const message = useMessage()

// 状态
const loading = ref(false)
const hasAnalysisData = ref(true) // TODO: 从store读取分析数据
const viewMode = ref<'list' | 'compact'>('list')
const selectedSheet = ref('all')
const selectedCategory = ref('all')
const searchKeyword = ref('')

// 工作表选项
const sheetOptions = ref([
  { label: '全部工作表', value: 'all' },
  { label: 'Sheet1', value: 'Sheet1' },
  { label: 'Sheet2', value: 'Sheet2' },
  { label: 'Sheet3', value: 'Sheet3' }
])

// 公式类型选项
const categoryOptions = ref([
  { label: '全部类型', value: 'all' },
  { label: '查找引用', value: 'lookup' },
  { label: '数学计算', value: 'math' },
  { label: '文本处理', value: 'text' },
  { label: '日期时间', value: 'date' },
  { label: '逻辑判断', value: 'logic' },
  { label: '统计分析', value: 'statistical' }
])

// 工作表列表
const sheets = computed(() => {
  const sheetSet = new Set(formulas.value.map(f => f.sheet))
  return Array.from(sheetSet)
})

// 公式类型列表
const categories = computed(() => {
  const categorySet = new Set(formulas.value.map(f => f.category))
  return Array.from(categorySet)
})

// 公式列表
const formulas = ref([
  {
    id: 1,
    sheet: 'Sheet1',
    address: 'D2:D100',
    formula: '=VLOOKUP(A2, $E$2:$F$100, 2, FALSE)',
    category: 'lookup',
    complexity: 'simple',
    description: '查找并返回指定列的值',
    selected: false
  },
  {
    id: 2,
    sheet: 'Sheet1',
    address: 'E2:E100',
    formula: '=SUMIFS(D:D, B:B, "华东", C:C, "手机")',
    category: 'statistical',
    complexity: 'medium',
    description: '多条件求和汇总',
    selected: false
  },
  {
    id: 3,
    sheet: 'Sheet1',
    address: 'F2:F100',
    formula: '=IF(AND(B2>90, C2>95), "优秀", IF(AND(B2>80, C2>85), "良好", "需改进"))',
    category: 'logic',
    complexity: 'complex',
    description: '多条件逻辑判断',
    selected: false
  },
  {
    id: 4,
    sheet: 'Sheet2',
    address: 'C2:C50',
    formula: '=INDEX($F$2:$F$100, MATCH(A2, $E$2:$E$100, 0))',
    category: 'lookup',
    complexity: 'medium',
    description: 'INDEX+MATCH组合查找',
    selected: false
  },
  {
    id: 5,
    sheet: 'Sheet2',
    address: 'D2:D50',
    formula: '=LEFT(A2, FIND(" ", A2)-1)',
    category: 'text',
    complexity: 'simple',
    description: '提取空格前的文本',
    selected: false
  },
  {
    id: 6,
    sheet: 'Sheet3',
    address: 'E2:E30',
    formula: '=TODAY()',
    category: 'date',
    complexity: 'simple',
    description: '返回当前日期',
    selected: false
  },
  {
    id: 7,
    sheet: 'Sheet3',
    address: 'F2:F30',
    formula: '=NETWORKDAYS(A2, B2)',
    category: 'date',
    complexity: 'medium',
    description: '计算两个日期之间的工作日',
    selected: false
  },
  {
    id: 8,
    sheet: 'Sheet1',
    address: 'G2:G100',
    formula: '=SUMPRODUCT(E:E, F:F)',
    category: 'math',
    complexity: 'medium',
    description: '数组乘积求和',
    selected: false
  }
])

// 筛选后的公式
const filteredFormulas = ref(formulas.value)

// 选中的数量
const selectedCount = computed(() => {
  return formulas.value.filter(f => f.selected).length
})

// 获取类别文本
function getCategoryText(category: string): string {
  const map: Record<string, string> = {
    lookup: '查找引用',
    math: '数学计算',
    text: '文本处理',
    date: '日期时间',
    logic: '逻辑判断',
    statistical: '统计分析'
  }
  return map[category] || category
}

// 获取复杂度文本
function getComplexityText(complexity: string): string {
  const map: Record<string, string> = {
    simple: '简单',
    medium: '中等',
    complex: '复杂'
  }
  return map[complexity] || complexity
}

// 筛选公式
function filterFormulas() {
  let filtered = formulas.value

  // 工作表筛选
  if (selectedSheet.value !== 'all') {
    filtered = filtered.filter(f => f.sheet === selectedSheet.value)
  }

  // 类型筛选
  if (selectedCategory.value !== 'all') {
    filtered = filtered.filter(f => f.category === selectedCategory.value)
  }

  // 关键词搜索
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    filtered = filtered.filter(f =>
      f.formula.toLowerCase().includes(keyword) ||
      f.sheet.toLowerCase().includes(keyword) ||
      f.address.toLowerCase().includes(keyword)
    )
  }

  filteredFormulas.value = filtered
}

// 全选
function selectAll() {
  formulas.value.forEach(f => f.selected = true)
  updateSelectedCount()
}

// 取消全选
function deselectAll() {
  formulas.value.forEach(f => f.selected = false)
  updateSelectedCount()
}

// 更新选中数量
function updateSelectedCount() {
  // 计算属性自动处理
}

// 复制公式
function copyFormula(formula: string) {
  navigator.clipboard.writeText(formula).then(() => {
    message.success('📋 公式已复制到剪贴板')
  }).catch(() => {
    message.error('❌ 复制失败')
  })
}

// 查看公式详情
function viewFormula(formula: any) {
  message.info(`👁️ 查看详情：${formula.formula}`)
}

// 添加到收藏
function addToFavorites(formula: any) {
  message.success(`⭐ 已添加到收藏：${formula.formula}`)
}

// 导出选中
function exportSelected() {
  const selected = formulas.value.filter(f => f.selected)
  if (selected.length === 0) {
    message.warning('⚠️ 请先选择要导出的公式')
    return
  }
  message.success(`📥 正在导出${selected.length}个公式...`)
}

// 导出所有公式
function exportAllFormulas() {
  message.success(`📥 正在导出${formulas.value.length}个公式...`)
}

// 保存为模板
function saveAsTemplate() {
  message.success('➕ 已保存为模板')
}

// 返回上传页面
function goToUpload() {
  router.push('/upload/excel')
}

// 返回分析页面
function goToAnalysis() {
  router.push('/upload/analysis')
}
</script>

<style scoped>
.formula-extractor-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.header {
  text-align: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid rgba(255,255,255, 0.1);
}

.header h1 {
  margin: 0 0 8px 0;
  font-size: 32px;
  color: white;
}

.header p {
  margin: 0;
  color: rgba(255,255,255, 0.9);
  font-size: 16px;
}

.loading {
  text-align: center;
  padding: 60px 20px;
}

.loading p {
  color: white;
  margin-top: 20px;
  font-size: 16px;
}

.empty-state {
  max-width: 500px;
  margin: 60px auto;
  text-align: center;
  background: white;
  padding: 40px;
  border-radius: 12px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.empty-state h3 {
  margin: 0 0 10px 0;
  font-size: 24px;
  color: #374151;
}

.empty-state p {
  margin: 0 0 20px 0;
  color: #6b7280;
}

.content {
  max-width: 1400px;
  margin: 0 auto;
}

.actions-header {
  background: white;
  border-radius: 12px 12px 0 0;
  padding: 20px;
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
}

.filter-box {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-box label {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  white-space: nowrap;
}

.search-box {
  flex: 1;
  min-width: 200px;
}

.search-input {
  width: 100%;
  padding: 10px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
}

.action-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.btn-select,
.btn-deselect,
.btn-export {
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-select {
  background: #48bb78;
  color: white;
}

.btn-select:hover {
  background: #38a169;
}

.btn-deselect {
  background: #9ca3af;
  color: white;
}

.btn-deselect:hover {
  background: #6b7280;
}

.btn-export {
  background: #667eea;
  color: white;
}

.btn-export:hover {
  background: #5568d3;
}

.stats-section {
  background: white;
  padding: 20px;
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  border-bottom: 1px solid #e5e7eb;
}

.stat-card {
  flex: 1;
  min-width: 200px;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
}

.stat-icon {
  font-size: 32px;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #374151;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 13px;
  color: #6b7280;
  font-weight: 600;
}

.stat-card.primary .stat-value {
  color: #667eea;
}

.stat-card.success .stat-value {
  color: #48bb78;
}

.stat-card.warning .stat-value {
  color: #ed8936;
}

.stat-card.info .stat-value {
  color: #9f7aea;
}

.formulas-section {
  background: white;
  padding: 20px;
  border-radius: 0 0 12px 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e5e7eb;
}

.section-header h2 {
  margin: 0;
  font-size: 20px;
  color: #374151;
}

.view-options {
  display: flex;
  gap: 8px;
}

.view-btn {
  background: none;
  border: 2px solid #e5e7eb;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.view-btn:hover {
  border-color: #667eea;
  background: #f9fafb;
}

.view-btn.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.empty-formulas {
  text-align: center;
  padding: 40px;
  color: #6b7280;
  font-size: 14px;
}

.formulas-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.formula-item {
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  gap: 16px;
  align-items: flex-start;
  transition: all 0.2s;
}

.formula-item:hover {
  border-color: #667eea;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.formula-select input {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.formula-main {
  flex: 1;
}

.formula-header {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
  align-items: center;
}

.formula-number {
  background: #667eea;
  color: white;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  flex-shrink: 0;
}

.formula-info {
  flex: 1;
}

.formula-location {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 8px;
}

.sheet-badge,
.address-badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.sheet-badge {
  background: #d4edda;
  color: #155724;
}

.address-badge {
  background: #e5e7eb;
  color: #374151;
  font-family: 'Courier New', monospace;
}

.formula-tags {
  display: flex;
  gap: 8px;
}

.tag {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.tag.lookup {
  background: #dbeafe;
  color: #1e40af;
}

.tag.math {
  background: #fce7f3;
  color: #9d174d;
}

.tag.text {
  background: #fef3c7;
  color: #92400e;
}

.tag.date {
  background: #d1fae5;
  color: #065f46;
}

.tag.logic {
  background: #fee2e2;
  color: #991b1b;
}

.tag.statistical {
  background: #e9d5ff;
  color: #6b21a8;
}

.tag.complexity {
  background: #f3f4f6;
  color: #6b7280;
}

.formula-content {
  margin-bottom: 8px;
}

.formula-code {
  display: block;
  background: #f9fafb;
  padding: 10px 12px;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  font-family: 'Courier New', monospace;
  font-size: 13px;
  color: #667eea;
  overflow-x: auto;
}

.formula-description {
  margin-bottom: 0;
}

.formula-description p {
  margin: 0;
  color: #6b7280;
  font-size: 13px;
  line-height: 1.5;
}

.formula-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.formula-actions button {
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-copy {
  background: #48bb78;
  color: white;
}

.btn-copy:hover {
  background: #38a169;
}

.btn-view {
  background: #9f7aea;
  color: white;
}

.btn-view:hover {
  background: #805ad5;
}

.btn-favorite {
  background: #ed8936;
  color: white;
}

.btn-favorite:hover {
  background: #dd6b20;
}

.batch-actions {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-top: 20px;
}

.batch-actions h2 {
  margin: 0 0 16px 0;
  font-size: 20px;
  color: #374151;
}

.batch-actions .action-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-primary {
  background: #667eea;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary:hover {
  background: #5568d3;
  transform: translateY(-2px);
}

.btn-secondary {
  background: #48bb78;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background: #38a169;
  transform: translateY(-2px);
}

.btn-back {
  background: #9ca3af;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-back:hover {
  background: #6b7280;
  transform: translateY(-2px);
}

.formulas-list.compact .formula-item {
  padding: 10px 12px;
}

.formulas-list.compact .formula-description {
  display: none;
}

@media (max-width: 768px) {
  .actions-header {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-box,
  .search-box {
    width: 100%;
  }

  .stats-section {
    flex-direction: column;
  }

  .stat-card {
    min-width: 100%;
  }

  .formula-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .formula-item {
    flex-direction: column;
  }

  .formula-actions {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
