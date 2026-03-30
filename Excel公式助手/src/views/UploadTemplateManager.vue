<template>
  <div class="template-manager-container">
    <div class="header">
      <h1>📥 模板管理</h1>
      <p>保存和使用Excel模板，提高工作效率</p>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading">
      <n-spin size="large" />
      <p>正在加载模板...</p>
    </div>

    <!-- 模板管理内容 -->
    <div v-else class="content">
      <!-- 操作按钮区 -->
      <div class="actions-header">
        <button @click="showSaveDialog = true" class="btn-primary">
          ➕ 保存当前文件为模板
        </button>
        <button @click="importTemplate" class="btn-secondary">
          📤 导入模板
        </button>
        <div class="search-box">
          <input
            v-model="searchKeyword"
            @input="filterTemplates"
            placeholder="搜索模板..."
            class="search-input"
          />
        </div>
      </div>

      <!-- 分类筛选 -->
      <div class="categories-section">
        <div class="category-tabs">
          <button
            v-for="category in categories"
            :key="category.id"
            :class="{ 'active': selectedCategory === category.id }"
            @click="selectedCategory = category.id"
            class="category-tab"
          >
            {{ category.icon }} {{ category.name }}
            <span class="category-count">({{ category.count }})</span>
          </button>
        </div>
      </div>

      <!-- 模板列表 -->
      <div class="templates-section">
        <div v-if="filteredTemplates.length === 0" class="empty-templates">
          <div class="empty-icon">📂</div>
          <h3>暂无模板</h3>
          <p>{{ selectedCategory === 'all' ? '开始保存您的第一个模板吧' : '该分类下暂无模板' }}</p>
        </div>

        <div v-else class="templates-grid">
          <div
            v-for="template in filteredTemplates"
            :key="template.id"
            class="template-card"
          >
            <div class="template-header">
              <div class="template-icon">
                {{ getTemplateIcon(template.category) }}
              </div>
              <div class="template-info">
                <h3>{{ template.name }}</h3>
                <div class="template-meta">
                  <span class="tag category">{{ template.category }}</span>
                  <span class="tag" :class="template.difficulty">
                    {{ getDifficultyText(template.difficulty) }}
                  </span>
                </div>
              </div>
            </div>

            <div class="template-description">
              <p>{{ template.description }}</p>
            </div>

            <div class="template-stats">
              <div class="stat-item">
                <span class="stat-icon">📊</span>
                <span>{{ template.sheets }}个工作表</span>
              </div>
              <div class="stat-item">
                <span class="stat-icon">📝</span>
                <span>{{ template.formulas }}个公式</span>
              </div>
              <div class="stat-item">
                <span class="stat-icon">📅</span>
                <span>{{ formatDate(template.updatedAt) }}</span>
              </div>
            </div>

            <div class="template-formulas">
              <label>包含公式：</label>
              <div class="formulas-list">
                <span
                  v-for="(formula, index) in template.keyFormulas.slice(0, 4)"
                  :key="index"
                  class="formula-tag"
                >
                  {{ formula }}
                </span>
                <span v-if="template.keyFormulas.length > 4" class="more-formulas">
                  +{{ template.keyFormulas.length - 4 }}
                </span>
              </div>
            </div>

            <div class="template-actions">
              <button @click="useTemplate(template)" class="btn-use">
                ✨ 使用模板
              </button>
              <button @click="downloadTemplate(template)" class="btn-download">
                📥 下载
              </button>
              <button @click="deleteTemplate(template)" class="btn-delete">
                🗑️ 删除
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 统计信息 -->
      <div class="stats-footer">
        <div class="stat-card">
          <div class="stat-value">{{ templates.length }}</div>
          <div class="stat-label">总模板数</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ totalSize }}</div>
          <div class="stat-label">总大小</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ categories.length - 1 }}</div>
          <div class="stat-label">分类数</div>
        </div>
      </div>
    </div>

    <!-- 保存模板对话框 -->
    <n-modal
      v-model:show="showSaveDialog"
      preset="card"
      title="保存为模板"
      style="width: 500px"
    >
      <n-form ref="saveForm" :model="saveFormValue" label-placement="left">
        <n-form-item label="模板名称">
          <n-input
            v-model:value="saveFormValue.name"
            placeholder="输入模板名称"
          />
        </n-form-item>
        <n-form-item label="描述">
          <n-input
            v-model:value="saveFormValue.description"
            type="textarea"
            placeholder="简要描述模板用途"
            :rows="3"
          />
        </n-form-item>
        <n-form-item label="分类">
          <n-select
            v-model:value="saveFormValue.category"
            :options="categoryOptions"
          />
        </n-form-item>
        <n-form-item label="难度级别">
          <n-select
            v-model:value="saveFormValue.difficulty"
            :options="difficultyOptions"
          />
        </n-form-item>
      </n-form>
      <template #footer>
        <div class="dialog-footer">
          <button @click="showSaveDialog = false" class="btn-cancel">
            取消
          </button>
          <button @click="saveTemplate" class="btn-save">
            保存
          </button>
        </div>
      </template>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
