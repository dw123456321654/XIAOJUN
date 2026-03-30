<template>
  <div class="personal-submit-container">
    <div class="container">
      <div class="header">
        <button @click="goBack" class="back-btn">← 返回</button>
        <h1>➕ 提交个人案例</h1>
      </div>

      <div class="submit-form">
        <!-- 基本信息 -->
        <div class="form-section">
          <h2>基本信息</h2>
          <div class="form-grid">
            <div class="form-group">
              <label>案例名称 <span class="required">*</span></label>
              <input
                v-model="form.title"
                type="text"
                placeholder="例如：销售数据汇总"
                class="form-input"
                :class="{ error: errors.title }"
              />
              <div v-if="errors.title" class="error-text">{{ errors.title }}</div>
            </div>

            <div class="form-group">
              <label>行业 <span class="required">*</span></label>
              <select
                v-model="form.industry"
                class="form-select"
                :class="{ error: errors.industry }"
              >
                <option value="">请选择</option>
                <option value="数码3C">数码3C</option>
                <option value="销售">销售</option>
                <option value="财务">财务</option>
                <option value="人力资源">人力资源</option>
                <option value="其他">其他</option>
              </select>
              <div v-if="errors.industry" class="error-text">{{ errors.industry }}</div>
            </div>
          </div>

          <div class="form-group full-width">
            <label>场景描述 <span class="required">*</span></label>
            <textarea
              v-model="form.scenario"
              placeholder="描述你的工作场景，例如：每月汇总销售数据，计算总销售额、增长率、排名等"
              class="form-textarea"
              :class="{ error: errors.scenario }"
              rows="4"
            />
            <div v-if="errors.scenario" class="error-text">{{ errors.scenario }}</div>
          </div>
        </div>

        <!-- 难度选择 -->
        <div class="form-section">
          <h2>难度选择</h2>
          <div class="difficulty-options">
            <label
              v-for="diff in difficultyOptions"
              :key="diff.value"
              class="difficulty-option"
              :class="{ active: form.difficulty === diff.value, error: errors.difficulty }"
            >
              <input
                type="radio"
                :value="diff.value"
                v-model="form.difficulty"
              />
              <span class="difficulty-label">{{ diff.label }}</span>
              <span class="difficulty-desc">{{ diff.desc }}</span>
            </label>
          </div>
          <div v-if="errors.difficulty" class="error-text">{{ errors.difficulty }}</div>
        </div>

        <!-- 实施步骤 -->
        <div class="form-section">
          <div class="section-header">
            <h2>实施步骤</h2>
            <button @click="addStep" class="btn-add-step">
              ➕ 添加步骤
            </button>
          </div>

          <div class="steps-list">
            <div v-for="(step, index) in form.steps" :key="index" class="step-item">
              <div class="step-number">{{ step.step }}</div>
              <div class="step-content">
                <div class="step-row">
                  <label>步骤描述 <span class="required">*</span></label>
                  <input
                    v-model="step.description"
                    type="text"
                    placeholder="例如：计算月度总销售额"
                    class="form-input"
                    :class="{ error: step.errors?.description }"
                  />
                  <button @click="removeStep(index)" class="btn-remove-step">
                    ✕
                  </button>
                </div>
                <div v-if="step.errors?.description" class="error-text">{{ step.errors.description }}</div>

                <div class="step-row">
                  <label>公式 <span class="required">*</span></label>
                  <div class="formula-input-wrapper">
                    <span class="equals">=</span>
                    <input
                      v-model="step.formula"
                      type="text"
                      placeholder="例如：SUMPRODUCT(E:E, F:F)"
                      class="formula-input"
                      :class="{ error: step.errors?.formula }"
                    />
                  </div>
                </div>
                <div v-if="step.errors?.formula" class="error-text">{{ step.errors.formula }}</div>

                <div class="step-row">
                  <label>解析</label>
                  <textarea
                    v-model="step.explanation"
                    placeholder="说明公式的含义和用法"
                    class="form-textarea"
                    :class="{ error: step.errors?.explanation }"
                    rows="3"
                  />
                </div>
                <div v-if="step.errors?.explanation" class="error-text">{{ step.errors.explanation }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 关键公式 -->
        <div class="form-section">
          <h2>关键公式</h2>
          <div class="formulas-input">
            <div class="formulas-wrapper">
              <n-tag
                v-for="(formula, index) in form.keyFormulas"
                :key="index"
                type="info"
                closable
                @close="removeFormula(index)"
              >
                {{ formula }}
              </n-tag>
            </div>
            <div class="add-formula">
              <input
                v-model="newFormula"
                @keyup.enter="addFormula"
                type="text"
                placeholder="输入公式名称（如 SUM、VLOOKUP），按回车添加"
                class="formula-name-input"
              />
              <button @click="addFormula" class="btn-add-formula">
                ➕ 添加
              </button>
            </div>
          </div>
        </div>

        <!-- 数据模板 -->
        <div class="form-section">
          <h2>数据模板</h2>
          <div class="template-info">
            <p>你可以创建一个Excel数据模板，帮助其他用户练习这个案例。</p>
          </div>
          <div class="template-preview">
            <TableGrid
              v-model:data="templateData"
              v-model:headers="templateHeaders"
              :initial-rows="3"
              :initial-cols="4"
            />
          </div>
        </div>

        <!-- 提交按钮 -->
        <div class="submit-actions">
          <button @click="previewCase" class="btn-preview">
            👁 预览案例
          </button>
          <button @click="saveCase" class="btn-save" :disabled="isSubmitting">
            💾 保存案例
          </button>
          <button @click="resetForm" class="btn-reset">
            🔄 重置
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useMessage, NTag } from 'naive-ui'
import TableGrid from '../components/TableGrid.vue'

