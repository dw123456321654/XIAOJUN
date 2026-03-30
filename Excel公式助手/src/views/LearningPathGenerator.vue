<template>
  <div class="learning-path-generator">
    <!-- 页面标题 -->
    <div class="page-header">
      <n-card title="学习路径生成" :bordered="false">
        <p class="subtitle">基于您的Excel文件分析，为您生成个性化学习路径</p>
      </n-card>
    </div>

    <!-- 用户画像卡片 -->
    <div class="user-profile-card">
      <n-card title="您的学习画像" :bordered="true">
        <n-grid :x-gap="16" :y-gap="16" :cols="4" responsive="screen">
          <n-gi v-for="stat in userProfile" :key="stat.key">
            <n-statistic :label="stat.label" :value="stat.value">
              <template #suffix>{{ stat.suffix }}</template>
            </n-statistic>
          </n-gi>
        </n-grid>
      </n-card>
    </div>

    <!-- 学习路径选项 -->
    <div class="path-options">
      <n-card title="选择学习路径类型" :bordered="true">
        <n-space vertical size="large">
          <n-radio-group v-model:value="selectedPathType" name="pathType">
            <n-space vertical>
              <n-radio v-for="pathType in pathTypes" :key="pathType.key" :value="pathType.key">
                <div class="radio-content">
                  <div class="radio-title">
                    <n-icon :component="pathType.icon" :size="20" />
                    <span>{{ pathType.label }}</span>
                  </div>
                  <div class="radio-description">{{ pathType.description }}</div>
                  <n-tag :type="pathType.difficulty === '初级' ? 'success' : pathType.difficulty === '中级' ? 'warning' : 'error'" size="small">
                    {{ pathType.difficulty }}
                  </n-tag>
                </div>
              </n-radio>
            </n-space>
          </n-radio-group>

          <n-divider />

          <div class="learning-goals">
            <h4><n-icon :component="FlagOutline" /> 学习目标</h4>
            <n-checkbox-group v-model:value="selectedGoals">
              <n-space item-style="display: flex;">
                <n-checkbox
                  v-for="goal in learningGoals"
                  :key="goal.key"
                  :value="goal.key"
                  :label="goal.label"
                />
              </n-space>
            </n-checkbox-group>
          </div>

          <div class="time-commitment">
            <h4><n-icon :component="TimeOutline" /> 学习时间</h4>
            <n-slider
              v-model:value="timeCommitment"
              :min="1"
              :max="12"
              :step="1"
              :marks="{ 1: '1周', 4: '1个月', 12: '12周' }"
            />
            <div class="time-label">预计学习时间：{{ timeCommitment }} 周</div>
          </div>
        </n-space>
      </n-card>
    </div>

    <!-- 生成按钮 -->
    <div class="generate-section">
      <n-button type="primary" size="large" @click="generatePath" :loading="generating" :disabled="!canGenerate">
        <template #icon>
          <n-icon :component="FlashOutline" />
        </template>
        生成学习路径
      </n-button>
    </div>

    <!-- 生成的学习路径 -->
    <div v-if="generatedPath" class="generated-path">
      <n-card title="为您生成的学习路径" :bordered="true">
        <div class="path-summary">
          <n-grid :x-gap="16" :y-gap="16" :cols="3">
            <n-gi>
              <n-statistic label="总课程数" :value="generatedPath.totalCourses">
                <template #prefix>
                  <n-icon :component="BookOutline" />
                </template>
              </n-statistic>
            </n-gi>
            <n-gi>
              <n-statistic label="总练习题数" :value="generatedPath.totalExercises">
                <template #prefix>
                  <n-icon :component="CreateOutline" />
                </template>
              </n-statistic>
            </n-gi>
            <n-gi>
              <n-statistic label="预计完成时间" :value="generatedPath.estimatedWeeks" suffix="周">
                <template #prefix>
                  <n-icon :component="TimeOutline" />
                </template>
              </n-statistic>
            </n-gi>
          </n-grid>
        </div>

        <n-divider />

        <div class="path-content">
          <n-timeline>
            <n-timeline-item
              v-for="(week, index) in generatedPath.weeks"
              :key="index"
              :title="`第 ${index + 1} 周`"
              :type="index === 0 ? 'success' : 'default'"
            >
              <div class="week-content">
                <div class="week-overview">
                  <n-tag size="small">{{ week.difficulty }}</n-tag>
                  <span class="week-topics">{{ week.topics.join('、') }}</span>
                </div>
                <div class="week-courses">
                  <n-card
                    v-for="course in week.courses"
                    :key="course.id"
                    size="small"
                    :bordered="true"
                    class="course-card"
                  >
                    <div class="course-header">
                      <n-icon :component="course.icon" />
                      <span class="course-title">{{ course.title }}</span>
                      <n-tag :type="course.difficulty === '初级' ? 'success' : course.difficulty === '中级' ? 'warning' : 'error'" size="tiny">
                        {{ course.difficulty }}
                      </n-tag>
                    </div>
                    <p class="course-description">{{ course.description }}</p>
                    <div class="course-stats">
                      <n-space size="small">
                        <n-tag type="info" size="tiny">
                          <template #icon>
                            <n-icon :component="TimeOutline" :size="12" />
                          </template>
                          {{ course.duration }} 小时
                        </n-tag>
                        <n-tag type="info" size="tiny">
                          <template #icon>
                            <n-icon :component="CreateOutline" :size="12" />
                          </template>
                          {{ course.exercises }} 道题
                        </n-tag>
                      </n-space>
                    </div>
                    <div class="course-prerequisites" v-if="course.prerequisites && course.prerequisites.length > 0">
                      <n-tag
                        v-for="prereq in course.prerequisites"
                        :key="prereq"
                        type="default"
                        size="tiny"
                        bordered
                      >
                        需掌握：{{ prereq }}
                      </n-tag>
                    </div>
                  </n-card>
                </div>
              </div>
            </n-timeline-item>
          </n-timeline>
        </div>

        <n-divider />

        <div class="path-actions">
          <n-space>
            <n-button type="primary" @click="startLearning">
              <template #icon>
                <n-icon :component="PlayCircleOutline" />
              </template>
              开始学习
            </n-button>
            <n-button @click="exportPath">
              <template #icon>
                <n-icon :component="DownloadOutline" />
              </template>
              导出路径
            </n-button>
            <n-button @click="savePath">
              <template #icon>
                <n-icon :component="BookmarkOutline" />
              </template>
              保存路径
            </n-button>
            <n-button @click="regeneratePath">
              <template #icon>
                <n-icon :component="RefreshOutline" />
              </template>
              重新生成
            </n-button>
            <n-button @click="goBack">
              <template #icon>
                <n-icon :component="ArrowBackOutline" />
              </template>
              返回分析
            </n-button>
          </n-space>
        </div>
      </n-card>
    </div>

    <!-- 空状态 -->
    <n-empty v-else-if="!generating" description="请选择学习路径类型并点击生成" />

    <!-- 生成中状态 -->
    <n-spin v-if="generating" size="large" description="正在生成个性化学习路径...">
      <template #icon>
        <n-icon :component="ReloadOutline" :size="40" />
      </template>
    </n-spin>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMessage, useDialog } from 'naive-ui'
