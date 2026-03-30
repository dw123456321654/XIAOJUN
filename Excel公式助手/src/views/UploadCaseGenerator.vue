<template>
  <div class="case-generator-container">
    <div class="header">
      <h1>💼 案例生成</h1>
      <p>基于您的Excel数据，自动生成实战案例</p>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading">
      <n-spin size="large" />
      <p>正在生成实战案例...</p>
    </div>

    <!-- 空状态 -->
    <div v-else-if="!hasAnalysisData" class="empty-state">
      <div class="empty-icon">📊</div>
      <h3>暂无分析数据</h3>
      <p>请先上传Excel文件并进行分析</p>
      <n-button type="primary" @click="goToUpload">
        上传文件
      </n-button>
    </div>

    <!-- 案例生成内容 -->
    <div v-else class="content">
      <!-- 案例参数设置 -->
      <div class="settings-section">
        <h2>⚙️ 案例生成设置</h2>
        <div class="settings-grid">
          <div class="setting-item">
            <label>案例类型</label>
            <n-select
              v-model:value="caseType"
              :options="caseTypeOptions"
              @update:value="generateCase"
            />
          </div>
          <div class="setting-item">
            <label>难度级别</label>
            <n-select
              v-model:value="difficulty"
              :options="difficultyOptions"
              @update:value="generateCase"
            />
          </div>
          <div class="setting-item">
            <label>行业场景</label>
            <n-select
              v-model:value="industry"
              :options="industryOptions"
              @update:value="generateCase"
            />
          </div>
          <div class="setting-item">
            <label>案例数量</label>
            <n-input-number
              v-model:value="caseCount"
              :min="1"
              :max="10"
              @update:value="generateCase"
            />
          </div>
        </div>
      </div>

      <!-- 生成的案例列表 -->
      <div class="cases-section">
        <h2>📋 生成的案例（{{ generatedCases.length }}个）</h2>
        <div class="cases-list">
          <div
            v-for="(caseItem, index) in generatedCases"
            :key="caseItem.id"
            class="case-card"
          >
            <div class="case-header">
              <div class="case-number">{{ index + 1 }}</div>
              <div class="case-info">
                <h3>{{ caseItem.title }}</h3>
                <div class="case-meta">
                  <span class="tag industry">{{ caseItem.industry }}</span>
                  <span class="tag" :class="caseItem.difficulty">
                    {{ getDifficultyText(caseItem.difficulty) }}
                  </span>
                  <span class="tag type">{{ caseItem.type }}</span>
                </div>
              </div>
              <div class="case-score">
                <div class="score-label">匹配度</div>
                <div class="score-value">{{ caseItem.matchScore }}%</div>
              </div>
            </div>

            <div class="case-description">
              <p>{{ caseItem.description }}</p>
            </div>

            <div class="case-data">
              <label>数据特征：</label>
              <div class="data-features">
                <div class="feature-item">
                  <span class="feature-label">工作表数：</span>
                  <span class="feature-value">{{ caseItem.dataStats.sheets }}</span>
                </div>
                <div class="feature-item">
                  <span class="feature-label">公式数量：</span>
                  <span class="feature-value">{{ caseItem.dataStats.formulas }}</span>
                </div>
                <div class="feature-item">
                  <span class="feature-label">数据行数：</span>
                  <span class="feature-value">{{ caseItem.dataStats.rows }}</span>
                </div>
              </div>
            </div>

            <div class="case-steps">
              <label>实施步骤（{{ caseItem.steps.length }}步）：</label>
              <div class="steps-list">
                <div
                  v-for="(step, stepIndex) in caseItem.steps.slice(0, 3)"
                  :key="stepIndex"
                  class="step-item"
                >
                  <span class="step-number">{{ step.step }}</span>
                  <span class="step-desc">{{ step.description }}</span>
                  <code class="step-formula">{{ step.formula }}</code>
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
                  v-for="formula in caseItem.keyFormulas.slice(0, 5)"
                  :key="formula"
                  type="info"
                  size="small"
                >
                  {{ formula }}
                </n-tag>
                <span v-if="caseItem.keyFormulas.length > 5" class="more-formulas">
                  +{{ caseItem.keyFormulas.length - 5 }}
                </span>
              </div>
            </div>

            <div class="case-actions">
              <button @click="viewCase(caseItem)" class="btn-detail">
                📖 查看详情
              </button>
              <button @click="downloadTemplate(caseItem)" class="btn-download">
                📥 下载模板
              </button>
              <button @click="addToLibrary(caseItem)" class="btn-add">
                ➕ 加入案例库
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="actions">
        <button @click="regenerateAll" class="btn-primary">
          🔄 重新生成
        </button>
        <button @click="exportAllCases" class="btn-secondary">
          📥 批量导出
        </button>
        <button @click="goToAnalysis" class="btn-secondary">
          ← 返回分析
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
import { NSpin, NButton, NSelect, NInputNumber, NTag } from 'naive-ui'