const router = useRouter()
const message = useMessage()

const difficultyOptions = [
  { label: '初级', value: '初级', desc: '适合Excel新手' },
  { label: '中级', value: '中级', desc: '需要一定Excel基础' },
  { label: '高级', value: '高级', desc: '复杂公式，适合进阶用户' }
]

// 表单数据
const form = reactive({
  title: '',
  industry: '',
  difficulty: '',
  scenario: '',
  steps: [] as Array<{
    step: number
    description: string
    formula: string
    explanation: string
    errors?: any
  }>,
  keyFormulas: [] as string[]
})

// 错误信息
const errors = reactive({
  title: '',
  industry: '',
  difficulty: '',
  scenario: ''
})

// 新公式输入
const newFormula = ref('')

// 数据模板
const templateData = ref<string[][]>([
  ['', '', '', ''],
  ['', '', '', ''],
  ['', '', '', '']
])
const templateHeaders = ref<string[]>(['列A', '列B', '列C', '列D'])

// 提交状态
const isSubmitting = ref(false)

// 方法
function goBack() {
  if (form.steps.length > 0 && !confirm('确定要返回吗？未保存的内容将丢失。')) {
    return
  }
  router.push('/real-cases')
}

function addStep() {
  const stepNumber = form.steps.length + 1
  form.steps.push({
    step: stepNumber,
    description: '',
    formula: '',
    explanation: '',
    errors: {}
  })
}

function removeStep(index: number) {
  form.steps.splice(index, 1)
  // 重新编号
  form.steps.forEach((step, i) => {
    step.step = i + 1
  })
}

function addFormula() {
  const formula = newFormula.value.trim()
  if (formula && !form.keyFormulas.includes(formula)) {
    form.keyFormulas.push(formula)
    newFormula.value = ''
  }
}

function removeFormula(index: number) {
  form.keyFormulas.splice(index, 1)
}

