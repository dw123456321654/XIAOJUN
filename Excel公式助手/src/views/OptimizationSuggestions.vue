<template>
  <div class="optimization-suggestions">
    <!-- 页面标题 -->
    <div class="page-header">
      <n-card title="优化建议" :bordered="false">
        <p class="subtitle">基于您的Excel文件，提供公式优化建议，提升性能和可读性</p>
      </n-card>
    </div>

    <!-- 优化概览 -->
    <div class="overview-section">
      <n-grid :x-gap="16" :y-gap="16" :cols="4" responsive="screen">
        <n-gi v-for="stat in overviewStats" :key="stat.key">
          <n-statistic :label="stat.label" :value="stat.value">
            <template #prefix>
              <n-icon :component="stat.icon" :color="stat.color" />
            </template>
          </n-statistic>
        </n-gi>
      </n-grid>
    </div>

    <!-- 优化分类标签 -->
    <div class="category-tabs">
      <n-tabs v-model:value="activeCategory" type="line" animated>
        <n-tab-pane
          v-for="category in categories"
          :key="category.key"
          :name="category.key"
          :tab="category.label"
        >
          <n-badge :value="category.count" :max="99" />
        </n-tab-pane>
      </n-tabs>
    </div>

    <!-- 优化建议列表 -->
    <div class="suggestions-list">
      <n-space vertical size="large">
        <n-card
          v-for="(suggestion, index) in filteredSuggestions"
          :key="index"
          :bordered="true"
          :title="suggestion.title"
          class="suggestion-card"
        >
          <template #header-extra>
            <n-tag :type="getSeverityType(suggestion.severity)" size="small">
              {{ suggestion.severity }}
            </n-tag>
          </template>

          <div class="suggestion-content">
            <!-- 问题描述 -->
            <div class="section">
              <h4><n-icon :component="AlertCircleOutline" /> 问题描述</h4>
              <p>{{ suggestion.description }}</p>
            </div>

            <!-- 当前公式 -->
            <div class="section">
              <h4><n-icon :component="CodeSlashOutline" /> 当前公式</h4>
              <n-code :code="suggestion.currentFormula" language="excel" />
            </div>

            <!-- 优化建议 -->
            <div class="section">
              <h4><n-icon :component="FlashOutline" /> 优化方案</h4>
              <p>{{ suggestion.optimization }}</p>
            </div>

            <!-- 优化后公式 -->
            <div class="section">
              <h4><n-icon :component="CheckmarkCircleOutline" /> 优化后公式</h4>
              <n-code :code="suggestion.optimizedFormula" language="excel" />
            </div>

            <!-- 性能对比 -->
            <div class="section performance-section">
              <h4><n-icon :component="SpeedometerOutline" /> 性能对比</h4>
              <n-grid :x-gap="16" :cols="2">
                <n-gi>
                  <n-card size="small" title="优化前">
                    <n-statistic :value="suggestion.performance.before" suffix="ms">
                      <template #label>计算时间</template>
                    </n-statistic>
                  </n-card>
                </n-gi>
                <n-gi>
                  <n-card size="small" title="优化后">
                    <n-statistic :value="suggestion.performance.after" suffix="ms">
                      <template #label>计算时间</template>
                    </n-statistic>
                  </n-card>
                </n-gi>
              </n-grid>
              <div class="improvement-badge">
                <n-tag type="success" size="large">
                  提升 {{ suggestion.performance.improvement }}%
                </n-tag>
              </div>
            </div>

            <!-- 适用场景 -->
            <div class="section">
              <h4><n-icon :component="AppsOutline" /> 适用场景</h4>
              <n-space>
                <n-tag v-for="scenario in suggestion.scenarios" :key="scenario" type="info" round>
                  {{ scenario }}
                </n-tag>
              </n-space>
            </div>

            <!-- 操作按钮 -->
            <div class="action-buttons">
              <n-space>
                <n-button type="primary" @click="applyOptimization(index)">
                  <template #icon>
                    <n-icon :component="CheckmarkCircleOutline" />
                  </template>
                  应用优化
                </n-button>
                <n-button @click="copyFormula(suggestion.optimizedFormula)">
                  <template #icon>
                    <n-icon :component="CopyOutline" />
                  </template>
                  复制公式
                </n-button>
                <n-button @click="ignoreSuggestion(index)">
                  <template #icon>
                    <n-icon :component="CloseCircleOutline" />
                  </template>
                  忽略
                </n-button>
              </n-space>
            </div>
          </div>
        </n-card>
      </n-space>
    </div>

    <!-- 空状态 -->
    <n-empty v-if="filteredSuggestions.length === 0" description="暂无优化建议" />

    <!-- 底部操作 -->
    <div class="footer-actions">
      <n-space>
        <n-button @click="applyAllOptimizations" :disabled="filteredSuggestions.length === 0">
          <template #icon>
            <n-icon :component="FlashOutline" />
          </template>
          应用所有优化
        </n-button>
        <n-button @click="exportReport">
          <template #icon>
            <n-icon :component="DownloadOutline" />
          </template>
          导出报告
        </n-button>
        <n-button @click="goBack">
          <template #icon>
            <n-icon :component="ArrowBackOutline" />
          </template>
          返回分析
        </n-button>
      </n-space>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMessage, useDialog } from 'naive-ui'