import {
  FlagOutline,
  TimeOutline,
  BookOutline,
  CreateOutline,
  FlashOutline,
  PlayCircleOutline,
  DownloadOutline,
  BookmarkOutline,
  RefreshOutline,
  ArrowBackOutline,
  ReloadOutline,
  RibbonOutline,
  RocketOutline,
  SchoolOutline,
  MedalOutline,
  PulseOutline
} from '@vicons/ionicons5'

const router = useRouter()
const message = useMessage()
const dialog = useDialog()

// 用户画像
const userProfile = ref([
  { key: 'formulaCount', label: '使用的公式数量', value: 12, suffix: '个' },
  { key: 'complexFormulas', label: '复杂公式', value: 3, suffix: '个' },
  { key: 'dataSize', label: '数据量', value: 1500, suffix: '行' },
  { key: 'experience', label: 'Excel经验', value: '中级', suffix: '' }
])

// 学习路径类型
const selectedPathType = ref('intermediate')
const pathTypes = ref([
  {
    key: 'beginner',
    label: '入门路径',
    description: '适合Excel新手，从基础公式开始，逐步掌握常用功能',
    difficulty: '初级',
    icon: SchoolOutline
  },
  {
    key: 'intermediate',
    label: '进阶路径',
    description: '适合有一定基础，希望深入学习高级公式和函数组合',
    difficulty: '中级',
    icon: RocketOutline
  },
  {
    key: 'advanced',
    label: '专家路径',
    description: '适合熟练用户，掌握高级技巧和性能优化方法',
    difficulty: '高级',
    icon: MedalOutline
  },
  {
    key: 'custom',
    label: '针对性提升',
    description: '根据您的文件分析，重点提升薄弱环节',
    difficulty: '自定义',
    icon: PulseOutline
  }
])

