<template>
  <div class="practice-container">
    <div class="header">
      <h1>公式练习</h1>
      <n-select
        v-model:value="selectedPractice"
        :options="practiceOptions"
        style="width: 250px"
        @update:value="loadPractice"
      />
    </div>

    <div class="practice-content">
      <div class="example-section">
        <h2>示例数据</h2>
        <div class="example-data">
          <table>
            <tr v-for="row in currentPractice.example.data" :key="row.id">
              <td v-for="cell in row.cells" :key="cell.id">
                {{ cell.value }}
              </td>
            </tr>
          </table>
        </div>
      </div>

      <div class="practice-section">
        <h2>练习区域</h2>
        <p class="task">
          <span class="task-label">任务：</span>
          {{ currentPractice.task }}
        </p>
        <n-input
          v-model:value="userFormula"
          type="textarea"
          placeholder="输入你的公式（以=开头）..."
          :rows="4"
          @keyup.enter.ctrl="checkFormula"
        />
        <div class="action-buttons">
          <n-button
            type="primary"
            size="large"
            @click="checkFormula"
            :loading="checking"
            :disabled="!userFormula.trim()"
          >
            提交答案
          </n-button>
          <n-button size="large" @click="showAnswer = !showAnswer">
            {{ showAnswer ? '隐藏答案' : '查看答案' }}
          </n-button>
          <n-button size="large" @click="resetPractice">
            重置
          </n-button>
        </div>

        <div v-if="showAnswer" class="answer-section">
          <h3>✅ 正确答案</h3>
          <code>{{ currentPractice.answer }}</code>
        </div>

        <div v-if="feedback" class="feedback" :class="{ success: isCorrect, error: !isCorrect }">
          {{ feedback }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { NInput, NButton, NSelect } from 'naive-ui'
import { practices as allPractices } from '../utils/data'
import { validatePracticeAnswer } from '../utils/formulaHelper'

const userFormula = ref('')
const showAnswer = ref(false)
const checking = ref(false)
const feedback = ref('')
const isCorrect = ref(false)
const selectedPractice = ref('1')

const currentPractice = computed(() => {
  return allPractices.find((p) => p.id === selectedPractice.value) || allPractices[0]
})

const practiceOptions = computed(() => {
  return allPractices.map((p) => ({
    label: `练习 ${p.id}`,
    value: p.id,
  }))
})

function loadPractice() {
  resetPractice()
}

function resetPractice() {
  userFormula.value = ''
  showAnswer.value = false
  feedback.value = ''
  isCorrect.value = false
}

function checkFormula() {
  if (!userFormula.value.trim()) {
    return
  }

  checking.value = true

  setTimeout(() => {
    const valid = validatePracticeAnswer(userFormula.value, currentPractice.value.answer)

    if (valid) {
      feedback.value = '🎉 太棒了！答案正确！'
      isCorrect.value = true
    } else {
      feedback.value = '❌ 答案不正确，再试试看吧！提示：注意检查引用范围和参数顺序。'
      isCorrect.value = false
    }

    checking.value = false
  }, 500)
}
</script>

<style scoped lang="scss">
.practice-container {
  min-height: 100vh;
  background: #f9fafb;
  padding: 2rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.header h1 {
  margin: 0;
  font-size: 1.5rem;
  color: #111827;
}

.practice-content {
  max-width: 900px;
  margin: 0 auto;
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.example-section,
.practice-section {
  margin-bottom: 2rem;
}

h2 {
  margin: 0 0 1rem 0;
  font-size: 1.25rem;
  color: #111827;
}

.example-data table {
  width: 100%;
  border-collapse: collapse;
  background: #f9fafb;
  border-radius: 8px;
  overflow: hidden;
}

.example-data td {
  border: 1px solid #e5e7eb;
  padding: 1rem 1.25rem;
  text-align: center;
  font-family: 'Courier New', monospace;
  font-size: 0.9375rem;
  background: white;

  &:first-child {
    background: #f3f4f6;
    font-weight: 600;
    color: #374151;
  }
}

.task {
  color: #6b7280;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #eff6ff;
  border-left: 4px solid #3b82f6;
  border-radius: 4px;

  .task-label {
    font-weight: 600;
    color: #1e40af;
    margin-right: 0.5rem;
  }
}

.n-input {
  margin-bottom: 1.5rem;
}

.action-buttons {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.answer-section {
  margin-top: 1.5rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  border-radius: 8px;
}

.answer-section h3 {
  margin: 0 0 1rem 0;
  color: #065f46;
  font-size: 1.125rem;
}

.answer-section code {
  display: block;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 1rem;
  color: #047857;
  line-height: 1.6;
  word-break: break-all;
}

.feedback {
  margin-top: 1.5rem;
  padding: 1.25rem;
  border-radius: 8px;
  font-weight: 500;
  font-size: 1.0625rem;
  text-align: center;
}

.feedback.success {
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  color: #065f46;
  border: 2px solid #10b981;
}

.feedback.error {
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  color: #991b1b;
  border: 2px solid #ef4444;
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .practice-content {
    padding: 1.5rem;
  }

  .example-data td {
    padding: 0.75rem;
    font-size: 0.875rem;
  }

  .action-buttons {
    flex-direction: column;

    .n-button {
      width: 100%;
    }
  }
}
</style>