import {
  AlertCircleOutline,
  CodeSlashOutline,
  FlashOutline,
  CheckmarkCircleOutline,
  SpeedometerOutline,
  AppsOutline,
  CopyOutline,
  CloseCircleOutline,
  DownloadOutline,
  ArrowBackOutline,
  BulbOutline,
  PulseOutline,
  WarningOutline,
  StatsChartOutline
} from '@vicons/ionicons5'

const router = useRouter()
const message = useMessage()
const dialog = useDialog()

// 当前选中的分类
const activeCategory = ref<'all' | 'performance' | 'readability' | 'error' | 'best-practice'>('all')

// 优化概览统计
const overviewStats = ref([
  { key: 'total', label: '优化建议总数', value: 0, icon: BulbOutline, color: '#18a058' },
  { key: 'performance', label: '性能优化', value: 0, icon: PulseOutline, color: '#2080f0' },
  { key: 'readability', label: '可读性优化', value: 0, icon: StatsChartOutline, color: '#f0a020' },
  { key: 'error', label: '错误修复', value: 0, icon: WarningOutline, color: '#d03050' }
])

// 优化分类
const categories = ref([
  { key: 'all', label: '全部', count: 0 },
  { key: 'performance', label: '性能优化', count: 0 },
  { key: 'readability', label: '可读性优化', count: 0 },
  { key: 'error', label: '错误修复', count: 0 },
  { key: 'best-practice', label: '最佳实践', count: 0 }
])

// 优化建议列表
const suggestions = ref<OptimizationSuggestion[]>([])

// 筛选后的建议
const filteredSuggestions = computed(() => {
  if (activeCategory.value === 'all') {
    return suggestions.value
  }
  return suggestions.value.filter(s => s.category === activeCategory.value)
})

// 类型定义
interface OptimizationSuggestion {
  id: string
  title: string
  description: string
  currentFormula: string
  optimization: string
  optimizedFormula: string
  performance: {
    before: number
    after: number
    improvement: number
  }
  scenarios: string[]
  severity: 'high' | 'medium' | 'low'
  category: 'performance' | 'readability' | 'error' | 'best-practice'
}

// 根据严重程度获取标签类型
const getSeverityType = (severity: string) => {
  const map: Record<string, any> = {
    high: 'error',
    medium: 'warning',
    low: 'info'
  }
  return map[severity] || 'default'
}

// 应用优化
const applyOptimization = (index: number) => {
  const suggestion = filteredSuggestions.value[index]
  dialog.success({
    title: '应用优化',
    content: `确定要应用"${suggestion.title}"优化吗？`,
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: () => {
      message.success(`已应用优化：${suggestion.title}`)
      // TODO: 实际应用优化到Excel文件
    }
  })
}

// 复制公式
const copyFormula = (formula: string) => {
  navigator.clipboard.writeText(formula).then(() => {
    message.success('公式已复制到剪贴板')
  }).catch(() => {
    message.error('复制失败')
  })
}

