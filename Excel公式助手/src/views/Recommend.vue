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
import { NInput, NButton, NTag } from 'naive-ui'
import { formulas } from '../utils/data'

const router = useRouter()
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

  // 分析各种场景
  formulas.forEach((formula) => {
    let confidence = 0
    let reason = ''
    let suggestedFormula = formula.examples.basic.formula
    let example = formula.examples.basic.result

    // 查找场景
    if (input.includes('查找') || result.includes('查找') || result.includes('找')) {
      if (formula.name === 'VLOOKUP' || formula.name === 'INDEX+MATCH') {
        confidence += 40
        reason = '你需要查找数据，' + formula.name + ' 是最常用的查找函数'
      }
    }

    // 统计/求和场景
    if (result.includes('统计') || result.includes('求和') || result.includes('总数') || result.includes('加')) {
      if (formula.name === 'SUMIF') {
        confidence += 40
        reason = '你需要按条件统计数据，SUMIF 可以实现条件求和'
      } else if (formula.name === 'COUNTIF') {
        confidence += 35
        reason = '你需要统计数量，COUNTIF 可以实现条件计数'
      }
    }

    // 文本处理场景
    if (result.includes('合并') || result.includes('拼接') || result.includes('组合')) {
      if (formula.name === 'CONCATENATE') {
        confidence += 45
        reason = '你需要合并文本，CONCATENATE 是最常用的文本合并函数'
      }
    }

    // 判断场景
    if (result.includes('如果') || result.includes('判断') || result.includes('是否')) {
      if (formula.name === 'IF') {
        confidence += 45
        reason = '你需要进行逻辑判断，IF 是最常用的条件函数'
      }
    }

    // 提取场景
    if (result.includes('提取') || result.includes('截取')) {
      if (formula.name === 'MID') {
        confidence += 45
        reason = '你需要提取部分文本，MID 可以从指定位置提取指定数量的字符'
      }
    }

    // 日期场景
    if (result.includes('日期') || result.includes('今天') || result.includes('当前')) {
      if (formula.name === 'TODAY') {
        confidence += 40
        reason = '你需要获取当前日期，TODAY 可以返回今天的日期'
      }
    }

    // 根据输入数据判断
    if (input.includes(',')) {
      // 有逗号分隔的数据
      if (formula.name === 'SUMIF' || formula.name === 'COUNTIF') {
        confidence += 20
      }
    }

    if (input.includes('=') || result.includes('=')) {
      // 提到了公式
      confidence += 15
    }

    if (confidence > 0) {
      matches.push({
        formula,
        confidence,
        reason,
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
  navigator.clipboard.writeText(formula)
  // TODO: 显示复制成功提示
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
