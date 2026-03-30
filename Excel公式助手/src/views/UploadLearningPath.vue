<template>
  <div class="learning-path-container">
    <div class="header">
      <h1>📚 学习路径生成</h1>
      <p>基于您的Excel公式使用情况，生成个性化学习路径</p>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading">
      <n-spin size="large" />
      <p>正在生成学习路径...</p>
    </div>

    <!-- 空状态 -->
    <div v-else-if="!hasAnalysisData" class="empty-state">
      <div class="empty-icon">📊</div>
      <h3>暂无分析数据</h3>
      <p>请先上传Excel文件并进行分析</p>
      <n-button type="primary" @click="goToUpload">
        上传文件
      </n-button>
    </div>

    <!-- 学习路径内容 -->
    <div v-else class="content">
      <!-- 用户画像 -->
      <div class="user-profile">
        <div class="profile-header">
          <h2>👤 您的学习画像</h2>
        </div>
        <div class="profile-content">
          <div class="profile-item">
            <div class="item-icon">📊</div>
            <div class="item-content">
              <div class="item-label">当前水平</div>
              <div class="item-value" :class="getLevelClass(userProfile.level)">
                {{ getLevelText(userProfile.level) }}
              </div>
            </div>
          </div>
          <div class="profile-item">
            <div class="item-icon">📝</div>
            <div class="item-content">
              <div class="item-label">已使用公式</div>
              <div class="item-value">{{ userProfile.formulasUsed }}个</div>
            </div>
          </div>
          <div class="profile-item">
            <div class="item-icon">🎯</div>
            <div class="item-content">
              <div class="item-label">擅长领域</div>
              <div class="item-value">{{ userProfile.strengths.join('、') }}</div>
            </div>
          </div>
          <div class="profile-item">
            <div class="item-icon">📈</div>
            <div class="item-content">
              <div class="item-label">提升空间</div>
              <div class="item-value">{{ userProfile.improvements.join('、') }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 推荐学习路径 -->
      <div class="learning-paths">
        <h2>🎯 为您推荐的学习路径</h2>
        <div class="paths-grid">
          <div
            v-for="path in learningPaths"
            :key="path.id"
            class="path-card"
            :class="{ 'recommended': path.recommended }"
          >
            <div class="path-header">
              <div class="path-info">
                <div class="path-icon">{{ path.icon }}</div>
                <div>
                  <h3>{{ path.name }}</h3>
                  <div class="path-meta">
                    <span class="path-difficulty" :class="getDifficultyClass(path.difficulty)">
                      {{ getDifficultyText(path.difficulty) }}
                    </span>
                    <span class="path-duration">{{ path.duration }}</span>
                  </div>
                </div>
              </div>
              <div v-if="path.recommended" class="recommended-badge">
                推荐
              </div>
            </div>

            <div class="path-description">
              <p>{{ path.description }}</p>
            </div>

            <div class="path-progress">
              <div class="progress-header">
                <label>学习进度</label>
                <span>{{ path.progress }}%</span>
              </div>
              <div class="progress-bar">
                <div
                  class="progress-fill"
                  :style="{ width: path.progress + '%' }"
                ></div>
              </div>
            </div>

            <div class="path-modules">
              <label>学习模块（{{ path.modules.length }}个）</label>
              <div class="modules-list">
                <div
                  v-for="(module, index) in path.modules"
                  :key="index"
                  class="module-item"
                  :class="{ 'completed': module.completed }"
                >
                  <span class="module-number">{{ index + 1 }}</span>
                  <span class="module-name">{{ module.name }}</span>
                  <span class="module-status">
                    <n-icon v-if="module.completed" size="16">
                      <check-icon />
                    </n-icon>
                    <n-icon v-else size="16">
                      <time-icon />
                    </n-icon>
                  </span>
                </div>
              </div>
            </div>

            <div class="path-formulas">
              <label>涉及公式（{{ path.formulas.length }}个）</label>
              <div class="formulas-list">
                <n-tag
                  v-for="formula in path.formulas.slice(0, 5)"
                  :key="formula"
                  type="info"
                  size="small"
                >
                  {{ formula }}
                </n-tag>
                <span v-if="path.formulas.length > 5" class="more-formulas">
                  +{{ path.formulas.length - 5 }}
                </span>
              </div>
            </div>

            <div class="path-actions">
              <button @click="startLearning(path)" class="btn-start">
                📖 开始学习
              </button>
              <button @click="viewDetails(path)" class="btn-details">
                查看详情
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 快速提升建议 -->
      <div class="quick-tips">
        <h2>💡 快速提升建议</h2>
        <div class="tips-list">
          <div
            v-for="(tip, index) in quickTips"
            :key="index"
            class="tip-card"
          >
            <div class="tip-icon">{{ tip.icon }}</div>
            <div class="tip-content">
              <h4>{{ tip.title }}</h4>
              <p>{{ tip.description }}</p>
              <div class="tip-formulas">
                <span>相关公式：</span>
                <n-tag
                  v-for="formula in tip.formulas"
                  :key="formula"
                  type="info"
                  size="small"
                >
                  {{ formula }}
                </n-tag>
              </div>
            </div>
            <button @click="learnTip(tip)" class="btn-learn">
              学习
            </button>
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="actions">
        <button @click="regeneratePath" class="btn-primary">
          🔄 重新生成路径
        </button>
        <button @click="exportPath" class="btn-secondary">
          📥 导出学习计划
        </button>
        <button @click="goToAnalysis" class="btn-secondary">
          ← 返回分析
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
import { NSpin, NButton, NTag, NIcon } from 'naive-ui'
import { CheckmarkCircle as CheckIcon, Time as TimeIcon } from '@vicons/ionicons5'

const router = useRouter()
const message = useMessage()

// 状态
const loading = ref(false)
const hasAnalysisData = ref(true) // TODO: 从store读取分析数据

// 用户画像
const userProfile = ref({
  level: 'intermediate', // beginner, intermediate, advanced
  formulasUsed: 12,
  strengths: ['数据汇总', '查找匹配'],
  improvements: ['数组公式', '高级查找']
})

// 学习路径
const learningPaths = ref([
  {
    id: 1,
    name: 'VLOOKUP 进阶之路',
    icon: '🔍',
    difficulty: 'intermediate',
    duration: '2小时',
    recommended: true,
    description: '从基础VLOOKUP到高级INDEX+MATCH，掌握数据查找的核心技巧',
    progress: 30,
    modules: [
      { name: 'VLOOKUP 基础用法', completed: true },
      { name: 'VLOOKUP 精确匹配 vs 模糊匹配', completed: true },
      { name: '多条件查找技巧', completed: false },
      { name: 'INDEX+MATCH 组合', completed: false },
      { name: 'XLOOKUP 新函数', completed: false }
    ],
    formulas: ['VLOOKUP', 'MATCH', 'INDEX', 'XLOOKUP', 'LOOKUP']
  },
  {
    id: 2,
    name: '数据汇总大师',
    icon: '📊',
    difficulty: 'intermediate',
    duration: '1.5小时',
    recommended: false,
    description: '掌握SUMIFS、COUNTIFS等多条件汇总函数，提升数据处理能力',
    progress: 0,
    modules: [
      { name: 'SUMIF vs SUMIFS', completed: false },
      { name: 'COUNTIF vs COUNTIFS', completed: false },
      { name: 'AVERAGEIFS 平均值', completed: false },
      { name: '多条件嵌套技巧', completed: false }
    ],
    formulas: ['SUMIF', 'SUMIFS', 'COUNTIF', 'COUNTIFS', 'AVERAGEIFS']
  },
  {
    id: 3,
    name: '文本处理专家',
    icon: '✏️',
    difficulty: 'beginner',
    duration: '1小时',
    recommended: false,
    description: '学习LEFT、RIGHT、MID等文本函数，轻松处理文本数据',
    progress: 60,
    modules: [
      { name: 'LEFT & RIGHT 提取字符', completed: true },
      { name: 'MID 截取中间字符', completed: true },
      { name: 'LEN 字符计数', completed: true },
      { name: 'FIND & SEARCH 查找', completed: false }
    ],
    formulas: ['LEFT', 'RIGHT', 'MID', 'LEN', 'FIND', 'SEARCH']
  }
])

// 快速提升建议
const quickTips = ref([
  {
    icon: '⚡',
    title: '提升VLOOKUP性能',
    description: '将VLOOKUP替换为INDEX+MATCH组合，性能可提升50%以上',
    formulas: ['VLOOKUP', 'INDEX', 'MATCH']
  },
  {
    icon: '🎯',
    title: '掌握IF嵌套',
    description: '学会使用IFS函数，告别多层IF嵌套的困扰',
    formulas: ['IF', 'IFS']
  },
  {
    icon: '📈',
    title: '数组公式入门',
    description: '理解数组公式，解锁更强大的计算能力',
    formulas: ['SUMPRODUCT', 'INDEX']
  },
  {
    icon: '🔗',
    title: '数据验证技巧',
    description: '使用数据验证和下拉菜单，提高数据录入效率',
    formulas: ['VLOOKUP', 'INDIRECT']
  }
])

// 获取水平文本
function getLevelText(level: string): string {
  const map: Record<string, string> = {
    beginner: '初级',
    intermediate: '中级',
    advanced: '高级'
  }
  return map[level] || level
}

// 获取水平样式类
function getLevelClass(level: string): string {
  return `level-${level}`
}

// 获取难度文本
function getDifficultyText(difficulty: string): string {
  const map: Record<string, string> = {
    beginner: '初级',
    intermediate: '中级',
    advanced: '高级'
  }
  return map[difficulty] || difficulty
}

// 获取难度样式类
function getDifficultyClass(difficulty: string): string {
  return `difficulty-${difficulty}`
}

// 开始学习
function startLearning(path: any) {
  // TODO: 开始学习路径
  message.success(`📖 开始学习：${path.name}`)
  // 跳转到学习页面
}

// 查看详情
function viewDetails(path: any) {
  // TODO: 查看学习路径详情
  message.info(`查看详情：${path.name}`)
}

// 学习建议
function learnTip(tip: any) {
  // TODO: 学习建议内容
  message.success(`💡 开始学习：${tip.title}`)
}

// 重新生成路径
function regeneratePath() {
  loading.value = true
  // TODO: 重新生成学习路径
  setTimeout(() => {
    loading.value = false
    message.success('🔄 学习路径已重新生成')
  }, 2000)
}

// 导出学习计划
function exportPath() {
  // TODO: 导出学习计划
  message.info('📥 正在生成学习计划...')
}

// 返回上传页面
function goToUpload() {
  router.push('/upload/excel')
}

// 返回分析页面
function goToAnalysis() {
  router.push('/upload/analysis')
}
</script>

<style scoped>
.learning-path-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.header {
  text-align: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
}

.header h1 {
  margin: 0 0 8px 0;
  font-size: 32px;
  color: white;
}

.header p {
  margin: 0;
  color: rgba(255, 255, 255, 0.9);
  font-size: 16px;
}

.loading {
  text-align: center;
  padding: 60px 20px;
}

.loading p {
  color: white;
  margin-top: 20px;
  font-size: 16px;
}

.empty-state {
  max-width: 500px;
  margin: 60px auto;
  text-align: center;
  background: white;
  padding: 40px;
  border-radius: 12px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.empty-state h3 {
  margin: 0 0 10px 0;
  font-size: 24px;
  color: #374151;
}

.empty-state p {
  margin: 0 0 20px 0;
  color: #6b7280;
}

.content {
  max-width: 1200px;
  margin: 0 auto;
}

/* 用户画像 */
.user-profile {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 30px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.profile-header {
  margin-bottom: 20px;
}

.profile-header h2 {
  margin: 0;
  font-size: 20px;
  color: #374151;
}

.profile-content {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.profile-item {
  flex: 1;
  min-width: 200px;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: #f9fafb;
  border-radius: 8px;
}

.item-icon {
  font-size: 40px;
}

.item-content {
  flex: 1;
}

.item-label {
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 8px;
  font-weight: 600;
}

.item-value {
  font-size: 18px;
  font-weight: bold;
  color: #374151;
}

.level-beginner {
  color: #48bb78;
}

.level-intermediate {
  color: #ed8936;
}

.level-advanced {
  color: #9f7aea;
}

/* 学习路径 */
.learning-paths {
  margin-bottom: 30px;
}

.learning-paths h2 {
  background: white;
  padding: 20px;
  border-radius: 12px 12px 0 0;
  margin: 0;
  font-size: 20px;
  color: #374151;
}

.paths-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.path-card {
  background: white;
  border-radius: 0 0 12px 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.2s;
}

.path-card.recommended {
  border: 2px solid #667eea;
}

.path-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.path-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  gap: 16px;
}

.path-info {
  display: flex;
  gap: 16px;
  flex: 1;
}

.path-icon {
  font-size: 48px;
}

.path-info h3 {
  margin: 0 0 8px 0;
  font-size: 20px;
  color: #374151;
}

.path-meta {
  display: flex;
  gap: 12px;
  align-items: center;
}

.path-difficulty {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
}

.difficulty-beginner {
  background: #d1fae5;
  color: #059669;
}

.difficulty-intermediate {
  background: #fef3c7;
  color: #d97706;
}

.difficulty-advanced {
  background: #fee2e2;
  color: #dc2626;
}

.path-duration {
  color: #6b7280;
  font-size: 14px;
}

.recommended-badge {
  background: #667eea;
  color: white;
  padding: 6px 16px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 600;
}

.path-description {
  margin-bottom: 20px;
}

.path-description p {
  margin: 0;
  color: #6b7280;
  line-height: 1.6;
  font-size: 14px;
}

.path-progress {
  margin-bottom: 20px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
}

.progress-header label {
  font-weight: 600;
  color: #374151;
}

.progress-header span {
  font-weight: 600;
  color: #667eea;
}

.progress-bar {
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 4px;
  transition: width 0.3s;
}

.path-modules,
.path-formulas {
  margin-bottom: 20px;
}

.path-modules label,
.path-formulas label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 12px;
}

.modules-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.module-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f9fafb;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
}

.module-item.completed {
  background: #d1fae5;
  border-color: #059669;
}

.module-number {
  background: #667eea;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
  flex-shrink: 0;
}

.module-item.completed .module-number {
  background: #059669;
}

.module-name {
  flex: 1;
  color: #374151;
  font-size: 14px;
}

.module-status {
  color: #6b7280;
}

.formulas-list {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.more-formulas {
  color: #9ca3af;
  font-size: 13px;
  padding: 4px 8px;
}

.path-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.path-actions button {
  flex: 1;
  min-width: 140px;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.path-actions button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn-start {
  background: #667eea;
  color: white;
}

.btn-start:hover {
  background: #5568d3;
}

.btn-details {
  background: #e5e7eb;
  color: #374151;
}

.btn-details:hover {
  background: #d1d5db;
}

/* 快速提升建议 */
.quick-tips {
  margin-bottom: 30px;
}

.quick-tips h2 {
  background: white;
  padding: 20px;
  border-radius: 12px 12px 0 0;
  margin: 0;
  font-size: 20px;
  color: #374151;
}

.tips-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: white;
  border-radius: 0 0 12px 12px;
  padding: 20px;
}

.tip-card {
  display: flex;
  gap: 16px;
  padding: 20px;
  background: #f9fafb;
  border-radius: 8px;
  align-items: flex-start;
}

.tip-icon {
  font-size: 40px;
  flex-shrink: 0;
}

.tip-content {
  flex: 1;
}

.tip-content h4 {
  margin: 0 0 8px 0;
  font-size: 16px;
  color: #374151;
}

.tip-content p {
  margin: 0 0 12px 0;
  color: #6b7280;
  line-height: 1.6;
  font-size: 14px;
}

.tip-formulas {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}

.tip-formulas span {
  font-size: 13px;
  color: #6b7280;
}

.btn-learn {
  padding: 8px 16px;
  background: #48bb78;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-learn:hover {
  background: #38a169;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* 操作按钮 */
.actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.actions button {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.actions button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn-primary {
  background: #48bb78;
  color: white;
}

.btn-primary:hover {
  background: #38a169;
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  backdrop-filter: blur(10px);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.3);
}

@media (max-width: 768px) {
  .profile-content {
    flex-direction: column;
  }

  .path-header {
    flex-direction: column;
  }

  .path-info {
    flex-direction: column;
    text-align: center;
  }

  .tip-card {
    flex-direction: column;
  }
}
</style>