// 忽略建议
const ignoreSuggestion = (index: number) => {
  const suggestion = filteredSuggestions.value[index]
  dialog.warning({
    title: '忽略建议',
    content: `确定要忽略"${suggestion.title}"建议吗？`,
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: () => {
      // TODO: 实际忽略建议
      message.success(`已忽略建议：${suggestion.title}`)
    }
  })
}

// 应用所有优化
const applyAllOptimizations = () => {
  dialog.success({
    title: '应用所有优化',
    content: `确定要应用全部 ${filteredSuggestions.value.length} 个优化建议吗？`,
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: () => {
      message.success(`已应用 ${filteredSuggestions.value.length} 个优化`)
      // TODO: 实际应用所有优化到Excel文件
    }
  })
}

// 导出报告
const exportReport = () => {
  // TODO: 实现导出优化报告
  message.info('导出报告功能开发中')
}

// 返回分析页面
const goBack = () => {
  router.push('/formula-analysis')
}

// 模拟数据生成
const generateSuggestions = () => {
  const mockSuggestions: OptimizationSuggestion[] = [
    {
      id: '1',
      title: '使用VLOOKUP替代INDEX+MATCH组合',
      description: '当前公式使用INDEX+MATCH组合进行查找，虽然功能强大但复杂度较高。对于简单查找，VLOOKUP更简洁直观。',
      currentFormula: '=INDEX(B2:B100,MATCH(A2,A2:A100,0))',
      optimization: '将INDEX+MATCH组合替换为VLOOKUP，提升可读性',
      optimizedFormula: '=VLOOKUP(A2,A2:B100,2,FALSE)',
      performance: {
        before: 2.5,
        after: 1.8,
        improvement: 28
      },
      scenarios: ['简单查找', '单一返回值', '数据量小于10万行'],
      severity: 'low',
      category: 'readability'
    },
    {
      id: '2',
      title: '优化SUMIF为SUMIFS',
      description: '当前使用多个SUMIF函数求和，可以使用SUMIFS一次完成，减少计算次数。',
      currentFormula: '=SUMIF(A2:A100,"销售",B2:B100)+SUMIF(A2:A100,"采购",B2:B100)',
      optimization: '使用SUMIFS一次完成多条件求和，提升性能',
      optimizedFormula: '=SUMIFS(B2:B100,A2:A100,{"销售","采购"})',
      performance: {
        before: 5.2,
        after: 2.1,
        improvement: 60
      },
      scenarios: ['多条件求和', '数据量较大', '需要批量计算'],
      severity: 'medium',
      category: 'performance'
    },
    {
      id: '3',
      title: '修复IF函数嵌套错误',
      description: '当前公式中IF函数嵌套逻辑错误，导致部分条件判断失效。',
      currentFormula: '=IF(A2>10,"优秀",IF(A2>5,"良好",IF(A2>10,"优秀","一般")))',
      optimization: '修复IF函数嵌套顺序和逻辑错误',
      optimizedFormula: '=IF(A2>10,"优秀",IF(A2>5,"良好","一般"))',
      performance: {
        before: 1.5,
        after: 1.2,
        improvement: 20
      },
      scenarios: ['条件判断', '多层嵌套', '逻辑修复'],
      severity: 'high',
      category: 'error'
    },
    {
      id: '4',
      title: '使用TABLE函数代替数组公式',
      description: '当前使用复杂的数组公式，可以改用TABLE函数提升性能和可维护性。',
      currentFormula: '{=SUM(IF(A2:A100>0,B2:B100,0))}',
      optimization: '使用TABLE函数替代数组公式，提升性能',
      optimizedFormula: '=SUMIF(A2:A100,">0",B2:B100)',
      performance: {
        before: 8.7,
        after: 2.3,
        improvement: 74
      },
      scenarios: ['条件求和', '数组公式', '大数据量'],
      severity: 'medium',
      category: 'performance'
    },
    {
      id: '5',
      title: '添加IFERROR错误处理',
      description: 'VLOOKUP查找可能失败，建议添加IFERROR错误处理，避免显示#N/A错误。',
      currentFormula: '=VLOOKUP(A2,D2:E100,2,FALSE)',
      optimization: '添加IFERROR错误处理，提升用户体验',
      optimizedFormula: '=IFERROR(VLOOKUP(A2,D2:E100,2,FALSE),"未找到")',
      performance: {
        before: 1.2,
        after: 1.3,
        improvement: -8
      },
      scenarios: ['VLOOKUP查找', '错误处理', '用户界面'],
      severity: 'low',
      category: 'best-practice'
    },
    {
      id: '6',
      title: '使用命名范围提升可读性',
      description: '当前公式使用硬编码的单元格引用，建议使用命名范围提升可读性和可维护性。',
      currentFormula: '=SUMIF(Sheet1!A2:A100,"销售",Sheet1!B2:B100)',
      optimization: '使用命名范围替代单元格引用',
      optimizedFormula: '=SUMIF(Category,"销售",Amount)',
      performance: {
        before: 2.1,
        after: 2.0,
        improvement: 5
      },
      scenarios: ['复杂公式', '跨表引用', '团队协作'],
      severity: 'low',
      category: 'readability'
    },
    {
      id: '7',
      title: '优化OFFSET函数使用',
      description: 'OFFSET函数是易失性函数，每次计算都会重新执行，建议用INDEX替代。',
      currentFormula: '=SUM(OFFSET(A1,0,0,COUNT(A:A),1))',
      optimization: '用INDEX替代OFFSET，减少计算次数',
      optimizedFormula: '=SUM(A1:INDEX(A:A,COUNT(A:A)))',
      performance: {
        before: 15.3,
        after: 3.2,
        improvement: 79
      },
      scenarios: ['动态范围', '大数据量', '频繁计算'],
      severity: 'high',
      category: 'performance'
    },
    {
      id: '8',
      title: '合并重复计算',
      description: '当前公式中存在重复计算，可以提取为单独单元格或使用辅助列。',
      currentFormula: '=A2*1.2+A2*0.1+A2*0.05',
      optimization: '合并重复计算，提升效率',
      optimizedFormula: '=A2*(1.2+0.1+0.05)',
      performance: {
        before: 0.8,
        after: 0.3,
        improvement: 63
      },
      scenarios: ['重复计算', '简单运算', '公式优化'],
      severity: 'low',
      category: 'performance'
    }
  ]

  return mockSuggestions
}

