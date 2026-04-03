<template>
  <div class="recommend-container">
    <div class="header">
      <h1>🔮 公式推荐</h1>
      <p>告诉我你的数据和目标，我帮你找到合适的公式</p>
    </div>

    <div class="content">
      <div class="input-section">
        <div class="input-group">
          <label>
            <span class="label-icon">📊</span>
            <span class="label-text">原始数据</span>
            <span class="label-desc">你的表格数据是什么样的？</span>
          </label>
          <n-input
            v-model:value="inputData"
            type="textarea"
            placeholder="例如：
苹果，10
香蕉，5
苹果，15"
            :rows="6"
            @input="analyzeInput"
          />
        </div>

        <div class="input-group">
          <label>
            <span class="label-icon">🎯</span>
            <span class="label-text">期望结果</span>
            <span class="label-desc">你想要得到什么结果？</span>
          </label>
          <n-input
            v-model:value="desiredResult"
            type="textarea"
            placeholder="例如：统计苹果的总数量"
            :rows="3"
            @input="analyzeInput"
          />
        </div>

        <n-button
          type="primary"
          size="large"
          @click="recommend"
          :loading="analyzing"
          :disabled="!canRecommend"
          block
        >
          <template v-if="analyzing">
            🤔 正在分析...
          </template>
          <template v-else>
            ✨ 推荐公式
          </template>
        </n-button>
      </div>

      <div v-if="recommendations.length > 0" class="results-section">
        <h2>推荐结果</h2>

        <div
          v-for="(rec, index) in recommendations"
          :key="rec.formula.id"
          class="recommendation-card"
          :class="{ 'best-match': index === 0 }"
        >
          <div v-if="index === 0" class="best-match-badge">
            🏆 最佳匹配
          </div>

          <div class="rec-header">
            <h3>{{ rec.formula.name }}</h3>
            <n-tag :type="getConfidenceType(rec.confidence)">
              匹配度：{{ rec.confidence }}%
            </n-tag>
          </div>

          <div class="rec-formula">
            <label>推荐公式：</label>
            <code>{{ rec.suggestedFormula }}</code>
          </div>

          <div class="rec-reason">
            <label>推荐理由：</label>
            <p>{{ rec.reason }}</p>
          </div>

          <div class="rec-example">
            <label>示例用法：</label>
            <code>{{ rec.example }}</code>
          </div>

          <div class="rec-actions">
            <n-button type="primary" @click="viewFormula(rec.formula.id)">
              查看详情
            </n-button>
            <n-button @click="copyFormula(rec.suggestedFormula)">
              复制公式
            </n-button>
          </div>
        </div>
      </div>

      <div v-else-if="analyzed" class="no-results">
        <div class="no-results-icon">🤷</div>
        <p>没有找到完全匹配的公式</p>
        <p class="hint">试试调整输入的描述</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
import { NInput, NButton, NTag } from 'naive-ui'
import { formulas } from '../utils/data'

const router = useRouter()
const message = useMessage()
const inputData = ref('')
const desiredResult = ref('')
const analyzing = ref(false)
const analyzed = ref(false)
const recommendations = ref<any[]>([])

const canRecommend = computed(() => {
  return inputData.value.trim() && desiredResult.value.trim()
})

function analyzeInput() {
  // 实时分析输入，不推荐，等用户点击按钮
  analyzed.value = false
  recommendations.value = []
}

