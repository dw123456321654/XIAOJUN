<template>
  <div class="optimization-container">
    <div class="header">
      <h1>💡 优化建议</h1>
      <p>基于公式分析结果，提供优化建议</p>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading">
      <n-spin size="large" />
      <p>正在生成优化建议...</p>
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

    <!-- 优化建议列表 -->
    <div v-else class="content">
      <!-- 总体评估 -->
      <div class="section-overview">
        <div class="overview-card">
          <div class="card-icon">📈</div>
          <div class="card-content">
            <div class="card-label">总体评分</div>
            <div class="card-value" :class="getScoreClass(overallScore)">
              {{ overallScore }}分
            </div>
          </div>
        </div>
        <div class="overview-card">
          <div class="card-icon">⚠️</div>
          <div class="card-content">
            <div class="card-label">可优化项</div>
            <div class="card-value">{{ optimizationCount }}项</div>
          </div>
        </div>
        <div class="overview-card">
          <div class="card-icon">🎯</div>
          <div class="card-content">
            <div class="card-label">潜在提升</div>
            <div class="card-value">{{ improvementPercent }}%</div>
          </div>
        </div>
      </div>

      <!-- 优化建议分类 -->
      <div class="suggestions-section">
        <div
          v-for="category in suggestions"
          :key="category.name"
          class="category-card"
        >
          <div class="category-header">
            <div class="category-info">
              <div class="category-icon">{{ category.icon }}</div>
              <h3>{{ category.name }}</h3>
              <span class="category-count">{{ category.suggestions.length }}条建议</span>
            </div>
            <div
              class="category-severity"
              :class="getSeverityClass(category.severity)"
            >
              {{ category.severity }}
            </div>
          </div>

          <div class="suggestions-list">
            <div
              v-for="suggestion in category.suggestions"
              :key="suggestion.id"
              class="suggestion-item"
            >
              <div class="suggestion-header">
                <div class="suggestion-title">
                  <span class="suggestion-severity" :class="getSeverityClass(suggestion.severity)">
                    {{ getSeverityText(suggestion.severity) }}
                  </span>
                  <span class="suggestion-name">{{ suggestion.title }}</span>
                </div>
                <div class="suggestion-location">{{ suggestion.location }}</div>
              </div>

              <div class="suggestion-description">
                <p>{{ suggestion.description }}</p>
              </div>

              <div class="suggestion-before-after" v-if="suggestion.before && suggestion.after">
                <div class="code-block">
                  <label>优化前：</label>
                  <pre><code>{{ suggestion.before }}</code></pre>
                </div>
                <div class="code-block">
                  <label>优化后：</label>
                  <pre><code>{{ suggestion.after }}</code></pre>
                </div>
              </div>

              <div class="suggestion-benefits" v-if="suggestion.benefits">
                <label>预期收益：</label>
                <div class="benefits-list">
                  <span v-for="(benefit, index) in suggestion.benefits" :key="index" class="benefit-tag">
                    {{ benefit }}
                  </span>
                </div>
              </div>

              <div class="suggestion-actions">
                <button @click="applySuggestion(suggestion)" class="btn-apply">
                  ✨ 应用此建议
                </button>
                <button @click="copyFormula(suggestion.after || suggestion.before)" class="btn-copy">
                  📋 复制公式
                </button>
                <button @click="ignoreSuggestion(suggestion.id)" class="btn-ignore">
                  忽略
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="actions">
        <button @click="applyAll" class="btn-primary">
          ✨ 应用所有建议
        </button>
        <button @click="exportSuggestions" class="btn-secondary">
          📥 导出报告
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
import { NSpin, NButton } from 'naive-ui'

const router = useRouter()
const message = useMessage()

// 状态
const loading = ref(false)
const hasAnalysisData = ref(true) // TODO: 从store读取分析数据

// 总体评分
const overallScore = computed(() => {
  let score = 100
  suggestions.value.forEach(category => {
    category.suggestions.forEach(s => {
      if (s.severity === 'high') score -= 10
      else if (s.severity === 'medium') score -= 5
      else score -= 2
    })
  })
  return Math.max(0, score)
})