// 学习目标
const selectedGoals = ref<string[]>(['效率提升', '公式优化'])
const learningGoals = ref([
  { key: 'efficiency', label: '效率提升' },
  { key: 'optimization', label: '公式优化' },
  { key: 'advanced', label: '高级技巧' },
  { key: 'automation', label: '自动化' },
  { key: 'analysis', label: '数据分析' }
])

// 学习时间
const timeCommitment = ref(4)

// 生成状态
const generating = ref(false)
const generatedPath = ref<LearningPath | null>(null)

// 是否可以生成
const canGenerate = computed(() => {
  return selectedGoals.value.length > 0 && timeCommitment.value >= 1
})

// 类型定义
interface LearningPath {
  totalCourses: number
  totalExercises: number
  estimatedWeeks: number
  weeks: {
    difficulty: string
    topics: string[]
    courses: {
      id: string
      title: string
      description: string
      icon: any
      difficulty: string
      duration: number
      exercises: number
      prerequisites?: string[]
    }[]
  }[]
}

// 生成学习路径
const generatePath = () => {
  generating.value = true

  setTimeout(() => {
    const path = generateMockPath()
    generatedPath.value = path
    generating.value = false
    message.success('学习路径生成成功！')
  }, 1500)
}

// 生成模拟路径
const generateMockPath = (): LearningPath => {
  const weeksCount = timeCommitment.value
  const path: LearningPath = {
    totalCourses: 0,
    totalExercises: 0,
    estimatedWeeks: weeksCount,
    weeks: []
  }

  // 根据不同类型生成不同内容
  const pathType = selectedPathType.value

  if (pathType === 'beginner') {
    path.weeks = [
      {
        difficulty: '初级',
        topics: ['基础公式', '数据录入', '格式设置'],
        courses: [
          {
            id: 'b1',
            title: 'Excel基础入门',
            description: '了解Excel界面、数据录入和基本操作',
            icon: BookOutline,
            difficulty: '初级',
            duration: 2,
            exercises: 15,
            prerequisites: []
          },
          {
            id: 'b2',
            title: '常用数学公式',
            description: '学习SUM、AVERAGE、COUNT等基础公式',
            icon: CreateOutline,
            difficulty: '初级',
            duration: 3,
            exercises: 20,
            prerequisites: ['Excel基础入门']
          },
          {
            id: 'b3',
            title: '文本处理公式',
            description: '掌握LEFT、RIGHT、MID、CONCATENATE等文本公式',
            icon: BookOutline,
            difficulty: '初级',
            duration: 2,
            exercises: 18,
            prerequisites: ['Excel基础入门']
          }
        ]
      },
      {
        difficulty: '初级',
        topics: ['逻辑判断', '条件格式', '数据筛选'],
        courses: [
          {
            id: 'b4',
            title: 'IF函数入门',
            description: '学习IF函数的基本用法和嵌套',
            icon: FlagOutline,
            difficulty: '初级',
            duration: 3,
            exercises: 22,
            prerequisites: ['常用数学公式']
          },
          {
            id: 'b5',
            title: '查找公式基础',
            description: '学习VLOOKUP函数的基本用法',
            icon: SchoolOutline,
            difficulty: '初级',
            duration: 4,
            exercises: 25,
            prerequisites: ['常用数学公式']
          }
        ]
      },
      {
        difficulty: '中级',
        topics: ['高级查找', '数据透视表', '图表制作'],
        courses: [
          {
            id: 'b6',
            title: 'INDEX+MATCH组合',
            description: '掌握INDEX+MATCH的灵活查找',
            icon: RocketOutline,
            difficulty: '中级',
            duration: 4,
            exercises: 20,
            prerequisites: ['查找公式基础']
          },
          {
            id: 'b7',
            title: '数据透视表入门',
            description: '学习数据透视表的基本操作',
            icon: MedalOutline,
            difficulty: '中级',
            duration: 3,
            exercises: 15,
            prerequisites: []
          }
        ]
      },
      {
        difficulty: '中级',
        topics: ['公式优化', '错误处理', '实战案例'],
        courses: [
          {
            id: 'b8',
            title: '公式错误处理',
            description: '学习IFERROR、ISERROR等错误处理函数',
            icon: PulseOutline,
            difficulty: '中级',
            duration: 2,
            exercises: 18,
            prerequisites: ['IF函数入门']
          },
          {
            id: 'b9',
            title: '实战案例综合练习',
            description: '通过实际案例巩固所学知识',
            icon: RibbonOutline,
            difficulty: '中级',
            duration: 5,
            exercises: 30,
            prerequisites: ['INDEX+MATCH组合', '公式错误处理']
          }
        ]
      }
    ]
  } else if (pathType === 'intermediate') {
    path.weeks = [
      {
        difficulty: '中级',
        topics: ['高级查找', '数组公式', '条件统计'],
        courses: [
          {
            id: 'i1',
            title: 'INDEX+MATCH高级应用',
            description: '掌握INDEX+MATCH的多条件查找和灵活运用',
            icon: RocketOutline,
            difficulty: '中级',
            duration: 4,
            exercises: 25,
            prerequisites: ['VLOOKUP基础']
          },
          {
            id: 'i2',
            title: 'SUMIFS多条件求和',
            description: '学习SUMIFS函数的多条件统计',
            icon: CreateOutline,
            difficulty: '中级',
            duration: 3,
            exercises: 20,
            prerequisites: ['SUMIF基础']
          },
          {
            id: 'i3',
            title: '数组公式基础',
            description: '了解数组公式的概念和基本用法',
            icon: BookOutline,
            difficulty: '中级',
            duration: 4,
            exercises: 22,
            prerequisites: ['常用数学公式']
          }
        ]
      },
      {
        difficulty: '中级',
        topics: ['文本处理高级', '日期时间', '数据分析'],
        courses: [
          {
            id: 'i4',
            title: '高级文本处理',
            description: '学习TEXT、SUBSTITUTE、TRIM等高级文本函数',
            icon: SchoolOutline,
            difficulty: '中级',
            duration: 3,
            exercises: 18,
            prerequisites: ['基础文本公式']
          },
          {
            id: 'i5',
            title: '日期时间公式',
            description: '掌握DATEDIF、WORKDAY、NETWORKDAYS等日期函数',
            icon: TimeOutline,
            difficulty: '中级',
            duration: 4,
            exercises: 25,
            prerequisites: ['TODAY基础']
          }
        ]
      },
      {
        difficulty: '高级',
        topics: ['动态范围', '高级条件格式', '数据验证'],
        courses: [
          {
            id: 'i6',
            title: 'OFFSET动态范围',
            description: '学习OFFSET函数创建动态命名范围',
            icon: MedalOutline,
            difficulty: '高级',
            duration: 5,
            exercises: 20,
            prerequisites: ['数组公式基础']
          },
          {
            id: 'i7',
            title: '高级条件格式',
            description: '掌握条件公式和动态条件格式',
            icon: PulseOutline,
            difficulty: '高级',
            duration: 3,
            exercises: 15,
            prerequisites: ['IF函数基础']
          }
        ]
      },
      {
        difficulty: '高级',
        topics: ['公式性能优化', '数组公式高级', '综合实战'],
        courses: [
          {
            id: 'i8',
            title: '公式性能优化',
            description: '学习如何优化复杂公式，提升计算效率',
            icon: RocketOutline,
            difficulty: '高级',
            duration: 4,
            exercises: 18,
            prerequisites: ['OFFSET动态范围']
          },
          {
            id: 'i9',
            title: '高级数组公式',
            description: '掌握多条件数组公式和数组常量',
            icon: BookOutline,
            difficulty: '高级',
            duration: 5,
            exercises: 22,
            prerequisites: ['数组公式基础', '公式性能优化']
          },
          {
            id: 'i10',
            title: '商业数据分析实战',
            description: '通过实际商业案例综合应用所学知识',
            icon: RibbonOutline,
            difficulty: '高级',
            duration: 6,
            exercises: 35,
            prerequisites: ['SUMIFS多条件求和', '日期时间公式', '公式性能优化']
          }
        ]
      }
    ]
  } else if (pathType === 'advanced') {
    path.weeks = [
      {
        difficulty: '高级',
        topics: ['高级函数', '数组公式', 'VBA入门'],
        courses: [
          {
            id: 'a1',
            title: 'SUMPRODUCT高级应用',
            description: '掌握SUMPRODUCT的多条件统计和复杂计算',
            icon: MedalOutline,
            difficulty: '高级',
            duration: 5,
            exercises: 25,
            prerequisites: ['SUMIFS基础', '数组公式基础']
          },
          {
            id: 'a2',
            title: 'INDIRECT动态引用',
            description: '学习INDIRECT函数创建动态表格引用',
            icon: RocketOutline,
            difficulty: '高级',
            duration: 4,
            exercises: 20,
            prerequisites: ['OFFSET动态范围']
          },
          {
            id: 'a3',
            title: 'VBA基础入门',
            description: '了解VBA基本概念，录制和编辑宏',
            icon: SchoolOutline,
            difficulty: '高级',
            duration: 6,
            exercises: 15,
            prerequisites: []
          }
        ]
      },
      {
        difficulty: '高级',
        topics: ['高级数组', '数据模型', 'Power Query'],
        courses: [
          {
            id: 'a4',
            title: '高级数组公式技术',
            description: '掌握FREQUENCY、LARGE、SMALL等高级数组函数',
            icon: BookOutline,
            difficulty: '高级',
            duration: 5,
            exercises: 22,
            prerequisites: ['高级数组公式']
          },
          {
            id: 'a5',
            title: '数据模型基础',
            description: '学习Excel数据模型和关系建立',
            icon: PulseOutline,
            difficulty: '高级',
            duration: 5,
            exercises: 18,
            prerequisites: ['数据透视表入门']
          },
          {
            id: 'a6',
            title: 'Power Query入门',
            description: '学习Power Query数据获取和转换',
            icon: RibbonOutline,
            difficulty: '高级',
            duration: 6,
            exercises: 20,
            prerequisites: ['VBA基础入门']
          }
        ]
      },
      {
        difficulty: '专家',
        topics: ['性能优化', '高级VBA', '自动化'],
        courses: [
          {
            id: 'a7',
            title: '公式性能深度优化',
            description: '深入理解Excel计算引擎，极致优化公式性能',
            icon: RocketOutline,
            difficulty: '专家',
            duration: 6,
            exercises: 18,
            prerequisites: ['公式性能优化', 'SUMPRODUCT高级应用']
          },
          {
            id: 'a8',
            title: '高级VBA编程',
            description: '掌握事件处理、自定义函数、用户窗体',
            icon: SchoolOutline,
            difficulty: '专家',
            duration: 8,
            exercises: 25,
            prerequisites: ['VBA基础入门']
          }
        ]
      },
      {
        difficulty: '专家',
        topics: ['综合项目', '最佳实践', '性能调优'],
        courses: [
          {
            id: 'a9',
            title: '大型Excel项目实战',
            description: '构建完整的Excel业务系统',
            icon: MedalOutline,
            difficulty: '专家',
            duration: 10,
            exercises: 40,
            prerequisites: ['高级VBA编程', '数据模型基础', 'Power Query入门']
          },
          {
            id: 'a10',
            title: 'Excel最佳实践',
            description: '学习企业级Excel开发的标准和规范',
            icon: RibbonOutline,
            difficulty: '专家',
            duration: 4,
            exercises: 15,
            prerequisites: ['大型Excel项目实战']
          }
        ]
      }
    ]
  } else {
    // 自定义路径
    path.weeks = [
      {
        difficulty: '中级',
        topics: ['针对性提升', '弱项强化', '实战练习'],
        courses: [
          {
            id: 'c1',
            title: '公式优化专项训练',
            description: '针对您的复杂公式进行优化训练',
            icon: PulseOutline,
            difficulty: '中级',
            duration: 4,
            exercises: 20,
            prerequisites: ['基础公式']
          },
          {
            id: 'c2',
            title: '性能提升技巧',
            description: '学习提升计算效率的具体方法',
            icon: RocketOutline,
            difficulty: '中级',
            duration: 3,
            exercises: 18,
            prerequisites: ['公式优化专项训练']
          },
          {
            id: 'c3',
            title: '高级查找技巧',
            description: '针对查找类公式的深度训练',
            icon: SchoolOutline,
            difficulty: '中级',
            duration: 4,
            exercises: 25,
            prerequisites: ['VLOOKUP基础']
          }
        ]
      },
      {
        difficulty: '高级',
        topics: ['数组公式', '动态范围', '综合应用'],
        courses: [
          {
            id: 'c4',
            title: '数组公式进阶',
            description: '掌握多条件数组公式',
            icon: BookOutline,
            difficulty: '高级',
            duration: 5,
            exercises: 22,
            prerequisites: ['数组公式基础']
          },
          {
            id: 'c5',
            title: '动态数据范围管理',
            description: '创建灵活的动态数据源',
            icon: MedalOutline,
            difficulty: '高级',
            duration: 4,
            exercises: 20,
            prerequisites: ['数组公式进阶']
          }
        ]
      },
      {
        difficulty: '高级',
        topics: ['实战案例', '综合优化', '项目应用'],
        courses: [
          {
            id: 'c6',
            title: '您的文件优化实战',
            description: '直接对您的Excel文件进行实战优化',
            icon: RibbonOutline,
            difficulty: '高级',
            duration: 6,
            exercises: 30,
            prerequisites: ['动态数据范围管理', '公式优化专项训练']
          },
          {
            id: 'c7',
            title: '效率提升综合训练',
            description: '全面提升Excel使用效率',
            icon: RocketOutline,
            difficulty: '高级',
            duration: 5,
            exercises: 25,
            prerequisites: ['性能提升技巧', '您的文件优化实战']
          }
        ]
      },
      {
        difficulty: '专家',
        topics: ['自动化', '高级技巧', '最佳实践'],
        courses: [
          {
            id: 'c8',
            title: '自动化流程设计',
            description: '设计自动化工作流程',
            icon: SchoolOutline,
            difficulty: '专家',
            duration: 6,
            exercises: 20,
            prerequisites: ['效率提升综合训练']
          },
          {
            id: 'c9',
            title: 'Excel专家级技巧',
            description: '掌握Excel的高级功能和专业技巧',
            icon: MedalOutline,
            difficulty: '专家',
            duration: 5,
            exercises: 18,
            prerequisites: ['自动化流程设计']
          }
        ]
      }
    ]
  }

  // 根据选择的周数调整
  path.weeks = path.weeks.slice(0, weeksCount)

  // 计算总数
  path.totalCourses = path.weeks.reduce((sum, week) => sum + week.courses.length, 0)
  path.totalExercises = path.weeks.reduce((sum, week) =>
    sum + week.courses.reduce((courseSum, course) => courseSum + course.exercises, 0), 0)

  return path
}