// 更新统计信息
const updateStats = () => {
  const total = suggestions.value.length
  const performance = suggestions.value.filter(s => s.category === 'performance').length
  const readability = suggestions.value.filter(s => s.category === 'readability').length
  const error = suggestions.value.filter(s => s.category === 'error').length
  const bestPractice = suggestions.value.filter(s => s.category === 'best-practice').length

  overviewStats.value[0].value = total
  overviewStats.value[1].value = performance
  overviewStats.value[2].value = readability
  overviewStats.value[3].value = error

  categories.value[0].count = total
  categories.value[1].count = performance
  categories.value[2].count = readability
  categories.value[3].count = error
  categories.value[4].count = bestPractice
}

// 页面加载时初始化
onMounted(() => {
  suggestions.value = generateSuggestions()
  updateStats()
})
</script>

<style scoped>
.optimization-suggestions {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 24px;
}

.page-header .subtitle {
  color: #666;
  margin: 8px 0 0 0;
  font-size: 14px;
}

.overview-section {
  margin-bottom: 24px;
}

.category-tabs {
  margin-bottom: 24px;
}

.suggestions-list {
  margin-bottom: 24px;
}

.suggestion-card {
  transition: all 0.3s ease;
}

.suggestion-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.suggestion-content .section {
  margin-bottom: 20px;
}

.suggestion-content .section h4 {
  margin: 0 0 12px 0;
  color: #333;
  font-size: 15px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.suggestion-content .section p {
  color: #666;
  margin: 0;
  line-height: 1.6;
}

.performance-section {
  position: relative;
}

.performance-section .improvement-badge {
  text-align: center;
  margin-top: 12px;
}

.action-buttons {
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.footer-actions {
  margin-top: 32px;
  padding: 20px 0;
  border-top: 2px solid #eee;
  display: flex;
  justify-content: flex-start;
}
</style>