// 可优化项数量
const optimizationCount = computed(() => {
  return suggestions.value.reduce((count, category) => {
    return count + category.suggestions.length
  }, 0)
})

// 潜在提升百分比
const improvementPercent = computed(() => {
  return Math.min(100, optimizationCount.value * 8)
})

// 优化建议分类
const suggestions = ref([
  {
    name: '性能优化',
    icon: '⚡',
    severity: 'high',
    suggestions: [
      {
        id: 'perf-001',
        title: 'VLOOKUP 替换为 INDEX+MATCH',
        severity: 'high',
        location: 'Sheet1!D2:D100',
        description: 'VLOOKUP 函数在大数据量时性能较差，建议使用 INDEX+MATCH 组合，性能可提升50%以上。',
        before: '=VLOOKUP(A2, $E$2:$F$100, 2, FALSE)',
        after: '=INDEX($F$2:$F$100, MATCH(A2, $E$2:$E$100, 0))',
        benefits: ['性能提升50%+', '减少计算时间', '降低内存占用']
      },
      {
        id: 'perf-002',
        title: 'SUMIFS 优化条件顺序',
        severity: 'medium',
        location: 'Sheet2!G2:G50',
        description: '将条件较少的列放在前面可以加速计算。',
        before: '=SUMIFS(E:E, B:B, "华东", C:C, "手机", A:A, ">1000")',
        after: '=SUMIFS(E:E, C:C, "手机", B:B, "华东", A:A, ">1000")',
        benefits: ['性能提升20%+', '优化查询顺序']
      }
    ]
  },
  {
    name: '公式简化',
    icon: '✨',
    severity: 'medium',
    suggestions: [
      {
        id: 'simp-001',
        title: 'IF 嵌套简化',
        severity: 'medium',
        location: 'Sheet3!K2:K20',
        description: '多层 IF 嵌套难以维护，建议使用 IFS 函数或查找表。',
        before: '=IF(A2>90, "A", IF(A2>80, "B", IF(A2>70, "C", "D")))',
        after: '=IFS(A2>90, "A", A2>80, "B", A2>70, "C", TRUE, "D")',
        benefits: ['代码更清晰', '易于维护', '减少嵌套层级']
      },
      {
        id: 'simp-002',
        title: '重复公式提取',
        severity: 'low',
        location: 'Sheet4!L2:L100',
        description: '该公式在多个单元格中重复出现，建议定义为名称或使用辅助列。',
        before: '=VLOOKUP(A2, $Z$2:$AA$100, 2, FALSE)',
        after: '=部门名称', // 建议定义为名称
        benefits: ['统一管理', '便于更新', '减少错误']
      }
    ]
  },
  {
    name: '最佳实践',
    icon: '📚',
    severity: 'low',
    suggestions: [
      {
        id: 'best-001',
        title: '使用表格引用',
        severity: 'low',
        location: 'Sheet5!M2:M50',
        description: '将数据区域转换为 Excel 表格（Ctrl+T），可以使用结构化引用，提高可读性。',
        before: '=SUM(Sheet1!$E$2:$E$100)',
        after: '=SUM(Sheet1[销售额])',
        benefits: ['可读性提升', '自动扩展', '易于维护']
      },
      {
        id: 'best-002',
        title: '错误处理',
        severity: 'low',
        location: 'Sheet6!N2:N30',
        description: '公式可能产生错误，建议添加 IFERROR 或 IFNA 处理。',
        before: '=VLOOKUP(A2, $E$2:$F$100, 2, FALSE)',
        after: '=IFERROR(VLOOKUP(A2, $E$2:$F$100, 2, FALSE), "未找到")',
        benefits: ['避免错误显示', '提升用户体验', '数据更稳定']
      }
    ]
  }
])

// 获取评分样式类
function getScoreClass(score: number): string {
  if (score >= 80) return 'score-good'
  if (score >= 60) return 'score-medium'
  return 'score-poor'
}

// 获取严重程度样式类
function getSeverityClass(severity: string): string {
  return `severity-${severity}`
}