function validateForm(): boolean {
  // 重置错误
  Object.assign(errors, {})
  form.steps.forEach(step => {
    delete step.errors
  })

  let isValid = true

  // 验证案例名称
  if (!form.title.trim()) {
    errors.title = '请输入案例名称'
    isValid = false
  }

  // 验证行业
  if (!form.industry) {
    errors.industry = '请选择行业'
    isValid = false
  }

  // 验证难度
  if (!form.difficulty) {
    errors.difficulty = '请选择难度'
    isValid = false
  }

  // 验证场景描述
  if (!form.scenario.trim()) {
    errors.scenario = '请输入场景描述'
    isValid = false
  }

  // 验证实施步骤
  if (form.steps.length === 0) {
    isValid = false
    message.warning('请至少添加一个实施步骤')
  } else {
    form.steps.forEach((step, index) => {
      step.errors = {}

      if (!step.description.trim()) {
        step.errors.description = '请输入步骤描述'
        isValid = false
      }

      if (!step.formula.trim()) {
        step.errors.formula = '请输入公式'
        isValid = false
      }

      if (!step.explanation.trim()) {
        step.errors.explanation = '请输入解析'
        isValid = false
      }

      if (Object.keys(step.errors).length === 0) {
        delete step.errors
      }
    })
  }

  // 验证关键公式
  if (form.keyFormulas.length === 0) {
    message.warning('建议添加至少一个关键公式')
  }

  return isValid
}

function previewCase() {
  if (!validateForm()) {
    return
  }

  // TODO: 实现案例预览功能
  message.info('👁 案例预览功能开发中...')
  console.log('Form data:', form)
}

function saveCase() {
  if (!validateForm()) {
    return
  }

  isSubmitting.value = true

  try {
    // 生成案例ID
    const caseId = `PC-${Date.now()}`

    // 构建案例数据
    const caseData = {
      id: caseId,
      title: form.title,
      industry: form.industry,
      category: form.industry === '数码3C' ? '个人案例' : '个人案例',
      difficulty: form.difficulty,
      scenario: form.scenario,
      dataTemplate: {
        headers: templateHeaders.value,
        rows: templateData.value
      },
      steps: form.steps.map(step => ({
        step: step.step,
        description: step.description,
        formula: step.formula,
        explanation: step.explanation
      })),
      keyFormulas: form.keyFormulas,
      downloadUrl: '',
      createdAt: new Date().toISOString(),
      isPersonal: true
    }

    // 保存到localStorage
    const personalCases = JSON.parse(localStorage.getItem('personal-cases') || '[]')
    personalCases.push(caseData)
    localStorage.setItem('personal-cases', JSON.stringify(personalCases))

    message.success('💾 案例保存成功！')

    // 返回案例列表
    setTimeout(() => {
      router.push('/real-cases')
    }, 1000)
  } catch (error) {
    message.error('保存失败：' + (error instanceof Error ? error.message : String(error)))
  } finally {
    isSubmitting.value = false
  }
}

function resetForm() {
  if (!confirm('确定要重置吗？所有输入的内容将丢失。')) {
    return
  }

  // 重置表单
  Object.assign(form, {
    title: '',
    industry: '',
    difficulty: '',
    scenario: '',
    steps: [],
    keyFormulas: []
  })

  // 重置错误
  Object.assign(errors, {})

  // 重置模板数据
  templateData.value = [
    ['', '', '', ''],
    ['', '', '', ''],
    ['', '', '', '']
  ]
  templateHeaders.value = ['列A', '列B', '列C', '列D']
}
</script>

