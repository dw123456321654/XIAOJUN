<template>
  <div class="interactive-practice">
    <div class="container">
      <div class="header">
        <button @click="goBack" class="back-btn">← 返回</button>
        <h1>📝 交互式练习</h1>
      </div>

      <!-- 模式选择 -->
      <div v-if="!practiceStarted && !showResult" class="mode-selection">
        <h2>选择练习模式</h2>
        <div class="mode-cards">
          <div
            class="mode-card"
            :class="{ active: selectedMode === 'timed' }"
            @click="selectMode('timed')"
          >
            <div class="mode-icon">⏱️</div>
            <div class="mode-info">
              <h3>限时挑战</h3>
              <p>在规定时间内完成尽可能多的题目</p>
              <div class="mode-options">
                <label
                  v-for="option in timedOptions"
                  :key="option.value"
                  class="mode-option"
                  :class="{ active: selectedTimedOption === option.value }"
                >
                  <input
                    type="radio"
                    :value="option.value"
                    v-model="selectedTimedOption"
                  />
                  <span>{{ option.label }}</span>
                </label>
              </div>
            </div>
          </div>

          <div
            class="mode-card"
            :class="{ active: selectedMode === 'combo' }"
            @click="selectMode('combo')"
          >
            <div class="mode-icon">🔥</div>
            <div class="mode-info">
              <h3>连击模式</h3>
              <p>10道题连续答题，连对有加成</p>
              <div class="mode-desc">
                <span>10题</span>
                <span>连击加成</span>
              </div>
            </div>
          </div>

          <div
            class="mode-card"
            :class="{ active: selectedMode === 'daily' }"
            @click="selectMode('daily')"
          >
            <div class="mode-icon">📅</div>
            <div class="mode-info">
              <h3>每日打卡</h3>
              <p>每天3题，坚持打卡有奖励</p>
              <div class="mode-desc">
                <span>3题</span>
                <span>连胜{{ streakDays }}天</span>
              </div>
            </div>
          </div>
        </div>

        <div class="start-section">
          <button @click="startPractice" class="btn-start">
            🚀 开始练习
          </button>
        </div>

        <div v-if="dailyLastDate" class="daily-info">
          <p>上次打卡：{{ dailyLastDate }}</p>
          <p v-if="!canPracticeDaily" class="warning">
            ⚠️ 今日已完成打卡，明天再来吧！
          </p>
        </div>
      </div>

      <!-- 练习中 -->
      <div v-if="practiceStarted && !showResult" class="practice-area">
        <div class="practice-header">
          <div class="practice-info">
            <span class="mode-name">{{ modeName }}</span>
            <span v-if="selectedMode === 'timed'" class="timer">
              ⏱️ {{ formatTime(timeLeft) }}
            </span>
            <span class="question-progress">
              题目 {{ currentQuestion + 1 }} / {{ totalQuestions }}
            </span>
            <span class="score">得分：{{ score }}</span>
          </div>
          <button @click="endPractice" class="btn-end">
            ✕ 结束
          </button>
        </div>

        <div class="question-card">
          <div class="question-title">
            <span class="question-number">题目 {{ currentQuestion + 1 }}</span>
            <span v-if="comboStreak > 0" class="combo-badge">
              🔥 连击 {{ comboStreak }}
            </span>
          </div>

          <div class="question-text">
            {{ currentQuestionData?.task }}
          </div>

          <div class="table-editor">
            <TableGrid
              v-model:data="tableData"
              v-model:headers="tableHeaders"
              :initial-rows="currentQuestionData?.data.length || 3"
              :initial-cols="(currentQuestionData?.data[0] as any[])?.length || 3"
              @update:data="onTableDataChange"
            />
          </div>

          <div class="formula-section">
            <label>请输入公式：</label>
            <div class="formula-input-wrapper">
              <span class="equals">=</span>
              <input
                v-model="userFormula"
                @keyup.enter="checkFormula"
                @input="onFormulaInput"
                placeholder="输入公式..."
                class="formula-input"
                :class="{ error: showError, success: showSuccess }"
              />
              <button @click="checkFormula" class="btn-check" :disabled="userFormula.trim() === ''">
                ✓
              </button>
            </div>
            <div v-if="showError" class="error-message">
              {{ errorMessage }}
            </div>
            <div v-if="showSuccess" class="success-message">
              ✅ {{ successMessage }}
            </div>
            <div v-if="realResult !== null" class="real-result">
              实际结果：{{ realResult }}
            </div>
          </div>

          <div class="actions">
            <button @click="showHint" class="btn-hint" :disabled="showSuccess">
              💡 提示
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
        </div>
      </div>

      <!-- 结果展示 -->
      <div v-if="showResult" class="result-card">
        <h2>🎉 练习完成！</h2>

        <div class="result-header">
          <div class="result-mode">{{ modeName }}</div>
          <div class="result-time">{{ formatTime(totalTime) }}</div>
        </div>

        <div class="score-section">
          <div class="score-display">
            <div class="score-number">{{ finalScore }}</div>
            <div class="score-max">/ {{ maxScore }}</div>
          </div>
          <div class="score-message">{{ scoreMessage }}</div>
        </div>

        <div class="result-stats">
          <div class="stat-group">
            <div class="stat-label">正确率</div>
            <div class="stat-value">{{ accuracyRate }}%</div>
          </div>
          <div class="stat-group">
            <div class="stat-label">平均用时</div>
            <div class="stat-value">{{ avgTime }}秒</div>
          </div>
          <div class="stat-group" v-if="selectedMode === 'combo'">
            <div class="stat-label">最高连击</div>
            <div class="stat-value">{{ maxCombo }}</div>
          </div>
          <div class="stat-group" v-if="selectedMode === 'daily'">
            <div class="stat-label">连胜天数</div>
            <div class="stat-value">{{ streakDays }}天</div>
          </div>
        </div>

        <div class="result-actions">
          <button @click="restart" class="btn-restart">
            🔄 重新练习
          </button>
          <button @click="goBack" class="btn-back">
            ← 返回
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
import TableGrid from '../components/TableGrid.vue'
import { practices } from '../utils/data'
import { formulaEngine } from '../utils/formulaEngine'