import {
  NSpin, NButton, NInput, NSelect,
  NModal, NForm, NFormItem
} from 'naive-ui'

const router = useRouter()
const message = useMessage()

// 状态
const loading = ref(false)
const selectedCategory = ref('all')
const searchKeyword = ref('')
const showSaveDialog = ref(false)

// 保存表单
const saveFormValue = ref({
  name: '',
  description: '',
  category: 'common',
  difficulty: 'intermediate'
})

// 分类选项
const categoryOptions = [
  { label: '通用模板', value: 'common' },
  { label: '销售管理', value: 'sales' },
  { label: '数据分析', value: 'analysis' },
  { label: '财务会计', value: 'finance' },
  { label: '人力资源', value: 'hr' },
  { label: '项目管理', value: 'project' }
]

const difficultyOptions = [
  { label: '初级', value: 'beginner' },
  { label: '中级', value: 'intermediate' },
  { label: '高级', value: 'advanced' }
]

// 模板列表
const templates = ref([
  {
    id: 'tpl-001',
    name: '月度销售报表',
    description: '快速生成月度销售汇总报表，包含销售额排名、同比增长等',
    category: 'sales',
    difficulty: 'intermediate',
    sheets: 4,
    formulas: 28,
    size: 125800,
    updatedAt: new Date('2026-03-15'),
    keyFormulas: ['SUMIFS', 'RANK', 'VLOOKUP', 'IF']
  },
  {
    id: 'tpl-002',
    name: '库存管理表',
    description: '实时监控库存状态，预警库存不足和积压',
    category: 'analysis',
    difficulty: 'advanced',
    sheets: 3,
    formulas: 35,
    size: 95000,
    updatedAt: new Date('2026-03-20'),
    keyFormulas: ['IF', 'COUNTIF', 'AVERAGE', 'INDEX', 'MATCH']
  },
  {
    id: 'tpl-003',
    name: '员工考勤表',
    description: '自动计算考勤天数、迟到早退次数',
    category: 'hr',
    difficulty: 'beginner',
    sheets: 2,
    formulas: 12,
    size: 45000,
    updatedAt: new Date('2026-03-18'),
    keyFormulas: ['COUNTIF', 'SUMIF', 'DATEDIF']
  }
])

// 分类统计
const categories = computed(() => {
  const cats = [
    { id: 'all', name: '全部', icon: '📂', count: templates.value.length },
    { id: 'common', name: '通用', icon: '📋', count: 0 },
    { id: 'sales', name: '销售', icon: '📊', count: 0 },
    { id: 'analysis', name: '分析', icon: '📈', count: 0 },
    { id: 'finance', name: '财务', icon: '💰', count: 0 },
    { id: 'hr', name: '人力', icon: '👥', count: 0 },
    { id: 'project', name: '项目', icon: '📅', count: 0 }
  ]

  templates.value.forEach(t => {
    const cat = cats.find(c => c.id === t.category)
    if (cat) cat.count++
  })

  return cats
})

// 筛选后的模板
const filteredTemplates = computed(() => {
  let filtered = templates.value

  if (selectedCategory.value !== 'all') {
    filtered = filtered.filter(t => t.category === selectedCategory.value)
  }

  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    filtered = filtered.filter(t =>
      t.name.toLowerCase().includes(keyword) ||
      t.description.toLowerCase().includes(keyword)
    )
  }

  return filtered
})

// 总大小
const totalSize = computed(() => {
  const bytes = templates.value.reduce((sum, t) => sum + t.size, 0)
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
})

function getTemplateIcon(category: string): string {
  const icons: Record<string, string> = {
    common: '📋',
    sales: '📊',
    analysis: '📈',
    finance: '💰',
    hr: '👥',
    project: '📅'
  }
  return icons[category] || '📂'
}

function getDifficultyText(difficulty: string): string {
  const map: Record<string, string> = {
    beginner: '初级',
    intermediate: '中级',
    advanced: '高级'
  }
  return map[difficulty] || difficulty
}