const router = useRouter()
const message = useMessage()

// 状态
const loading = ref(false)
const hasAnalysisData = ref(true) // TODO: 从store读取分析数据

// 案例参数
const caseType = ref('all')
const difficulty = ref('all')
const industry = ref('all')
const caseCount = ref(5)

// 选项
const caseTypeOptions = [
  { label: '全部类型', value: 'all' },
  { label: '数据汇总', value: 'summary' },
  { label: '数据查找', value: 'lookup' },
  { label: '文本处理', value: 'text' },
  { label: '数据分析', value: 'analysis' }
]

const difficultyOptions = [
  { label: '全部难度', value: 'all' },
  { label: '初级', value: 'beginner' },
  { label: '中级', value: 'intermediate' },
  { label: '高级', value: 'advanced' }
]

const industryOptions = [
  { label: '全部行业', value: 'all' },
  { label: '数码3C', value: '数码3C' },
  { label: '电商零售', value: '电商零售' },
  { label: '教育培训', value: '教育培训' },
  { label: '财务会计', value: '财务会计' }
]

// 生成的案例
const generatedCases = ref([
  {
    id: 'gen-001',
    title: '销售数据月度汇总',
    industry: '数码3C',
    type: '数据汇总',
    difficulty: 'intermediate',
    matchScore: 95,
    description: '基于您的销售数据，生成月度汇总报表，包括各品牌销售额排名、同比增长率等',
    dataStats: {
      sheets: 3,
      formulas: 24,
      rows: 1200
    },
    steps: [
      { step: 1, description: '按品牌汇总销售额', formula: '=SUMIFS(E:E, B:B, "苹果")' },
      { step: 2, description: '计算月度排名', formula: '=RANK(E2, E:E, 0)' },
      { step: 3, description: '计算同比增长率', formula: '=(本月-上月)/上月' },
      { step: 4, description: '生成数据透视表', formula: '数据透视表' }
    ],
    keyFormulas: ['SUMIFS', 'RANK', 'SUMIF', 'AVERAGEIF']
  },
  {
    id: 'gen-002',
    title: '库存预警系统',
    industry: '数码3C',
    type: '数据分析',
    difficulty: 'advanced',
    matchScore: 88,
    description: '建立库存预警机制，识别库存不足和积压的产品',
    dataStats: {
      sheets: 2,
      formulas: 18,
      rows: 856
    },
    steps: [
      { step: 1, description: '识别库存不足（<100）', formula: '=IF(B2<100, "补货", "正常")' },
      { step: 2, description: '识别库存积压（>500）', formula: '=IF(B2>500, "积压", "正常")' },
      { step: 3, description: '计算库存周转天数', formula: '=365/C2' }
    ],
    keyFormulas: ['IF', 'COUNTIF', 'AVERAGE', 'MAX', 'MIN']
  },
  {
    id: 'gen-003',
    title: '产品价格分析',
    industry: '数码3C',
    type: '数据分析',
    difficulty: 'intermediate',
    matchScore: 82,
    description: '分析产品价格分布，识别价格异常和竞争优势',
    dataStats: {
      sheets: 2,
      formulas: 15,
      rows: 456
    },
    steps: [
      { step: 1, description: '计算平均价格', formula: '=AVERAGE(C:C)' },
      { step: 2, description: '识别高价异常（>平均*1.5）', formula: '=IF(C2>AVERAGE(C:C)*1.5, "高价", "正常")' },
      { step: 3, description: '计算价格区间分布', formula: '=FREQUENCY(C:C, {0, 1000, 2000, 3000})' }
    ],
    keyFormulas: ['AVERAGE', 'STDEV', 'MAX', 'MIN', 'FREQUENCY']
  }
])

