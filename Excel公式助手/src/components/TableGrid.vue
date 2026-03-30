<template>
  <div class="table-grid">
    <div class="table-toolbar">
      <button @click="addRow" class="btn-add">
        ➕ 添加行
      </button>
      <button @click="addColumn" class="btn-add">
        ➕ 添加列
      </button>
      <button @click="clearAll" class="btn-clear">
        🗑️ 清空表格
      </button>
    </div>

    <div class="table-container">
      <table ref="tableRef">
        <thead>
          <tr>
            <th v-for="(_, colIndex) in columnCount" :key="`header-${colIndex}`">
              <input
                v-model="headers[colIndex]"
                @keyup.enter="focusCell(0, colIndex)"
                class="header-input"
                placeholder="表头"
              />
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(_, rowIndex) in rowCount" :key="`row-${rowIndex}`">
            <td
              v-for="(_, colIndex) in columnCount"
              :key="`cell-${rowIndex}-${colIndex}`"
              class="cell"
              :class="{ 'selected': selectedCell.row === rowIndex && selectedCell.col === colIndex }"
              @click="selectCell(rowIndex, colIndex)"
            >
              <input
                v-model="cells[rowIndex][colIndex]"
                @keyup.enter="moveToNextCell(rowIndex, colIndex)"
                @keydown.arrow-down="moveToRow(rowIndex + 1, colIndex)"
                @keydown.arrow-up="moveToRow(rowIndex - 1, colIndex)"
                @keydown.arrow-left="moveToCol(rowIndex, colIndex - 1)"
                @keydown.arrow-right="moveToCol(rowIndex, colIndex + 1)"
                class="cell-input"
                ref="cellInputs"
              />
            </td>
            <td class="delete-row-btn" @click="deleteRow(rowIndex)">
              ✕
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="table-footer">
      <div class="table-info">
        <span>{{ rowCount }} 行</span>
        <span>{{ columnCount }} 列</span>
        <span>{{ totalCells }} 个单元格</span>
      </div>
      <button @click="exportData" class="btn-export">
        📤 导出数据
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface Props {
  initialRows?: number
  initialCols?: number
  data?: string[][]
  headers?: string[]
}

interface Emits {
  (e: 'update:data', data: string[][]): void
  (e: 'update:headers', headers: string[]): void
}

const props = withDefaults(defineProps<Props>(), {
  initialRows: 5,
  initialCols: 4,
  data: () => [],
  headers: () => []
})

const emit = defineEmits<Emits>()

const rowCount = ref(props.data.length || props.initialRows)
const columnCount = ref(props.data[0]?.length || props.initialCols)
const headers = ref<string[]>(props.headers.length > 0 ? [...props.headers] : [])
const cells = ref<string[][]>([])

const selectedCell = ref({ row: 0, col: 0 })
const tableRef = ref<HTMLElement | null>(null)
const cellInputs = ref<HTMLInputElement[]>([])

const totalCells = computed(() => rowCount.value * columnCount.value)

// 初始化数据
function initData() {
  // 初始化表头
  if (headers.value.length === 0) {
    headers.value = Array.from({ length: columnCount.value }, (_, i) => `列${String.fromCharCode(65 + i)}`)
  }

  // 初始化单元格
  if (cells.value.length === 0) {
    cells.value = Array.from({ length: rowCount.value }, () =>
      Array.from({ length: columnCount.value }, () => '')
    )
  }

  // 使用传入的数据
  if (props.data.length > 0) {
    cells.value = props.data.map(row => [...row])
    rowCount.value = props.data.length
    columnCount.value = props.data[0]?.length || 4
  }
}

// 监听数据变化
watch(cells, (newCells) => {
  emit('update:data', newCells)
}, { deep: true })

watch(headers, (newHeaders) => {
  emit('update:headers', newHeaders)
}, { deep: true })

// 添加行
function addRow() {
  cells.value.push(Array.from({ length: columnCount.value }, () => ''))
  rowCount.value++
}

// 删除行
function deleteRow(rowIndex: number) {
  if (rowCount.value <= 1) {
    alert('至少保留一行')
    return
  }
  cells.value.splice(rowIndex, 1)
  rowCount.value--
}