async function recommend() {
  analyzing.value = true
  analyzed.value = true

  // 模拟分析过程
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const input = inputData.value.toLowerCase()
  const result = desiredResult.value.toLowerCase()

  const matches: any[] = []

  // 关键词映射表
  const keywordMap: Record<string, string[]> = {
    // 查找相关
    'VLOOKUP': ['查找', '找', '匹配', '查询', '对应', '提取值', '获取值'],
    'INDEX+MATCH': ['查找', '找', '匹配', '查询', '双向查找', '多条件查找', '行列查找'],

    // 求和相关
    'SUM': ['求和', '总数', '加', '合计', '汇总', '统计', '计算总和'],
    'SUMIF': ['求和', '总数', '加', '合计', '汇总', '条件求和', '按条件求和', '分类求和'],
    'SUMIFS': ['求和', '总数', '加', '合计', '汇总', '多条件求和', '按多个条件求和'],

    // 计数相关
    'COUNT': ['计数', '数量', '个数', '统计个数', '有多少个'],
    'COUNTA': ['计数', '数量', '个数', '统计个数', '有多少个', '非空计数'],
    'COUNTIF': ['计数', '数量', '个数', '统计个数', '条件计数', '按条件计数'],
    'COUNTIFS': ['计数', '数量', '个数', '统计个数', '多条件计数', '按多个条件计数'],

    // 平均值相关
    'AVERAGE': ['平均', '平均值', '平均数', '求平均', '计算平均'],
    'AVERAGEIF': ['平均', '平均值', '平均数', '求平均', '条件平均', '按条件求平均'],
    'AVERAGEIFS': ['平均', '平均值', '平均数', '求平均', '多条件平均', '按多个条件求平均'],

    // 最大值最小值
    'MAX': ['最大', '最大值', '最高', '求最大'],
    'MIN': ['最小', '最小值', '最低', '求最小'],

    // 文本处理
    'LEFT': ['左边', '左', '前几个', '截取左边', '提取左边'],
    'RIGHT': ['右边', '右', '后几个', '截取右边', '提取右边'],
    'MID': ['中间', '截取', '提取', '从第几个', '提取部分'],
    'LEN': ['长度', '字符数', '字数', '计算长度'],
    'CONCATENATE': ['合并', '拼接', '组合', '连接', '连起来'],
    'TEXT': ['格式', '日期格式', '时间格式', '文本格式', '转换格式'],

    // 判断逻辑
    'IF': ['如果', '判断', '是否', '条件', '满足', '当', '否则'],
    'AND': ['并且', '同时', '都', '并且是'],
    'OR': ['或者', '或者是', '至少一个'],
    'NOT': ['不', '非', '否定', '相反'],

    // 日期时间
    'TODAY': ['今天', '当前日期', '今天的日期'],
    'NOW': ['现在', '当前时间', '现在的时间', '今天时间'],
    'YEAR': ['年', '年份', '提取年份', '年份'],
    'MONTH': ['月', '月份', '提取月份', '几月'],
    'DAY': ['日', '日期', '提取日期', '几号'],
    'DATEDIF': ['日期差', '天数差', '相隔', '日期间隔', '相差几天'],
    'NETWORKDAYS': ['工作日', '工作天数', '排除周末', '计算工作日'],

    // 舍入四舍五入
    'ROUND': ['四舍五入', '舍入', '保留小数', '保留几位小数'],
    'ROUNDUP': ['向上舍入', '向上取整', '进位'],
    'ROUNDDOWN': ['向下舍入', '向下取整', '舍去'],

    // 错误处理
    'IFERROR': ['错误', '出错', '错误处理', '容错', '错误时'],
    'ISERROR': ['判断错误', '是否错误', '检查错误'],
    'ISBLANK': ['空', '空白', '是否为空', '空值'],

    // 财务
    'PMT': ['还款', '分期', '贷款', '每月还款', '计算还款'],
    'PV': ['现值', '本金', '当前价值', '投资现值'],
    'FV': ['终值', '未来价值', '投资收益'],
  }

  // 分析各种场景
  formulas.forEach((formula) => {
    let confidence = 0
    let reasons: string[] = []
    let suggestedFormula = formula.examples.basic.formula
    let example = formula.examples.basic.result

    // 获取公式对应的关键词
    const keywords = keywordMap[formula.name] || []

    // 匹配关键词
    keywords.forEach((keyword) => {
      if (result.includes(keyword)) {
        confidence += 15
        reasons.push(`匹配关键词"${keyword}"`)
      }
      if (input.includes(keyword)) {
        confidence += 10
      }
    })

    // 查找场景特殊判断
    if (result.includes('查找') || result.includes('找') || result.includes('匹配')) {
      if (formula.name === 'VLOOKUP') {
        confidence += 25
        reasons.push('VLOOKUP是最常用的查找函数')
      }
      if (formula.name === 'INDEX+MATCH') {
        confidence += 20
        reasons.push('INDEX+MATCH比VLOOKUP更灵活')
      }
    }

    // 多条件判断
    if (result.includes('多个') || result.includes('多条件')) {
      if (formula.name.includes('IFS') || formula.name === 'INDEX+MATCH') {
        confidence += 20
        reasons.push('支持多条件处理')
      }
    }

    // 嵌套函数
    if (result.includes('嵌套') || result.includes('组合')) {
      if (formula.name === 'IF' || formula.name === 'VLOOKUP') {
        confidence += 15
        reasons.push('支持嵌套使用')
      }
    }

    // 输入数据特征分析
    if (input.includes(',')) {
      // 有逗号分隔的数据
      if (formula.name === 'SUMIF' || formula.name === 'COUNTIF') {
        confidence += 15
        reasons.push('输入数据包含分隔符，适合条件统计')
      }
      if (formula.name === 'CONCATENATE' || formula.name === 'TEXT') {
        confidence += 10
        reasons.push('输入数据包含分隔符，适合文本处理')
      }
    }

    if (input.includes('=')) {
      // 提到了公式
      confidence += 5
    }

    // 分类权重
    const categoryWeights: Record<string, number> = {
      '数学与三角': 1.0,
      '查找与引用': 1.1,
      '逻辑': 1.1,
      '文本': 1.0,
      '日期与时间': 1.0,
      '统计': 1.0,
    }
    const weight = categoryWeights[formula.category] || 1.0
    confidence *= weight

    if (confidence > 0) {
      matches.push({
        formula,
        confidence: Math.min(confidence, 100), // 最大100
        reason: reasons.join('，') || '根据您的描述推荐',
        suggestedFormula,
        example,
      })
    }
  })

  // 按匹配度排序
  matches.sort((a, b) => b.confidence - a.confidence)

  // 取前 3 个结果
  recommendations.value = matches.slice(0, 3)

  analyzing.value = false
}