const router = useRouter()
const message = useMessage()

// 模式选择
const selectedMode = ref<'timed' | 'combo' | 'daily'>('timed')
const selectedTimedOption = ref<number>(60)

const timedOptions = [
  { label: '60秒挑战', value: 60 },
  { label: '30秒挑战', value: 30 },
  { label: '15秒极速', value: 15 }
]

// 练习状态
const practiceStarted = ref(false)
const showResult = ref(false)
const currentQuestion = ref(0)
const totalQuestions = ref(10)
const score = ref(0)
const finalScore = ref(0)
const maxScore = ref(100)

// 计时器
const timer = ref<NodeJS.Timeout | null>(null)
const timeLeft = ref(60)
const totalTime = ref(0)

// 连击
const comboStreak = ref(0)
const maxCombo = ref(0)

// 表格数据
const tableData = ref<string[][]>([])
const tableHeaders = ref<string[]>([])
const userFormula = ref('')
const showError = ref(false)
const showSuccess = ref(false)
const realResult = ref<number | string | null>(null)
const errorMessage = ref('')
const successMessage = ref('')
const showHintText = ref(false)
const currentHint = ref('')

// 每日打卡
const streakDays = ref(0)
const dailyLastDate = ref('')
const dailyRecords = ref<any[]>([])

// 计算属性
const modeName = computed(() => {
  switch (selectedMode.value) {
    case 'timed': return '限时挑战'
    case 'combo': return '连击模式'
    case 'daily': return '每日打卡'
  }
})

const currentQuestionData = computed(() => {
  return practices[currentQuestion.value]
})

const isLastQuestion = computed(() => {
  return currentQuestion.value === totalQuestions.value - 1
})

const canPracticeDaily = computed(() => {
  if (!dailyLastDate.value) return true
  const lastDate = new Date(dailyLastDate.value)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  return lastDate.toDateString() !== today.toDateString() &&
         lastDate.toDateString() !== yesterday.toDateString()
})

const accuracyRate = computed(() => {
  const correct = score.value / 10 // 假设每题10分
  return Math.round((correct / totalQuestions.value) * 100)
})

const avgTime = computed(() => {
  if (totalQuestions.value === 0) return 0
  return Math.round(totalTime.value / totalQuestions.value)
})

const scoreMessage = computed(() => {
  const rate = accuracyRate.value
  if (rate === 100) return '完美！🎯'
  if (rate >= 80) return '优秀！🌟'
  if (rate >= 60) return '良好！👍'
  return '继续努力！💪'
})

// 生命周期
onMounted(() => {
  loadDailyRecords()
})

onUnmounted(() => {
  if (timer.value) {
    clearInterval(timer.value)
  }
})

// 方法
function goBack() {
  router.push('/practice')
}

function selectMode(mode: 'timed' | 'combo' | 'daily') {
  selectedMode.value = mode
}