// 获取难度文本
function getDifficultyText(difficulty: string): string {
  const map: Record<string, string> = {
    beginner: '初级',
    intermediate: '中级',
    advanced: '高级'
  }
  return map[difficulty] || difficulty
}

// 生成案例
function generateCase() {
  loading.value = true
  // TODO: 根据参数生成案例
  setTimeout(() => {
    loading.value = false
    message.success('💼 案例生成完成')
  }, 2000)
}

// 查看案例详情
function viewCase(caseItem: any) {
  // TODO: 查看案例详情
  message.info(`📖 查看详情：${caseItem.title}`)
}

// 下载模板
function downloadTemplate(caseItem: any) {
  // TODO: 下载案例模板
  message.success(`📥 下载模板：${caseItem.title}`)
}

// 加入案例库
function addToLibrary(caseItem: any) {
  // TODO: 加入案例库
  message.success(`➕ 已加入案例库：${caseItem.title}`)
}

// 重新生成
function regenerateAll() {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    message.success('🔄 已重新生成案例')
  }, 2000)
}

// 批量导出
function exportAllCases() {
  // TODO: 批量导出案例
  message.info('📥 正在导出所有案例...')
}

// 返回上传页面
function goToUpload() {
  router.push('/upload/excel')
}

// 返回分析页面
function goToAnalysis() {
  router.push('/upload/analysis')
}

onMounted(() => {
  // TODO: 从store加载分析数据
})
</script>

<style scoped>
.case-generator-container {
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
  max-width: 1200px;
  margin: 0 auto;
}

/* 设置区域 */
.settings-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 30px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.settings-section h2 {
  margin: 0 0 20px 0;
  font-size: 20px;
  color: #374151;
}

.settings-grid {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.setting-item {
  flex: 1;
  min-width: 200px;
}

.setting-item label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
}

/* 案例列表 */
.cases-section {
  margin-bottom: 30px;
}

.cases-section h2 {
  background: white;
  padding: 20px;
  border-radius: 12px 12px 0 0;
  margin: 0;
  font-size: 20px;
  color: #374151;
}

.cases-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  background: white;
  padding: 20px;
  border-radius: 0 0 12px 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.case-card {
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
  transition: all 0.2s;
}

.case-card:hover {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
}

.case-header {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  margin-bottom: 16px;
}

.case-number {
  background: #667eea;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
  flex-shrink: 0;
}

.case-info {
  flex: 1;
}

.case-info h3 {
  margin: 0 0 8px 0;
  font-size: 20px;
  color: #374151;
}

.case-meta {
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

.tag.type {
  background: #e5e7eb;
  color: #374151;
}

.case-score {
  text-align: center;
  padding: 12px;
  background: #f9fafb;
  border-radius: 8px;
}

.score-label {
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 4px;
}

.score-value {
  font-size: 24px;
  font-weight: bold;
  color: #48bb78;
}

.case-description {
  margin-bottom: 16px;
}

.case-description p {
  margin: 0;
  color: #6b7280;
  line-height: 1.6;
  font-size: 14px;
}

.case-data {
  margin-bottom: 16px;
}

.case-data label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
}

.data-features {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.feature-item {
  display: flex;
  gap: 4px;
  font-size: 14px;
}

.feature-label {
  color: #6b7280;
}

.feature-value {
  font-weight: 600;
  color: #374151;
}

.case-steps {
  margin-bottom: 16px;
}

.case-steps label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 12px;
}

.steps-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.step-item {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 8px;
  background: #f9fafb;
  border-radius: 6px;
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
  flex: 1;
  color: #6b7280;
  font-size: 14px;
}

.step-formula {
  font-family: 'Courier New', monospace;
  background: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 13px;
  color: #667eea;
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

.more-formulas {
  color: #9ca3af;
  font-size: 13px;
  padding: 4px 8px;
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

.btn-add {
  background: #9f7aea;
  color: white;
}

.btn-add:hover {
  background: #805ad5;
}

/* 操作按钮 */
.actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.actions button {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.actions button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn-primary {
  background: #48bb78;
  color: white;
}

.btn-primary:hover {
  background: #38a169;
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  backdrop-filter: blur(10px);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.3);
}

@media (max-width: 768px) {
  .settings-grid {
    flex-direction: column;
  }

  .case-header {
    flex-direction: column;
  }

  .case-score {
    width: 100%;
  }

  .data-features {
    flex-direction: column;
  }

  .step-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style>