// 开始学习
const startLearning = () => {
  message.info('即将开始学习...')
  // TODO: 实际开始学习逻辑
}

// 导出路径
const exportPath = () => {
  message.info('导出学习路径...')
  // TODO: 实际导出逻辑
}

// 保存路径
const savePath = () => {
  message.success('学习路径已保存')
  // TODO: 实际保存逻辑
}

// 重新生成
const regeneratePath = () => {
  dialog.warning({
    title: '重新生成',
    content: '确定要重新生成学习路径吗？当前路径将被替换。',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: () => {
      generatedPath.value = null
      generatePath()
    }
  })
}

// 返回分析页面
const goBack = () => {
  router.push('/formula-analysis')
}

// 页面加载时初始化
onMounted(() => {
  // TODO: 实际加载用户分析数据
})
</script>

<style scoped>
.learning-path-generator {
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

.user-profile-card {
  margin-bottom: 24px;
}

.path-options {
  margin-bottom: 24px;
}

.radio-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 0;
}

.radio-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 16px;
}

.radio-description {
  color: #666;
  font-size: 14px;
  margin-left: 28px;
}

.learning-goals,
.time-commitment {
  margin-top: 16px;
}

.learning-goals h4,
.time-commitment h4 {
  margin: 0 0 12px 0;
  color: #333;
  font-size: 15px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.time-label {
  text-align: center;
  margin-top: 8px;
  color: #666;
  font-size: 14px;
}

.generate-section {
  text-align: center;
  margin-bottom: 32px;
}

.generated-path {
  margin-bottom: 24px;
}

.path-summary {
  margin-bottom: 24px;
}

.path-content {
  margin-top: 24px;
}

.week-content {
  width: 100%;
}

.week-overview {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.week-topics {
  color: #666;
  font-size: 14px;
}

.week-courses {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 16px;
}

.course-card {
  transition: all 0.3s ease;
}

.course-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.course-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.course-title {
  flex: 1;
  font-weight: 600;
  font-size: 15px;
}

.course-description {
  color: #666;
  margin: 8px 0 12px 0;
  font-size: 14px;
  line-height: 1.6;
}

.course-stats {
  margin-bottom: 12px;
}

.course-prerequisites {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.path-actions {
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-start;
}
</style>