<style scoped>
.personal-submit-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  background: white;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.header {
  display: flex;
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
  font-size: 28px;
  margin: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.form-section {
  margin-bottom: 30px;
}

.form-section h2 {
  margin: 0 0 20px 0;
  font-size: 20px;
  color: #333;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-header h2 {
  margin: 0;
}

.required {
  color: #dc3545;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

.form-input,
.form-select {
  width: 100%;
  padding: 10px 12px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-input.error,
.form-select.error {
  border-color: #dc3545;
  box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
}

.full-width {
  grid-column: 1 / -1;
}

.form-textarea {
  width: 100%;
  padding: 10px 12px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  transition: all 0.2s;
  line-height: 1.5;
}

.form-textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-textarea.error {
  border-color: #dc3545;
  box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
}

.error-text {
  color: #dc3545;
  font-size: 13px;
  margin-top: 4px;
}

.difficulty-options {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.difficulty-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #f8f9fa;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.difficulty-option:hover {
  background: #e9ecef;
}

.difficulty-option.active {
  border-color: #667eea;
  background: #f0f4ff;
}

.difficulty-option.error {
  border-color: #dc3545;
  background: #fee2e2;
}

.difficulty-option input[type="radio"] {
  cursor: pointer;
}

.difficulty-label {
  font-weight: 600;
  color: #333;
}

.difficulty-desc {
  color: #666;
  font-size: 13px;
}

.btn-add-step {
  padding: 8px 16px;
  border: none;
  background: #667eea;
  color: white;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-add-step:hover {
  background: #5568d3;
}

.steps-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.step-item {
  background: #f8f9fa;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  display: grid;
  grid-template-columns: 40px 1fr 40px;
  gap: 20px;
  align-items: start;
}

.step-number {
  background: #667eea;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
  flex-shrink: 0;
}

.step-content {
  flex: 1;
  min-width: 0;
}

.step-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;
}

.step-row:last-child {
  margin-bottom: 0;
}

.step-row label {
  width: 100px;
  font-weight: 600;
  color: #333;
  font-size: 14px;
  padding-top: 2px;
  flex-shrink: 0;
}

.step-row .form-input,
.step-row .form-textarea {
  flex: 1;
  min-width: 0;
}

.btn-remove-step {
  background: none;
  border: none;
  color: #dc3545;
  font-size: 18px;
  cursor: pointer;
  padding: 4px;
  transition: all 0.2s;
  flex-shrink: 0;
}

.btn-remove-step:hover {
  color: #c82333;
  transform: scale(1.1);
}

.formula-input-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.equals {
  font-size: 18px;
  font-weight: bold;
  color: #667eea;
  font-family: 'Courier New', monospace;
}

.formula-input {
  flex: 1;
  padding: 10px 12px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  font-family: 'Courier New', monospace;
  transition: all 0.2s;
}

.formula-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.formula-input.error {
  border-color: #dc3545;
  box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
}

.formulas-input {
  margin-bottom: 20px;
}

.formulas-wrapper {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.add-formula {
  display: flex;
  gap: 8px;
}

.formula-name-input {
  flex: 1;
  padding: 8px 12px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s;
}

.formula-name-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.btn-add-formula {
  padding: 8px 16px;
  border: none;
  background: #48bb78;
  color: white;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-add-formula:hover {
  background: #38a169;
}

.template-info {
  margin-bottom: 16px;
  padding: 16px;
  background: #e9ecef;
  border-radius: 8px;
  border-left: 4px solid #667eea;
}

.template-info p {
  margin: 0;
  color: #495057;
  font-size: 14px;
  line-height: 1.6;
}

.template-preview {
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  padding: 16px;
}

.submit-actions {
  display: flex;
  gap: 12px;
  padding-top: 20px;
  border-top: 2px solid #f0f0f0;
}

.submit-actions button {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.submit-actions button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.submit-actions button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-preview {
  background: #9f7aea;
  color: white;
}

.btn-preview:hover:not(:disabled) {
  background: #805ad5;
}

.btn-save {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-save:hover:not(:disabled) {
  background: linear-gradient(135deg, #5568d3 0%, #6b5b95 100%);
}

.btn-reset {
  background: #6c757d;
  color: white;
}

.btn-reset:hover:not(:disabled) {
  background: #5a6268;
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .difficulty-options {
    flex-direction: column;
  }

  .difficulty-option {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  .step-item {
    grid-template-columns: 40px 1fr;
    grid-template-rows: auto auto;
    gap: 12px;
  }

  .step-row {
    flex-direction: column;
    gap: 4px;
  }

  .step-row label {
    width: 100%;
  }

  .submit-actions {
    flex-direction: column;
  }
}
</style>