function formatDate(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) return '今天'
  if (days === 1) return '昨天'
  if (days < 7) return `${days}天前`
  return date.toLocaleDateString('zh-CN')
}

function filterTemplates() {}

function useTemplate(template: any) {
  message.success(`✨ 已使用模板：${template.name}`)
}

function downloadTemplate(template: any) {
  message.success(`📥 正在下载：${template.name}`)
}

function deleteTemplate(template: any) {
  if (confirm(`确定要删除模板"${template.name}"吗？`)) {
    message.success(`🗑️ 已删除模板：${template.name}`)
  }
}

function saveTemplate() {
  message.success('✅ 模板保存成功')
  showSaveDialog.value = false
}

function importTemplate() {
  message.info('📤 选择要导入的模板文件...')
}
</script>

<style scoped>
.template-manager-container {
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
  margin: 0;
  color: rgba(255, 255, 255, 0.9);
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

.content {
  max-width: 1400px;
  margin: 0 auto;
}

.actions-header {
  background: white;
  border-radius: 12px 12px 0 0;
  padding: 24px;
  display: flex;
  gap: 12px;
  align-items: center;
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
}

.btn-secondary:hover {
  background: #38a169;
  transform: translateY(-2px);
}

.search-box {
  flex: 1;
  min-width: 200px;
}

.search-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
}

.categories-section {
  background: white;
  padding: 0 24px;
  border-bottom: 1px solid #e5e7eb;
}

.category-tabs {
  display: flex;
  gap: 4px;
  overflow-x: auto;
}

.category-tab {
  background: none;
  border: none;
  padding: 16px 20px;
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  white-space: nowrap;
}

.category-tab:hover {
  color: #374151;
  background: #f9fafb;
}

.category-tab.active {
  color: #667eea;
  border-bottom-color: #667eea;
}

.category-count {
  margin-left: 4px;
  font-size: 12px;
  color: #9ca3af;
}

.templates-section {
  background: white;
  padding: 24px;
  border-radius: 0 0 12px 12px;
  margin-bottom: 30px;
}

.empty-templates {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.templates-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.template-card {
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
}

.template-card:hover {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.template-header {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  margin-bottom: 16px;
}

.template-icon {
  font-size: 48px;
  flex-shrink: 0;
}

.template-info {
  flex: 1;
}

.template-info h3 {
  margin: 0 0 8px 0;
  font-size: 20px;
  color: #374151;
}

.template-meta {
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

.tag.category {
  background: #d4edda;
  color: #155724;
}

.tag.beginner {
  background: #d1fae5;
  color: #059669;
}

.tag.intermediate {
  background: #fef3c7;
  color: #d97706;
}

.tag.advanced {
  background: #fee2e2;
  color: #dc2626;
}

.template-description {
  margin-bottom: 16px;
}

.template-description p {
  margin: 0;
  color: #6b7280;
  line-height: 1.6;
  font-size: 14px;
}

.template-stats {
  display: flex;
  gap: 24px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #6b7280;
}

.stat-icon {
  font-size: 16px;
}

.template-formulas {
  margin-bottom: 20px;
}

.template-formulas label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
}

.formulas-list {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.formula-tag {
  background: #e5e7eb;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 13px;
  color: #374151;
}

.more-formulas {
  color: #9ca3af;
  font-size: 13px;
}

.template-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.template-actions button {
  flex: 1;
  min-width: 120px;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.btn-use {
  background: #667eea;
  color: white;
}

.btn-use:hover {
  background: #5568d3;
}

.btn-download {
  background: #48bb78;
  color: white;
}

.btn-download:hover {
  background: #38a169;
}

.btn-delete {
  background: #f56565;
  color: white;
}

.btn-delete:hover {
  background: #e53e3e;
}

.stats-footer {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.stat-card {
  background: white;
  padding: 20px 30px;
  border-radius: 8px;
  text-align: center;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 13px;
  color: #6b7280;
  font-weight: 600;
}

.dialog-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.btn-cancel {
  background: #e5e7eb;
  color: #374151;
  padding: 10px 24px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
}

.btn-save {
  background: #667eea;
  color: white;
  padding: 10px 24px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
}

@media (max-width: 768px) {
  .actions-header {
    flex-direction: column;
    align-items: stretch;
  }

  .template-stats {
    flex-direction: column;
    gap: 12px;
  }

  .template-actions {
    flex-direction: column;
  }
}
</style>
