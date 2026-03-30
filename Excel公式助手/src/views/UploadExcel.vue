<template>
  <div class="upload-excel-container">
    <div class="container">
      <div class="header">
        <button @click="goBack" class="back-btn">← 返回</button>
        <h1>📤 上传Excel文件</h1>
        <p class="subtitle">客端解析，不上传服务器，安全可靠</p>
      </div>

      <!-- 上传区域 -->
      <div v-if="!uploadedFile" class="upload-section">
        <div
          class="upload-zone"
          :class="{ 'drag-over': isDragOver, 'uploading': isUploading }"
          @dragover.prevent="onDragOver"
          @dragleave="onDragLeave"
          @drop.prevent="onDrop"
          @click="selectFile"
        >
          <input
            ref="fileInput"
            type="file"
            accept=".xlsx,.xls,.csv"
            @change="handleFileSelect"
            class="hidden-input"
          />

          <div v-if="!isUploading" class="upload-content">
            <div class="upload-icon">📥</div>
            <h3>拖拽文件到此处</h3>
            <p>或者点击选择文件</p>
            <div class="file-types">
              <n-tag type="info">.xlsx</n-tag>
              <n-tag type="info">.xls</n-tag>
              <n-tag type="info">.csv</n-tag>
            </div>
            <div class="upload-limit">
              文件大小限制：50MB
            </div>
          </div>

          <div v-if="isUploading" class="upload-progress">
            <n-spin size="large" />
            <p>正在解析文件...</p>
            <n-progress
              type="line"
              :percentage="uploadProgress"
              :show-indicator="false"
            />
          </div>
        </div>

        <div v-if="errorMessage" class="error-message">
          <n-alert type="error" :title="errorMessage" />
        </div>
      </div>

      <!-- 文件信息展示 -->
      <div v-if="uploadedFile && !isUploading" class="file-info-section">
        <div class="file-info-card">
          <div class="file-icon">
            {{ getFileIcon(uploadedFile.name) }}
          </div>
          <div class="file-details">
            <h3>{{ uploadedFile.name }}</h3>
            <div class="file-meta">
              <span class="file-size">{{ formatFileSize(uploadedFile.size) }}</span>
              <span class="file-type">{{ getFileType(uploadedFile.name) }}</span>
            </div>
          </div>
          <div class="file-actions">
            <button @click="reUpload" class="btn-reupload">
              🔄 重新上传
            </button>
            <button @click="analyzeFile" class="btn-analyze">
              🔍 开始分析
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMessage, NTag, NAlert, NSpin, NProgress } from 'naive-ui'
import { excelParser, type ExcelData } from '../utils/excelParser'

const router = useRouter()
const message = useMessage()

// 文件上传相关
const fileInput = ref<HTMLInputElement | null>(null)
const isDragOver = ref(false)
const isUploading = ref(false)
const uploadProgress = ref(0)
const uploadedFile = ref<{ name: string; size: number; data: ExcelData } | null>(null)
const errorMessage = ref('')

// 文件大小限制
const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB

// 方法
function goBack() {
  router.push('/settings')
}

function selectFile() {
  fileInput.value?.click()
}

function onDragOver(e: DragEvent) {
  e.preventDefault()
  isDragOver.value = true
}

function onDragLeave(e: DragEvent) {
  e.preventDefault()
  isDragOver.value = false
}

function onDrop(e: DragEvent) {
  e.preventDefault()
  isDragOver.value = false

  const files = e.dataTransfer?.files
  if (files && files.length > 0) {
    handleFile(files[0])
  }
}

async function handleFileSelect(e: Event) {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    await handleFile(file)
  }
}

async function handleFile(file: File) {
  // 清除错误信息
  errorMessage.value = ''

  // 验证文件类型
  const fileType = getFileType(file.name)
  if (!['.xlsx', '.xls', '.csv'].includes(fileType)) {
    errorMessage.value = '文件格式不支持，请上传.xlsx、.xls或.csv文件'
    return
  }

  // 验证文件大小
  if (file.size > MAX_FILE_SIZE) {
    errorMessage.value = `文件大小超过限制（50MB），当前文件：${formatFileSize(file.size)}`
    return
  }

  // 开始上传和解析
  isUploading.value = true
  uploadProgress.value = 0

  try {
    // 模拟上传进度
    const progressInterval = setInterval(() => {
      if (uploadProgress.value < 80) {
        uploadProgress.value += 10
      }
    }, 100)

    // 解析Excel文件
    const data = await excelParser.parseFile(file)

    // 完成进度
    clearInterval(progressInterval)
    uploadProgress.value = 100

    // 存储解析结果
    uploadedFile.value = {
      name: file.name,
      size: file.size,
      data
    }

    message.success(`✅ 文件解析成功！共发现 ${data.formulaStats.totalCount} 个公式`)

    // 延迟跳转
    setTimeout(() => {
      isUploading.value = false
      uploadProgress.value = 0
    }, 500)
  } catch (error) {
    clearInterval(progressInterval)
    isUploading.value = false
    uploadProgress.value = 0

    errorMessage.value = `解析失败：${error instanceof Error ? error.message : String(error)}`
  }
}

