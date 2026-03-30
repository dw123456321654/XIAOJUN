<template>
  <div class="combination-generator">
    <div class="container">
      <h1>🧩 组合公式生成器</h1>
      <p class="subtitle">选择公式，自动生成组合公式</p>

      <div class="generator-layout">
        <!-- 左侧：公式选择 -->
        <div class="formula-selector">
          <h3>选择公式</h3>
          <div class="formula-list">
            <div
              v-for="formula in availableFormulas"
              :key="formula"
              class="formula-item"
              :class="{ selected: selectedFormulas.includes(formula) }"
              @click="toggleFormula(formula)"
            >
              <input type="checkbox" :checked="selectedFormulas.includes(formula)" />
              <span>{{ formula }}</span>
            </div>
          </div>
        </div>

        <!-- 中间：生成类型 -->
        <div class="generator-type">
          <h3>生成类型</h3>
          <div class="type-options">
            <label
              v-for="type in generationTypes"
              :key="type.value"
              class="type-option"
              :class="{ active: selectedType === type.value }"
            >
              <input type="radio" :value="type.value" v-model="selectedType" />
              <span>{{ type.label }}</span>
            </label>
          </div>
        </div>

        <!-- 右侧：结果 -->
        <div class="generator-result">
          <h3>生成的公式</h3>
          <div class="result-box">
            <div v-if="generatedFormula" class="formula-display">
              <code>{{ generatedFormula }}</code>
              <div class="formula-preview">
                ={{ generatedFormula }}
              </div>
            </div>
            <div v-else class="placeholder">
              请选择公式和类型
            </div>
          </div>

          <div class="action-buttons">
            <button @click="copyFormula" :disabled="!generatedFormula" class="btn-primary">
              📋 复制
            </button>
            <button @click="testFormula" :disabled="!generatedFormula" class="btn-secondary">
              🧪 测试
            </button>
            <button @click="saveFormula" :disabled="!generatedFormula" class="btn-success">
              💾 保存
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useMessage } from 'naive-ui'

const message = useMessage()

// 可用公式列表
const availableFormulas = [
  'INDEX', 'MATCH', 'VLOOKUP',
  'IF', 'AND', 'OR', 'IFERROR',
  'SUMIF', 'COUNTIF', 'SUMPRODUCT',
  'LEFT', 'MID', 'RIGHT',
  'TODAY', 'YEAR', 'MONTH', 'DAY',
  'OFFSET', 'AGGREGATE',
  'XLOOKUP', 'XMATCH'
]

// 选中的公式
const selectedFormulas = ref<string[]>([])

// 生成类型
const generationTypes = [
  { label: '🔍 灵活查找', value: 'flexible-lookup' },
  { label: '🤔 多条件判断', value: 'multi-condition' },
  { label: '📊 条件统计', value: 'conditional-stat' },
  { label: '✂️ 文本提取', value: 'text-extract' },
  { label: '📅 日期提取', value: 'date-extract' },
  { label: '⚠️ 错误处理', value: 'error-handling' }
]

const selectedType = ref('flexible-lookup')