function startPractice() {
  if (selectedMode.value === 'daily' && !canPracticeDaily.value) {
    message.warning('今日已完成打卡')
    return
  }

  // 重置状态
  practiceStarted.value = true
  showResult.value = false
  currentQuestion.value = 0
  score.value = 0
  comboStreak.value = 0
  maxCombo.value = 0
  totalTime.value = 0

  // 设置题目数
  switch (selectedMode.value) {
    case 'timed':
      totalQuestions.value = 10
      timeLeft.value = selectedTimedOption.value
      // 启动计时器
      timer.value = setInterval(() => {
        timeLeft.value--
        if (timeLeft.value <= 0) {
          endPractice()
        }
      }, 1000)
      break
    case 'combo':
      totalQuestions.value = 10
      break
    case 'daily':
      totalQuestions.value = 3
      break
  }

  // 加载第一题
  loadQuestion(0)
}

function loadQuestion(index: number) {
  const question = practices[index]
  if (!question) return

  // 加载数据
  tableData.value = question.data
  tableHeaders.value = ['列A', '列B', '列C']

  // 重置用户输入
  userFormula.value = ''
  showError.value = false
  showSuccess.value = false
  showHintText.value = false
  realResult.value = null
  currentHint.value = ''
  errorMessage.value = ''
  successMessage.value = ''
}

function endPractice() {
  if (timer.value) {
    clearInterval(timer.value)
    timer.value = null
  }

  finalScore.value = score.value
  showResult.value = true
  practiceStarted.value = false

  // 计算每日打卡
  if (selectedMode.value === 'daily') {
    saveDailyRecord()
  }
}

function onTableDataChange(data: string[][]) {
  tableData.value = data
  // 计算实际结果
  calculateRealResult()
}

function calculateRealResult() {
  const formula = userFormula.value
  if (!formula || !formulaEngine.isFormula(formula)) {
    realResult.value = null
    return
  }

  try {
    const result = formulaEngine.evaluate(formula, tableData.value)
    realResult.value = result
  } catch (error) {
    realResult.value = '计算错误'
  }
}

function onFormulaInput() {
  showError.value = false
  showSuccess.value = false
  calculateRealResult()
}

function checkFormula() {
  const question = currentQuestionData.value
  if (!question) return

  const userFormulaClean = formulaEngine.extractFormula(userFormula.value)
  const correctFormula = formulaEngine.extractFormula(question.formula)

  // 标准化公式
  const normalizeFormula = (f: string) => {
    return f
      .toUpperCase()
      .replace(/\s+/g, '')
      .replace(/,/g, ';')
  }

  const normalizedUser = normalizeFormula(userFormulaClean)
  const normalizedCorrect = normalizeFormula(correctFormula)

  if (normalizedUser === normalizedCorrect) {
    // 正确
    showSuccess.value = true
    comboStreak.value++
    maxCombo.value = Math.max(maxCombo.value, comboStreak.value)

    // 计算得分
    let points = 10
    if (selectedMode.value === 'combo') {
      points += comboStreak.value * 2 // 连击加成
    }
    score.value += points

    successMessage.value = `正确！+${points}分` + (comboStreak.value > 1 ? ` (连击×${comboStreak.value})` : '')

    // 记录用时
    totalTime.value += (selectedMode.value === 'timed' ? selectedTimedOption.value - timeLeft.value : 10)
  } else {
    // 错误
    showError.value = true
    comboStreak.value = 0
    errorMessage.value = '答案不正确，请再试一次'
  }
}

function nextQuestion() {
  if (isLastQuestion.value) {
    endPractice()
  } else {
    currentQuestion.value++
    loadQuestion(currentQuestion.value)
  }
}

function showHint() {
  const question = currentQuestionData.value
  if (!question) return

  showHintText.value = true

  // 简单提示
  if (question.formula.includes('SUM')) {
    currentHint.value = '提示：使用SUM函数求和'
  } else if (question.formula.includes('VLOOKUP')) {
    currentHint.value = '提示：使用VLOOKUP函数查找'
  } else if (question.formula.includes('IF')) {
    currentHint.value = '提示：使用IF函数判断'
  } else {
    currentHint.value = '提示：仔细阅读题目要求'
  }
}

function restart() {
  startPractice()
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return mins > 0 ? `${mins}分${secs}秒` : `${secs}秒`
}

function loadDailyRecords() {
  const records = localStorage.getItem('daily-practice-records')
  if (records) {
    dailyRecords.value = JSON.parse(records)

    // 计算连胜天数
    const today = new Date()
    let streak = 0
    let checkDate = new Date(today)

    for (let i = 0; i < 365; i++) {
      checkDate.setDate(checkDate.getDate() - 1)
      const dateStr = checkDate.toDateString()
      const found = dailyRecords.value.find((r: any) => new Date(r.date).toDateString() === dateStr)

      if (found) {
        streak++
        dailyLastDate.value = dateStr
      } else {
        break
      }
    }

    streakDays.value = streak
  }
}