// 获取严重程度文本
function getSeverityText(severity: string): string {
  const map: Record<string, string> = {
    high: '高',
    medium: '中',
    low: '低'
  }
  return map[severity] || severity
}

// 应用单个建议
function applySuggestion(suggestion: any) {
  // TODO: 实现应用建议功能
  message.success(`✨ 已应用建议：${suggestion.title}`)
}

// 复制公式
function copyFormula(formula: string) {
  navigator.clipboard.writeText(formula).then(() => {
    message.success('📋 公式已复制到剪贴板')
  }).catch(() => {
    message.error('❌ 复制失败')
  })
}

// 忽略建议
function ignoreSuggestion(id: string) {
  // TODO: 实现忽略建议功能
  message.info('已忽略此建议')
}

// 应用所有建议
function applyAll() {
  if (confirm('确定要应用所有建议吗？此操作不可撤销。')) {
    // TODO: 实现应用所有建议功能
    message.success('✨ 已应用所有建议')
  }
}

// 导出报告
function exportSuggestions() {
  // TODO: 实现导出报告功能
  message.info('📥 正在生成优化报告...')
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
.optimization-container {
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

.section-overview {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
}

.overview-card {
  flex: 1;
  background: white;
  padding: 24px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.card-icon {
  font-size: 40px;
}

.card-content {
  flex: 1;
}

.card-label {
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 8px;
  font-weight: 600;
}

.card-value {
  font-size: 28px;
  font-weight: bold;
  color: #374151;
}

.score-good {
  color: #48bb78;
}

.score-medium {
  color: #ed8936;
}

.score-poor {
  color: #f56565;
}

.suggestions-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.category-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.category-header {
  padding: 20px 24px;
  background: #f9fafb;
  border-bottom: 2px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.category-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.category-icon {
  font-size: 28px;
}

.category-info h3 {
  margin: 0;
  font-size: 20px;
  color: #374151;
}

.category-count {
  background: #e5e7eb;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
  color: #6b7280;
}

.category-severity {
  padding: 6px 16px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 600;
}

.severity-high {
  background: #fee2e2;
  color: #dc2626;
}

.severity-medium {
  background: #fef3c7;
  color: #d97706;
}

.severity-low {
  background: #d1fae5;
  color: #059669;
}

.suggestions-list {
  display: flex;
  flex-direction: column;
}

.suggestion-item {
  padding: 24px;
  border-bottom: 1px solid #e5e7eb;
}

.suggestion-item:last-child {
  border-bottom: none;
}

.suggestion-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
  gap: 16px;
}

.suggestion-title {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.suggestion-severity {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.suggestion-name {
  font-size: 16px;
  font-weight: 600;
  color: #374151;
}

.suggestion-location {
  font-size: 13px;
  color: #6b7280;
  font-family: 'Courier New', monospace;
}

.suggestion-description {
  margin-bottom: 16px;
}

.suggestion-description p {
  margin: 0;
  color: #6b7280;
  line-height: 1.6;
  font-size: 14px;
}

.suggestion-before-after {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.code-block {
  flex: 1;
}

.code-block label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
}

.code-block pre {
  margin: 0;
  background: #f9fafb;
  padding: 12px;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  overflow-x: auto;
}

.code-block code {
  font-family: 'Courier New', monospace;
  font-size: 13px;
  color: #374151;
}

.suggestion-benefits {
  margin-bottom: 16px;
}

.suggestion-benefits label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
}

.benefits-list {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.benefit-tag {
  background: #e5e7eb;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 13px;
  color: #374151;
}

.suggestion-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.suggestion-actions button {
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

.suggestion-actions button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn-apply {
  background: #667eea;
  color: white;
}

.btn-apply:hover {
  background: #5568d3;
}

.btn-copy {
  background: #9f7aea;
  color: white;
}

.btn-copy:hover {
  background: #805ad5;
}

.btn-ignore {
  background: #e5e7eb;
  color: #374151;
}

.btn-ignore:hover {
  background: #d1d5db;
}

.actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 30px;
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
  .section-overview {
    flex-direction: column;
  }

  .suggestion-before-after {
    flex-direction: column;
  }

  .category-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .suggestion-header {
    flex-direction: column;
  }
}
</style>
