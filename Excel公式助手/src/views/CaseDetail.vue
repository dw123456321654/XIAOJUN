<template>
  <div class="case-detail-container">
    <div class="container">
      <div class="header">
        <button @click="goBack" class="back-btn">← 返回</button>
        <div class="header-info">
          <h1>📋 {{ caseItem?.title }}</h1>
          <div class="case-meta">
            <n-tag type="info">{{ caseItem?.industry }}</n-tag>
            <n-tag type="success">{{ caseItem?.category }}</n-tag>
            <n-tag :type="caseItem?.difficulty === '初级' ? 'warning' : caseItem?.difficulty === '中级' ? 'error' : 'default'">
              {{ caseItem?.difficulty }}
            </n-tag>
          </div>
        </div>
      </div>

      <div v-if="caseItem" class="case-content">
        <!-- 场景描述 -->
        <div class="scenario-section">
          <h2>📖 场景描述</h2>
          <p>{{ caseItem.scenario }}</p>
        </div>

        <!-- 数据模板 -->
        <div class="data-section">
          <h2>📊 数据模板</h2>
          <div class="template-preview">
            <TableGrid
              v-model:data="tableData"
              v-model:headers="tableHeaders"
              :initial-rows="caseItem.dataTemplate.rows.length"
              :initial-cols="caseItem.dataTemplate.headers.length"
              :data="caseItem.dataTemplate.rows"
              :headers="caseItem.dataTemplate.headers"
              readonly
            />
          </div>
          <div class="download-actions">
            <button @click="downloadTemplate" class="btn-download">
              📥 下载Excel模板
            </button>
            <button @click="copyData" class="btn-copy">
              📋 复制数据
            </button>
          </div>
        </div>

        <!-- 实施步骤 -->
        <div class="steps-section">
          <h2>📝 实施步骤</h2>
          <div class="steps-list">
            <div v-for="(step, index) in caseItem.steps" :key="index" class="step-item">
              <div class="step-header">
                <div class="step-number">{{ step.step }}</div>
                <div class="step-description">{{ step.description }}</div>
              </div>
              <div class="step-formula">
                <label>公式：</label>
                <code>{{ step.formula }}</code>
                <button @click="copyFormula(step.formula)" class="btn-copy-mini">
                  📋
                </button>
              </div>
              <div class="step-explanation">
                <label>解析：</label>
                <p>{{ step.explanation }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 关键公式 -->
        <div class="formulas-section">
          <h2>🔑 关键公式</h2>
          <div class="formulas-list">
            <n-tag
              v-for="formula in caseItem.keyFormulas"
              :key="formula"
              type="info"
              size="medium"
            >
              {{ formula }}
            </n-tag>
          </div>
          <div class="copy-all">
            <button @click="copyAllFormulas" class="btn-copy-all">
              📋 复制所有公式
            </button>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="actions-section">
          <h2>🎯 操作</h2>
          <div class="action-buttons">
            <button @click="startPractice" class="btn-practice">
              📝 开始练习
            </button>
            <button @click="addToFavorites" class="btn-favorite">
              ⭐ 添加到收藏
            </button>
            <button @click="shareCase" class="btn-share">
              🔗 分享案例
            </button>
            <button @click="saveAsTemplate" class="btn-template">
              💾 保存为模板
            </button>
          </div>
        </div>
      </div>

      <div v-else class="loading">
        <p>加载中...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { NTag } from 'naive-ui'
import { useMessage } from 'naive-ui'
import TableGrid from '../components/TableGrid.vue'
import { getCaseById } from '../utils/realCases'
import type { RealCase } from '../types'
import * as XLSX from 'xlsx'
import { save } from '@tauri-apps/plugin-dialog'
import { writeFile } from '@tauri-apps/plugin-fs'

const route = useRoute()
const router = useRouter()
const message = useMessage()

const caseId = route.params.id as string
const caseItem = ref<RealCase | null>(null)
const tableData = ref<string[][]>([])
const tableHeaders = ref<string[]>([])

onMounted(() => {
  caseItem.value = getCaseById(caseId)
  if (caseItem.value) {
    tableData.value = caseItem.value.dataTemplate.rows.map(row => [...row])
    tableHeaders.value = caseItem.value.dataTemplate.headers.map(header => header.toString())
  } else {
    message.error('案例不存在')
    goBack()
  }
})

function goBack() {
  router.push('/real-cases')
}

async function downloadTemplate() {
  if (!caseItem.value) return

  try {
    // 准备Excel数据
    const headers = caseItem.value.dataTemplate.headers
    const rows = caseItem.value.dataTemplate.rows

    // 构建Excel数据数组（第一行是表头）
    const excelData = [headers, ...rows]

    // 创建工作簿
    const workbook = XLSX.utils.book_new()

    // 创建工作表
    const worksheet = XLSX.utils.aoa_to_sheet(excelData)

    // 设置列宽（每列宽度15）
    const colWidths = headers.map(() => ({ wch: 15 }))
    worksheet['!cols'] = colWidths

    // 添加工作表到工作簿
    XLSX.utils.book_append_sheet(workbook, worksheet, '数据模板')

    // 生成文件名（移除特殊字符）
    const safeTitle = caseItem.value.title.replace(/[<>:"/\\|?*]/g, '_')
    const defaultFileName = `${safeTitle}_模板.xlsx`

    // 弹出保存对话框
    const filePath = await save({
      filters: [
        { name: 'Excel文件', extensions: ['xlsx'] }
      ],
      defaultPath: defaultFileName
    })

    if (filePath) {
      // 将工作簿转换为二进制数据
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
      const binaryData = new Uint8Array(excelBuffer)

      // 写入文件
      await writeFile(filePath, binaryData)

      message.success(`📥 Excel模板已保存：${filePath}`)
    } else {
      // 用户取消了保存对话框
      message.info('已取消保存')
    }
  } catch (error) {
    console.error('Download template error:', error)
    message.error('❌ 下载失败，请重试')
  }
}

function copyData() {
  const headers = tableHeaders.value.join('\t')
  const rows = tableData.value.map(row => row.join('\t')).join('\n')
  const csv = headers + '\n' + rows

  navigator.clipboard.writeText(csv).then(() => {
    message.success('📋 数据已复制到剪贴板（CSV格式）')
  }).catch(() => {
    message.error('❌ 复制失败')
  })
}

function copyFormula(formula: string) {
  navigator.clipboard.writeText(formula).then(() => {
    message.success('📋 公式已复制')
  }).catch(() => {
    message.error('❌ 复制失败')
  })
}

function copyAllFormulas() {
  if (!caseItem.value) return
  const formulas = caseItem.value.keyFormulas.join('\n')
  navigator.clipboard.writeText(formulas).then(() => {
    message.success('📋 所有公式已复制')
  }).catch(() => {
    message.error('❌ 复制失败')
  })
}

function startPractice() {
  // TODO: 启动基于该案例的练习
  message.info(`📝 开始练习：${caseItem.value?.title}`)
  router.push('/practice/interactive')
}

function addToFavorites() {
  // TODO: 添加到收藏
  message.success(`⭐ 案例已添加到收藏`)
}

function shareCase() {
  // TODO: 分享案例
  message.info(`🔗 分享案例：${caseItem.value?.title}`)
}

function saveAsTemplate() {
  // TODO: 保存为模板
  message.success(`💾 案例已保存为模板`)
}
</script>

<style scoped>
.case-detail-container {
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

.header-info {
  flex: 1;
}

.header-info h1 {
  margin: 0 0 12px 0;
  font-size: 28px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.case-meta {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

h2 {
  margin: 0 0 20px 0;
  font-size: 22px;
  color: #333;
}

.scenario-section {
  margin-bottom: 30px;
  padding: 24px;
  background: #f8f9fa;
  border-radius: 12px;
}

.scenario-section p {
  margin: 0;
  color: #666;
  line-height: 1.6;
  font-size: 16px;
}

.data-section {
  margin-bottom: 30px;
}

.data-section h2 {
  margin-bottom: 16px;
}

.template-preview {
  margin-bottom: 16px;
}

.download-actions {
  display: flex;
  gap: 12px;
}

.btn-download,
.btn-copy {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-download {
  background: #48bb78;
  color: white;
}

.btn-download:hover {
  background: #38a169;
}

.btn-copy {
  background: #9f7aea;
  color: white;
}

.btn-copy:hover {
  background: #805ad5;
}

.steps-section {
  margin-bottom: 30px;
}

.steps-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.step-item {
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.2s;
}

.step-item:hover {
  border-color: #667eea;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.step-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.step-number {
  background: #667eea;
  color: white;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
  flex-shrink: 0;
}

.step-description {
  flex: 1;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.step-formula {
  margin-bottom: 12px;
}

.step-formula label {
  display: inline-block;
  font-weight: 600;
  color: #374151;
  margin-right: 8px;
}

.step-formula code {
  background: #1e293b;
  color: #a5b4fc;
  padding: 12px 16px;
  border-radius: 8px;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  word-break: break-all;
}

.btn-copy-mini {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  padding: 4px;
  margin-left: 8px;
  transition: all 0.2s;
  opacity: 0.6;
}

.btn-copy-mini:hover {
  opacity: 1;
}

.step-explanation {
  margin-bottom: 12px;
}

.step-explanation label {
  display: inline-block;
  font-weight: 600;
  color: #374151;
  margin-right: 8px;
}

.step-explanation p {
  margin: 0;
  display: inline-block;
  color: #6b7280;
  font-size: 14px;
  line-height: 1.6;
}

.formulas-section {
  margin-bottom: 30px;
  padding: 24px;
  background: #f8f9fa;
  border-radius: 12px;
}

.formulas-list {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.copy-all {
  text-align: center;
}

.btn-copy-all {
  background: #667eea;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-copy-all:hover {
  background: #5568d3;
}

.actions-section {
  margin-bottom: 30px;
}

.action-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.action-buttons button {
  padding: 14px 20px;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.action-buttons button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn-practice {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-favorite {
  background: #f6ad55;
  color: white;
}

.btn-share {
  background: #ed8936;
  color: white;
}

.btn-template {
  background: #48bb78;
  color: white;
}

.loading {
  text-align: center;
  padding: 60px;
  color: #666;
  font-size: 16px;
}

@media (max-width: 768px) {
  .container {
    padding: 20px;
  }

  .header {
    flex-direction: column;
    align-items: flex-start;
  }

  .step-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .action-buttons {
    grid-template-columns: 1fr;
  }
}
</style>