function saveDailyRecord() {
  const today = new Date()
  const record = {
    date: today.toISOString(),
    score: score.value,
    maxScore: totalQuestions.value * 10,
    accuracy: accuracyRate.value,
    comboStreak: maxCombo.value
  }

  dailyRecords.value.push(record)
  localStorage.setItem('daily-practice-records', JSON.stringify(dailyRecords.value))

  // 更新连胜
  streakDays.value++
  dailyLastDate.value = today.toDateString()
}
</script>

<style scoped>
.interactive-practice {
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

.mode-selection h2 {
  font-size: 24px;
  margin: 0 0 24px 0;
  text-align: center;
  color: #333;
}

.mode-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.mode-card {
  background: #f8f9fa;
  border: 2px solid transparent;
  border-radius: 12px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.2s;
}

.mode-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

.mode-card.active {
  border-color: #667eea;
  background: #f0f4ff;
}

.mode-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.mode-info h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
  color: #333;
}

.mode-info p {
  margin: 0 0 12px 0;
  color: #666;
  font-size: 14px;
}

.mode-desc {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.mode-desc span {
  background: #e9ecef;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  color: #666;
}

.mode-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 16px;
}

.mode-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.mode-option:hover {
  background: #e9ecef;
}

.mode-option.active {
  background: #d4edda;
  color: #155724;
}

.mode-option input[type="radio"] {
  cursor: pointer;
}

.start-section {
  text-align: center;
  margin-bottom: 20px;
}

.btn-start {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 16px 48px;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-start:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.daily-info {
  text-align: center;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
}

.daily-info p {
  margin: 4px 0;
  color: #666;
  font-size: 14px;
}

.daily-info .warning {
  color: #dc3545;
  font-weight: 600;
}

.practice-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 20px;
}

.practice-info {
  display: flex;
  gap: 16px;
  align-items: center;
  font-size: 14px;
  color: #666;
}

.practice-info span {
  font-weight: 600;
}

.mode-name {
  background: #667eea;
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
}

.timer {
  background: #f56565;
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-family: 'Courier New', monospace;
  font-weight: bold;
}

.btn-end {
  background: #6c757d;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-end:hover {
  background: #5a6268;
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

.combo-badge {
  background: linear-gradient(135deg, #f6ad55 0%, #ed8936 100%);
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  animation: pulse 0.5s ease-in-out;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.question-text {
  font-size: 16px;
  color: #333;
  margin-bottom: 20px;
  line-height: 1.6;
}

.table-editor {
  background: white;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
  border: 2px solid #e9ecef;
}

.formula-section {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}

.formula-section label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
}

.formula-input-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
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

.btn-check {
  background: #28a745;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-check:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
}

.btn-check:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.error-message {
  color: #dc3545;
  font-size: 14px;
  margin-bottom: 8px;
}

.success-message {
  color: #28a745;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
}

.real-result {
  padding: 12px;
  background: #d1ecf1;
  border-radius: 6px;
  color: #0c5460;
  font-size: 14px;
  font-family: 'Courier New', monospace;
}

.actions {
  display: flex;
  gap: 12px;
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

.btn-hint:hover:not(:disabled) {
  background: #e0a800;
}

.btn-next {
  background: #667eea;
  color: white;
}

.btn-next:hover:not(:disabled) {
  background: #5568d3;
}

.hint-box {
  background: #fff3cd;
  border-left: 4px solid #ffc107;
  padding: 16px;
  border-radius: 8px;
  margin-top: 16px;
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

.result-header {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 30px;
}

.result-mode {
  background: #667eea;
  color: white;
  padding: 8px 16px;
  border-radius: 12px;
  font-weight: 600;
}

.result-time {
  background: #48bb78;
  color: white;
  padding: 8px 16px;
  border-radius: 12px;
  font-weight: 600;
  font-family: 'Courier New', monospace;
}

.score-section {
  margin-bottom: 40px;
}

.score-display {
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

.score-max {
  font-size: 24px;
  color: #999;
}

.score-message {
  font-size: 20px;
  color: #333;
}

.result-stats {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

.stat-group {
  text-align: center;
}

.stat-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
  font-weight: 600;
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
  flex-wrap: wrap;
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

.btn-restart:hover {
  background: #5568d3;
}

.btn-back {
  background: #6c757d;
  color: white;
}

.btn-back:hover {
  background: #5a6268;
}

@media (max-width: 768px) {
  .container {
    padding: 20px;
  }

  .mode-cards {
    grid-template-columns: 1fr;
  }

  .practice-header {
    flex-direction: column;
    gap: 12px;
  }

  .practice-info {
    flex-wrap: wrap;
    justify-content: center;
  }

  .result-header {
    flex-direction: column;
    gap: 12px;
  }

  .result-stats {
    flex-direction: column;
    gap: 20px;
  }

  .result-actions {
    flex-direction: column;
  }
}
</style>