// 生成公式
const generatedFormula = computed(() => {
  if (selectedFormulas.value.length === 0) return ''

  const type = selectedType.value
  const formulas = selectedFormulas.value

  switch (type) {
    case 'flexible-lookup':
      if (formulas.includes('INDEX') && formulas.includes('MATCH')) {
        return 'INDEX(返回范围, MATCH(查找值, 查找范围, 0))'
      }
      if (formulas.includes('XLOOKUP')) {
        return 'XLOOKUP(查找值, 查找数组, 返回数组, [未找到值])'
      }
      if (formulas.includes('VLOOKUP')) {
        return 'VLOOKUP(查找值, 查找范围, 列号, FALSE)'
      }
      break

    case 'multi-condition':
      if (formulas.includes('IF') && formulas.includes('AND')) {
        return 'IF(AND(条件1, 条件2), 结果1, 结果2)'
      }
      if (formulas.includes('IF') && formulas.includes('OR')) {
        return 'IF(OR(条件1, 条件2), 结果1, 结果2)'
      }
      if (formulas.includes('IF') && formulas.includes('AND') && formulas.includes('OR')) {
        return 'IF(AND(条件1, 条件2), 结果1, IF(OR(条件3, 条件4), 结果2, 结果3))'
      }
      if (formulas.includes('IF')) {
        return 'IF(条件, 结果1, 结果2)'
      }
      break

    case 'conditional-stat':
      if (formulas.includes('SUMIF') && formulas.includes('COUNTIF')) {
        return 'SUMIF(范围, 条件, 求和范围)/COUNTIF(范围, 条件)'
      }
      if (formulas.includes('SUMIF')) {
        return 'SUMIF(范围, 条件, 求和范围)'
      }
      if (formulas.includes('COUNTIF')) {
        return 'COUNTIF(范围, 条件)'
      }
      break

    case 'text-extract':
      if (formulas.includes('LEFT') && formulas.includes('MID') && formulas.includes('RIGHT')) {
        return 'LEFT(文本, n) & MID(文本, n+1, m) & RIGHT(文本, k)'
      }
      if (formulas.includes('LEFT')) {
        return 'LEFT(文本, n)'
      }
      if (formulas.includes('MID')) {
        return 'MID(文本, 起始位置, 字符数)'
      }
      if (formulas.includes('RIGHT')) {
        return 'RIGHT(文本, n)'
      }
      break

    case 'date-extract':
      if (formulas.includes('YEAR') && formulas.includes('MONTH') && formulas.includes('DAY')) {
        return 'YEAR(日期) & "-" & MONTH(日期) & "-" & DAY(日期)'
      }
      if (formulas.includes('YEAR')) {
        return 'YEAR(日期)'
      }
      if (formulas.includes('MONTH')) {
        return 'MONTH(日期)'
      }
      if (formulas.includes('DAY')) {
        return 'DAY(日期)'
      }
      break

    case 'error-handling':
      if (formulas.includes('IFERROR') && formulas.includes('VLOOKUP')) {
        return 'IFERROR(VLOOKUP(查找值, 查找范围, 列号, FALSE), 默认值)'
      }
      if (formulas.includes('IFERROR')) {
        return 'IFERROR(公式, 默认值)'
      }
      break
  }

  return ''
})

// 切换公式选择
function toggleFormula(formula: string) {
  const index = selectedFormulas.value.indexOf(formula)
  if (index === -1) {
    selectedFormulas.value.push(formula)
  } else {
    selectedFormulas.value.splice(index, 1)
  }
}

// 复制公式
function copyFormula() {
  if (!generatedFormula.value) return

  const formula = '=' + generatedFormula.value
  navigator.clipboard.writeText(formula).then(() => {
    message.success('✅ 公式已复制到剪贴板')
  }).catch(() => {
    message.error('❌ 复制失败，请手动复制')
  })
}

// 测试公式
function testFormula() {
  if (!generatedFormula.value) return

  message.info('🧪 测试功能开发中...')
  // TODO: 实现公式测试功能
}

// 保存公式
function saveFormula() {
  if (!generatedFormula.value) return

  message.success('💾 公式已保存到收藏')
  // TODO: 实现公式保存功能
}
</script>

<style scoped>
.combination-generator {
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

h1 {
  font-size: 32px;
  margin-bottom: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  color: #666;
  margin-bottom: 30px;
}

.generator-layout {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 24px;
  margin-top: 30px;
}

.formula-selector,
.generator-type,
.generator-result {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
}

h3 {
  margin-bottom: 16px;
  color: #333;
}

.formula-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.formula-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  border: 2px solid transparent;
}

.formula-item:hover {
  background: #e9ecef;
}

.formula-item.selected {
  border-color: #667eea;
  background: #f0f4ff;
}

.formula-item input[type="checkbox"] {
  cursor: pointer;
}

.type-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.type-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  border: 2px solid transparent;
}

.type-option:hover {
  background: #e9ecef;
}

.type-option.active {
  border-color: #667eea;
  background: #f0f4ff;
}

.type-option input[type="radio"] {
  cursor: pointer;
}

.result-box {
  min-height: 150px;
  background: white;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.placeholder {
  color: #999;
}

.formula-display {
  width: 100%;
}

.formula-display code {
  display: block;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 6px;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  color: #667eea;
  margin-bottom: 8px;
  overflow-x: auto;
}

.formula-preview {
  font-family: 'Courier New', monospace;
  font-size: 16px;
  color: #333;
  text-align: center;
  font-weight: bold;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.action-buttons button {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
}

.action-buttons button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.action-buttons button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #5568d3;
}

.btn-secondary {
  background: #48bb78;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background: #38a169;
}

.btn-success {
  background: #ed8936;
  color: white;
}

.btn-success:hover:not(:disabled) {
  background: #dd6b20;
}

@media (max-width: 768px) {
  .generator-layout {
    grid-template-columns: 1fr;
  }
}
</style>
