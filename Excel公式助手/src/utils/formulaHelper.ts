import type { Formula } from '../types'

/**
 * 格式化公式（添加语法高亮）
 */
export function formatFormula(formula: string): string {
  // 移除等号前后的空格
  return formula.replace(/\s*=\s*/, '=')
}

/**
 * 验证公式格式
 */
export function validateFormula(formula: string): boolean {
  if (!formula.startsWith('=')) {
    return false
  }

  // 检查括号是否匹配
  const stack: string[] = []
  for (const char of formula) {
    if (char === '(') {
      stack.push(char)
    } else if (char === ')') {
      if (stack.length === 0) return false
      stack.pop()
    }
  }

  return stack.length === 0
}

/**
 * 提取公式参数
 */
export function extractFormulaParams(formula: string): string[] {
  // 提取括号内的参数
  const match = formula.match(/\(([^)]+)\)/)
  if (!match) return []

  return match[1]
    .split(',')
    .map((p) => p.trim())
    .filter((p) => p.length > 0)
}

/**
 * 搜索公式
 */
export function searchFormulas(
  formulas: Formula[],
  query: string
): Formula[] {
  const lowerQuery = query.toLowerCase()

  return formulas.filter(
    (f) =>
      f.name.toLowerCase().includes(lowerQuery) ||
      f.formula.toLowerCase().includes(lowerQuery) ||
      f.description.toLowerCase().includes(lowerQuery)
  )
}

/**
 * 按标签筛选公式
 */
export function filterFormulasByTags(
  formulas: Formula[],
  tags: string[]
): Formula[] {
  if (tags.length === 0) return formulas

  return formulas.filter((f) => f.tags.some((tag) => tags.includes(tag)))
}

/**
 * 验证练习答案
 */
export function validatePracticeAnswer(
  userAnswer: string,
  correctAnswer: string
): boolean {
  // 移除空格和等号，转为小写比较
  const normalize = (str: string) =>
    str
      .replace(/\s/g, '')
      .replace(/=/g, '')
      .toLowerCase()

  return normalize(userAnswer) === normalize(correctAnswer)
}