function reUpload() {
  uploadedFile.value = null
  errorMessage.value = ''
}

async function analyzeFile() {
  if (!uploadedFile.value) return

  // 保存文件数据到sessionStorage
  sessionStorage.setItem('uploaded-excel-data', JSON.stringify(uploadedFile.value.data))

  // 跳转到分析页面
  router.push('/upload/analysis')
}

function getFileIcon(fileName: string): string {
  const fileType = getFileType(fileName)
  if (fileType === '.xlsx') return '📊'
  if (fileType === '.xls') return '📋'
  if (fileType === '.csv') return '📃'
  return '📄'
}

function getFileType(fileName: string): string {
  const lowerName = fileName.toLowerCase()
  if (lowerName.endsWith('.xlsx')) return '.xlsx'
  if (lowerName.endsWith('.xls')) return '.xls'
  if (lowerName.endsWith('.csv')) return '.csv'
  return '.xlsx'
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
}
</script>

<style scoped>
.upload-excel-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.header {
  margin-bottom: 40px;
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
  margin: 16px 0 8px 0;
  font-size: 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  margin: 0 0 16px 0;
  color: #666;
  font-size: 16px;
}

.upload-section {
  margin-bottom: 20px;
}

.upload-zone {
  border: 3px dashed #cbd5e0;
  border-radius: 16px;
  padding: 60px 40px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  background: #fafafa;
}

.upload-zone:hover {
  border-color: #667eea;
  background: #f0f4ff;
}

.upload-zone.drag-over {
  border-color: #667eea;
  background: #e0e7ff;
  transform: scale(1.02);
}

.upload-zone.uploading {
  border-style: solid;
  border-color: #667eea;
  background: #f0f4ff;
}

.hidden-input {
  display: none;
}

.upload-content {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.upload-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.upload-content h3 {
  margin: 0 0 12px 0;
  font-size: 20px;
  color: #333;
}

.upload-content p {
  margin: 0 0 16px 0;
  color: #666;
  font-size: 15px;
}

.file-types {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 20px;
}

.upload-limit {
  padding: 12px 20px;
  background: #f8f9fa;
  border-radius: 8px;
  display: inline-block;
  color: #666;
  font-size: 14px;
}

.upload-progress {
  padding: 40px 20px;
}

.upload-progress p {
  margin: 20px 0 8px 0;
  color: #666;
  font-size: 15px;
}

.error-message {
  margin-bottom: 20px;
}

.file-info-section {
  animation: slideIn 0.3s ease-in-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.file-info-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 30px;
  display: flex;
  align-items: center;
  gap: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  color: white;
}

.file-icon {
  font-size: 64px;
  flex-shrink: 0;
}

.file-details {
  flex: 1;
}

.file-details h3 {
  margin: 0 0 8px 0;
  font-size: 22px;
  font-weight: 600;
  word-break: break-all;
}

.file-meta {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.file-size,
.file-type {
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
}

.file-actions {
  display: flex;
  gap: 12px;
}

.file-actions button {
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.file-actions button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.btn-reupload {
  background: #f59e0b !important;
  color: white !important;
}

.btn-reupload:hover {
  background: #d97706 !important;
}

.btn-analyze {
  background: #10b981 !important;
  color: white !important;
}

.btn-analyze:hover {
  background: #059669 !important;
}

@media (max-width: 768px) {
  .container {
    padding: 20px;
  }

  .file-info-card {
    flex-direction: column;
    text-align: center;
  }

  .file-meta {
    justify-content: center;
  }

  .file-actions {
    flex-direction: column;
  }

  .file-actions button {
    width: 100%;
  }
}
</style>
