<template>
  <div class="example-display">
    <div class="example-data">
      <table>
        <tr v-for="row in example.data" :key="row.id">
          <td v-for="cell in row.cells" :key="cell.id">
            {{ cell.value }}
          </td>
        </tr>
      </table>
    </div>
    <div class="example-formula">
      <label>公式：</label>
      <code>{{ example.formula }}</code>
      <button @click="copyFormula" class="copy-btn">📋</button>
    </div>
    <div class="example-result">
      <span class="result-label">结果：</span>
      <span class="result-value">{{ example.result }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMessage } from 'naive-ui'
import type { Example } from '../types'

const props = defineProps<{
  example: Example
}>()

const message = useMessage()

function copyFormula() {
  navigator.clipboard.writeText(props.example.formula).then(() => {
    message.success('📋 公式已复制到剪贴板')
  }).catch(() => {
    message.error('❌ 复制失败，请重试')
  })
}
</script>

<style scoped lang="scss">
.example-display {
  padding: 1.5rem 0;
}

.example-data {
  margin-bottom: 1.5rem;
}

.example-data table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.example-data td {
  border: 1px solid #e5e7eb;
  padding: 0.75rem 1rem;
  text-align: center;
  font-family: 'Courier New', monospace;
  background: #f9fafb;

  &:first-child {
    background: #f3f4f6;
    font-weight: 600;
    color: #374151;
  }
}

.example-formula {
  background: #f3f4f6;
  padding: 1rem 1.25rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  border-left: 3px solid #3b82f6;
  position: relative;

  label {
    display: block;
    font-size: 0.875rem;
    color: #6b7280;
    margin-bottom: 0.5rem;
    font-weight: 500;
  }

  code {
    display: block;
    font-family: 'Courier New', monospace;
    font-size: 0.875rem;
    color: #2563eb;
    line-height: 1.5;
    word-break: break-all;
    padding-right: 3rem;
  }

  .copy-btn {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: white;
    border: 1px solid #e5e7eb;
    color: #6b7280;
    padding: 0.375rem 0.75rem;
    border-radius: 4px;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s;
  }

  .copy-btn:hover {
    background: #f9fafb;
    border-color: #3b82f6;
    color: #3b82f6;
  }
}

.example-result {
  padding: 1rem 1.25rem;
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  .result-label {
    font-weight: 600;
    color: #065f46;
  }

  .result-value {
    font-family: 'Courier New', monospace;
    font-size: 1.125rem;
    font-weight: 700;
    color: #047857;
  }
}

@media (max-width: 768px) {
  .example-data td {
    padding: 0.5rem;
    font-size: 0.875rem;
  }

  .example-formula {
    padding: 0.875rem 1rem;
  }

  .example-result {
    padding: 0.875rem 1rem;
  }
}
</style>
