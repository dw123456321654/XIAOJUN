// 公式类型
export interface Formula {
  id: string
  name: string
  formula: string
  description: string
  tags: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  examples: {
    basic: Example
    advanced: Example
    nested: Example
    real: Example
  }
}

// 示例类型
export interface Example {
  data: TableRow[]
  formula: string
  result: string
}

// 表格行类型
export interface TableRow {
  id: number
  cells: TableCell[]
}

// 表格单元格类型
export interface TableCell {
  id: number
  value: string
}

// 练习题类型
export interface Practice {
  id: string
  task: string
  example: {
    data: TableRow[]
  }
  answer: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}

// 学习路径类型
export interface LearningPath {
  id: string
  name: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  formulaIds: string[]
  estimatedTime: number // 预计学习时间（分钟）
}

// 实战案例类型
export interface RealCase {
  id: string
  title: string
  industry: string
  category: string
  difficulty: '初级' | '中级' | '高级'
  scenario: string
  dataTemplate: {
    headers: string[]
    rows: (string | number)[][]
  }
  steps: {
    step: number
    description: string
    formula: string
    explanation: string
  }[]
  keyFormulas: string[]
  downloadUrl?: string
}

// 公式组合类型
export interface FormulaCombination {
  id: number
  name: string
  description: string
  formulas: string[]
  combinationFormula: string
  advantages: string[]
  scenarios: string[]
  performance: {
    vsSingleFormula: string
    dataSize: string
    loadTime: string
  }
  difficulty: '初级' | '中级' | '高级'
  popularity: number // 1-5
  example: {
    title: string
    data: {
      headers: string[]
      rows: (string | number)[][]
    }
    formula: string
    explanation: string
    result: string | number
  }
  practiceQuestions: PracticeQuestion[]
}

// 组合练习题类型
export interface PracticeQuestion {
  question: string
  data: {
    headers: string[]
    rows: (string | number)[][]
  }
  formula: string
  answer: string | number
  explanation: string
}

// 个人案例表单类型
export interface PersonalCaseForm {
  title: string
  industry: string
  difficulty: '初级' | '中级' | '高级'
  scenario: string
  steps: {
    step: number
    description: string
    formula: string
    explanation: string
  }[]
  keyFormulas: string[]
}