// 添加列
function addColumn() {
  headers.value.push(`列${String.fromCharCode(65 + headers.value.length)}`)
  cells.value.forEach(row => row.push(''))
  columnCount.value++
}

// 清空表格
function clearAll() {
  if (confirm('确定要清空所有数据吗？')) {
    cells.value = Array.from({ length: rowCount.value }, () =>
      Array.from({ length: columnCount.value }, () => '')
    )
  }
}

// 选择单元格
function selectCell(row: number, col: number) {
  selectedCell.value = { row, col }
}

// 聚焦单元格
function focusCell(row: number, col: number) {
  selectCell(row, col)
  setTimeout(() => {
    const index = row * columnCount.value + col
    cellInputs.value[index]?.focus()
  }, 10)
}

// 移动到下一行
function moveToRow(row: number, col: number) {
  if (row >= 0 && row < rowCount.value) {
    focusCell(row, col)
  }
}

// 移动到下一列
function moveToCol(row: number, col: number) {
  if (col >= 0 && col < columnCount.value) {
    focusCell(row, col)
  }
}

// 移动到下一个单元格（Enter键）
function moveToNextCell(row: number, col: number) {
  const nextRow = row + 1
  if (nextRow < rowCount.value) {
    focusCell(nextRow, col)
  }
}

// 导出数据
function exportData() {
  const data = {
    headers: headers.value,
    cells: cells.value
  }
  const json = JSON.stringify(data, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'table-data.json'
  a.click()
  URL.revokeObjectURL(url)
}

// 初始化
initData()
</script>

<style scoped>
.table-grid {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.table-toolbar {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.table-toolbar button {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-add {
  background: #667eea;
  color: white;
}

.btn-add:hover {
  background: #5568d3;
}

.btn-clear {
  background: #f56565;
  color: white;
}

.btn-clear:hover {
  background: #e53e3e;
}

.table-container {
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  overflow: auto;
  max-height: 500px;
  margin-bottom: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: #f8f9fa;
  position: sticky;
  top: 0;
  z-index: 10;
}

th {
  padding: 12px 8px;
  border-bottom: 2px solid #e5e7eb;
  border-right: 1px solid #e5e7eb;
  font-weight: 600;
  color: #374151;
  min-width: 100px;
}

.header-input {
  width: 100%;
  padding: 8px;
  border: none;
  background: transparent;
  font-weight: 600;
  color: #374151;
  text-align: center;
  border-radius: 4px;
  transition: all 0.2s;
}

.header-input:focus {
  outline: none;
  background: #f0f4ff;
}

td {
  border-bottom: 1px solid #e5e7eb;
  border-right: 1px solid #e5e7eb;
  padding: 4px 0;
}

.cell {
  position: relative;
}

.cell.selected {
  background: #f0f4ff;
}

.cell-input {
  width: 100%;
  padding: 8px;
  border: none;
  background: transparent;
  text-align: center;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  color: #111827;
  border-radius: 4px;
  transition: all 0.2s;
}

.cell-input:focus {
  outline: none;
  background: #f0f4ff;
}

.delete-row-btn {
  width: 30px;
  text-align: center;
  cursor: pointer;
  color: #f56565;
  font-size: 14px;
  transition: all 0.2s;
  border-left: 1px solid #e5e7eb;
}

.delete-row-btn:hover {
  background: #fee2e2;
}

.table-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 2px solid #e5e7eb;
}

.table-info {
  display: flex;
  gap: 20px;
  color: #6b7280;
  font-size: 14px;
}

.table-info span {
  font-weight: 600;
}

.btn-export {
  background: #48bb78;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-export:hover {
  background: #38a169;
}

@media (max-width: 768px) {
  .table-toolbar {
    flex-direction: column;
  }

  .table-toolbar button {
    width: 100%;
  }

  .table-footer {
    flex-direction: column;
    gap: 12px;
  }

  .table-info {
    width: 100%;
    justify-content: center;
  }

  .btn-export {
    width: 100%;
  }
}
</style>
