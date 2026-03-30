<template>
  <div class="combination-practice">
    <div class="container">
      <div class="header">
        <button @click="goBack" class="back-btn">← 返回</button>
        <h1>🧩 组合练习</h1>
        <div class="progress">
          题目 {{ currentQuestion + 1 }} / {{ totalQuestions }}
        </div>
      </div>

      <div v-if="combination" class="combination-info">
        <h2>{{ combination.name }}</h2>
        <p class="description">{{ combination.description }}</p>
        <div class="tags">
          <span class="tag" :class="combination.difficulty">
            {{ combination.difficulty }}
          </span>
          <span class="tag popularity">
            常用度: {{ '★'.repeat(combination.popularity) }}
          </span>
        </div>
      </div>

      <div v-if="combination && currentQuestionData" class="question-card">
        <div class="question-title">
          <span class="question-number">题目 {{ currentQuestion + 1 }}</span>
          <span v-if="attemptCount > 0" class="attempt-badge">
            已尝试 {{ attemptCount }} 次
          </span>
        </div>

        <div class="question-text">
          {{ currentQuestionData.question }}
        </div>

        <div class="data-table">
          <table>
            <thead>
              <tr>
                <th v-for="(header, index) in currentQuestionData.data.headers" :key="index">
                  {{ header }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, rowIndex) in currentQuestionData.data.rows" :key="rowIndex">
                <td v-for="(cell, cellIndex) in row" :key="cellIndex">
                  {{ cell }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="answer-section">
          <label>请输入公式：</label>
          <div class="formula-input-wrapper">
            <span class="equals">=</span>
            <input
              v-model="userAnswer"
              @keyup.enter="checkAnswer"
              @input="onAnswerInput"
              placeholder="输入公式..."
              class="formula-input"
              :class="{ error: showError, success: showSuccess }"
            />
          </div>
          <div v-if="showError" class="error-message">
            {{ errorMessage }}
          </div>
          <div v-if="showSuccess" class="success-message">
            ✅ {{ successMessage }}
          </div>
        </div>

        <div class="actions">
          <button @click="showHint" class="btn-hint" :disabled="showSuccess">
            💡 提示
          </button>
          <button @click="checkAnswer" class="btn-check" :disabled="userAnswer.trim() === '' || showSuccess">
            ✓ 检查答案
          </button>
          <button
            v-if="showSuccess || showError"
            @click="nextQuestion"
            class="btn-next"
          >
            {{ isLastQuestion ? '完成' : '下一题' }}
          </button>
        </div>

        <div v-if="showHintText" class="hint-box">
          <h4>💡 提示</h4>
          <p>{{ currentHint }}</p>
        </div>

        <div v-if="showExplanation" class="explanation-box">
          <h4>📚 解析</h4>
          <p>{{ currentQuestionData.explanation }}</p>
          <div class="correct-answer">
            <strong>正确答案：</strong>
            <code>={{ currentQuestionData.formula }}</code>
          </div>
        </div>
      </div>

      <div v-if="showResult" class="result-card">
        <h2>🎉 练习完成！</h2>
        <div class="score">
          <div class="score-number">{{ score }}</div>
          <div class="score-total">/ {{ totalQuestions }} 题</div>
        </div>
        <div class="score-message">
          {{ scoreMessage }}
        </div>
        <div class="stats">
          <div class="stat-item">
            <div class="stat-label">平均尝试次数</div>
            <div class="stat-value">{{ averageAttempts.toFixed(1) }}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">总用时</div>
            <div class="stat-value">{{ formatTime(totalTime) }}</div>
          </div>
        </div>
        <div class="result-actions">
          <button @click="restart" class="btn-restart">
            🔄 重新练习
          </button>
          <button @click="goBack" class="btn-back">
            ← 返回列表
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
import { formulaCombinations, getCombinationById } from '../utils/formulaCombinations'
import type { FormulaCombination } from '../types'

const route = useRoute()
const router = useRouter()
const message = useMessage()

const combinationId = parseInt(route.params.id as string)
const combination = ref<FormulaCombination | null>(null)
const currentQuestion = ref(0)
const userAnswer = ref('')
const attemptCount = ref(0)
const showError = ref(false)
const showSuccess = ref(false)
const showHintText = ref(false)
const showExplanation = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const currentHint = ref('')
const showResult = ref(false)
const score = ref(0)
const attemptsPerQuestion = ref<number[]>([])
const startTime = ref(0)
const totalTime = ref(0)

// 计算属性
const totalQuestions = computed(() => {
  return combination.value?.practiceQuestions?.length || 0
})

const currentQuestionData = computed(() => {
  return combination.value?.practiceQuestions?.[currentQuestion.value]
})

const isLastQuestion = computed(() => {
  return currentQuestion.value === totalQuestions.value - 1
})

const averageAttempts = computed(() => {
  if (attemptsPerQuestion.value.length === 0) return 0
  const sum = attemptsPerQuestion.value.reduce((a, b) => a + b, 0)
  return sum / attemptsPerQuestion.value.length
})

const scoreMessage = computed(() => {
  if (score.value === totalQuestions.value) return '完美！🎯'
  if (score.value >= totalQuestions.value * 0.8) return '优秀！🌟'
  if (score.value >= totalQuestions.value * 0.6) return '良好！👍'
  return '继续努力！💪'
})

// 生命周期
onMounted(() => {
  combination.value = getCombinationById(combinationId)
  if (!combination.value) {
    message.error('组合不存在')
    goBack()
    return
  }
  startTime.value = Date.now()
})

// 方法
function goBack() {
  router.push('/combinations')
}

function onAnswerInput() {
  showError.value = false
  showSuccess.value = false
}

function normalizeAnswer(answer: string): string {
  return answer
    .toUpperCase()
    .replace(/\s+/g, '')
    .replace(/,/g, ';')
}

function checkAnswer() {
  if (!currentQuestionData.value) return

  const normalizedUserAnswer = normalizeAnswer(userAnswer.value)
  const normalizedCorrectAnswer = normalizeAnswer(currentQuestionData.value.formula)

  attemptCount.value++

  if (normalizedUserAnswer === normalizedCorrectAnswer) {
    showSuccess.value = true
    showExplanation.value = true
    successMessage.value = '正确！' + (attemptCount.value === 1 ? '一次就答对！🎯' : `尝试${attemptCount.value}次成功`)
    score.value++

    // 记录每题的尝试次数
    attemptsPerQuestion.value.push(attemptCount.value)
  } else {
    showError.value = true
    if (attemptCount.value === 1) {
      errorMessage.value = '答案不正确，请再试一次'
    } else if (attemptCount.value === 2) {
      errorMessage.value = '还是不正确，看看提示吧'
      showHint()
    } else {
      errorMessage.value = '多次尝试未成功，请查看解析'
      showExplanation.value = true
    }
  }
}

function showHint() {
  if (!currentQuestionData.value) return

  showHintText.value = true

  // 根据尝试次数提供不同级别的提示
  if (attemptCount.value === 1) {
    currentHint.value = `提示1：这个组合使用了 ${combination.value?.formulas.join(' 和 ')} 函数`
  } else if (attemptCount.value === 2) {
    currentHint.value = `提示2：公式结构是 =${currentQuestionData.value.formula.split('(')[0]}(...)`
  } else {
    currentHint.value = `提示3：正确答案以 ${currentQuestionData.value.formula.split('(')[1].split(',')[0]} 开始`
  }
}

function nextQuestion() {
  if (isLastQuestion.value) {
    showFinalResult()
  } else {
    currentQuestion.value++
    resetQuestion()
  }
}

function resetQuestion() {
  userAnswer.value = ''
  attemptCount.value = 0
  showError.value = false
  showSuccess.value = false
  showHintText.value = false
  showExplanation.value = false
  errorMessage.value = ''
  successMessage.value = ''
  currentHint.value = ''
}

function showFinalResult() {
  showResult.value = true
  totalTime.value = Date.now() - startTime.value

  // 保存练习记录到localStorage
  savePracticeRecord()
}

function restart() {
  currentQuestion.value = 0
  score.value = 0
  attemptsPerQuestion.value = []
  showResult.value = false
  startTime.value = Date.now()
  resetQuestion()
}

function formatTime(ms: number): string {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60

  if (minutes > 0) {
    return `${minutes}分${remainingSeconds}秒`
  }
  return `${remainingSeconds}秒`
}

function savePracticeRecord() {
  if (!combination.value) return

  const record = {
    combinationId: combination.value.id,
    combinationName: combination.value.name,
    score: score.value,
    totalQuestions: totalQuestions.value,
    averageAttempts: averageAttempts.value,
    totalTime: totalTime.value,
    date: new Date().toISOString()
  }

  const records = JSON.parse(localStorage.getItem('combination-practice-records') || '[]')
  records.push(record)
  localStorage.setItem('combination-practice-records', JSON.stringify(records))
}
</script>

<style scoped>
.combination-practice {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.container {
  max-width: 900px;
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

.progress {
  margin-left: auto;
  font-size: 16px;
  color: #666;
  font-weight: 600;
}

.combination-info {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
}

.combination-info h2 {
  margin: 0 0 8px 0;
  font-size: 22px;
  color: #333;
}

.description {
  margin: 0 0 12px 0;
  color: #666;
}

.tags {
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

.tag.popularity {
  background: #e2e3e5;
  color: #383d41;
}

.question-card {
  background: #fafafa;
  border-radius: 12px;
  padding: 24px;
}

.question-title {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.question-number {
  font-size: 18px;
  font-weight: 600;
  color: #667eea;
}

.attempt-badge {
  background: #fff3cd;
  color: #856404;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
}

.question-text {
  font-size: 16px;
  color: #333;
  margin-bottom: 20px;
  line-height: 1.6;
}

.data-table {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 24px;
  border: 2px solid #e9ecef;
}

.data-table table {
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

.data-table tr:last-child td {
  border-bottom: none;
}

.answer-section {
  margin-bottom: 20px;
}

.answer-section label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
}

.formula-input-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.equals {
  font-size: 18px;
  font-weight: bold;
  color: #667eea;
  font-family: 'Courier New', monospace;
}

.formula-input {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 16px;
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

.formula-input.success {
  border-color: #28a745;
  box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.1);
}

.error-message {
  color: #dc3545;
  margin-top: 8px;
  font-size: 14px;
}

.success-message {
  color: #28a745;
  margin-top: 8px;
  font-size: 14px;
  font-weight: 600;
}

.actions {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.actions button {
  flex: 1;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.actions button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.actions button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-hint {
  background: #ffc107;
  color: #333;
}

.btn-check {
  background: #28a745;
  color: white;
}

.btn-next {
  background: #667eea;
  color: white;
}

.hint-box {
  background: #fff3cd;
  border-left: 4px solid #ffc107;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.hint-box h4 {
  margin: 0 0 8px 0;
  color: #856404;
}

.hint-box p {
  margin: 0;
  color: #856404;
  line-height: 1.6;
}

.explanation-box {
  background: #d1ecf1;
  border-left: 4px solid #17a2b8;
  padding: 16px;
  border-radius: 8px;
}

.explanation-box h4 {
  margin: 0 0 8px 0;
  color: #0c5460;
}

.explanation-box p {
  margin: 0 0 12px 0;
  color: #0c5460;
  line-height: 1.6;
}

.correct-answer {
  padding: 12px;
  background: rgba(23, 162, 184, 0.1);
  border-radius: 6px;
}

.correct-answer code {
  display: block;
  margin-top: 8px;
  padding: 12px;
  background: #0c5460;
  color: #d1ecf1;
  border-radius: 6px;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  overflow-x: auto;
}

.result-card {
  text-align: center;
  padding: 40px 20px;
}

.result-card h2 {
  font-size: 32px;
  margin: 0 0 30px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.score {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 8px;
  margin-bottom: 16px;
}

.score-number {
  font-size: 64px;
  font-weight: bold;
  color: #667eea;
}

.score-total {
  font-size: 24px;
  color: #999;
}

.score-message {
  font-size: 20px;
  color: #333;
  margin-bottom: 30px;
}

.stats {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-bottom: 40px;
}

.stat-item {
  text-align: center;
}

.stat-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #667eea;
}

.result-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.btn-restart,
.btn-back {
  padding: 12px 32px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-restart {
  background: #667eea;
  color: white;
}

.btn-back {
  background: #6c757d;
  color: white;
}

.btn-restart:hover,
.btn-back:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

@media (max-width: 768px) {
  .container {
    padding: 20px;
  }

  .header {
    flex-direction: column;
    align-items: flex-start;
  }

  .progress {
    margin-left: 0;
    margin-top: 8px;
  }

  .stats {
    flex-direction: column;
    gap: 20px;
  }

  .result-actions {
    flex-direction: column;
  }

  .actions {
    flex-direction: column;
  }
}
</style>