function getConfidenceType(confidence: number) {
  if (confidence >= 70) return 'success'
  if (confidence >= 50) return 'warning'
  return 'default'
}

function viewFormula(id: string) {
  router.push(`/formulas/${id}`)
}

function copyFormula(formula: string) {
  navigator.clipboard.writeText(formula).then(() => {
    message.success('📋 公式已复制到剪贴板')
  }).catch(() => {
    message.error('❌ 复制失败，请重试')
  })
}
</script>

<style scoped lang="scss">
.recommend-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
}

.header {
  text-align: center;
  color: white;
  margin-bottom: 2rem;
}

.header h1 {
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
}

.header p {
  margin: 0;
  font-size: 1.125rem;
  opacity: 0.9;
}

.content {
  max-width: 900px;
  margin: 0 auto;
}

.input-section {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.input-group {
  margin-bottom: 1.5rem;
}

.input-group:last-of-type {
  margin-bottom: 2rem;
}

label {
  display: block;
  margin-bottom: 0.75rem;
}

.label-icon {
  font-size: 1.25rem;
  margin-right: 0.5rem;
}

.label-text {
  font-weight: 600;
  color: #111827;
  font-size: 1.125rem;
}

.label-desc {
  display: block;
  color: #6b7280;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  margin-left: 2rem;
}

.results-section h2 {
  text-align: center;
  color: white;
  margin-bottom: 1.5rem;
}

.recommendation-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  position: relative;

  &.best-match {
    border: 2px solid #10b981;
  }
}

.best-match-badge {
  position: absolute;
  top: -12px;
  right: 1rem;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  padding: 0.25rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
}

.rec-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.rec-header h3 {
  margin: 0;
  font-size: 1.375rem;
  color: #111827;
}

.rec-formula,
.rec-reason,
.rec-example {
  margin-bottom: 1rem;
}

.rec-formula label,
.rec-reason label,
.rec-example label {
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
}

.rec-formula code,
.rec-example code {
  display: block;
  background: #f3f4f6;
  padding: 0.75rem;
  border-radius: 6px;
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
  color: #2563eb;
  margin-top: 0.5rem;
  word-break: break-all;
}

.rec-reason p {
  margin: 0.5rem 0 0 0;
  color: #6b7280;
  line-height: 1.6;
}

.rec-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.no-results {
  background: white;
  padding: 4rem 2rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.no-results-icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
}

.no-results p {
  margin: 0.5rem 0;
  color: #6b7280;
  font-size: 1.125rem;
}

.no-results .hint {
  color: #9ca3af;
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .header h1 {
    font-size: 1.5rem;
  }

  .input-section {
    padding: 1.5rem;
  }

  .rec-actions {
    flex-direction: column;

    .n-button {
      width: 100%;
    }
  }
}
</style>
