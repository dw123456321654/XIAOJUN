/**
 * ClawDesk 任务进度协议
 * 
 * 定义 AI 输出任务进度的格式规范
 */

// 任务相关关键词正则
export const TASK_PATTERNS = {
  // 任务开始: [TASK_START] ... [TASK_END]
  TASK_START: /\[TASK_START\]([\s\S]*?)\[TASK_END\]/,
  
  // 步骤列表: 1. xxx  2. xxx
  STEP_LIST: /^\d+\.\s+.+$/gm,
  
  // 步骤完成: [STEP_DONE: 1]
  STEP_DONE: /\[STEP_DONE:\s*(\d+)\]/,
  
  // 任务完成: [TASK_COMPLETE]
  TASK_COMPLETE: /\[TASK_COMPLETE\]/,
  
  // 任务失败: [TASK_FAILED: 原因]
  TASK_FAILED: /\[TASK_FAILED:\s*(.+?)\]/,
  
  // 任务名称
  TASK_NAME: /名称:\s*(.+)/,
  
  // 步骤数量
  STEP_COUNT: /步骤:\s*(\d+)/,
}

/**
 * 任务协议系统提示
 * 
 * 在用户发送开发相关消息时自动追加
 */
export const TASK_PROTOCOL_PROMPT = `
[ClawDesk任务进度协议]
执行开发任务时，请按以下格式输出进度：

开始任务时：
[TASK_START]
名称: 任务名称
步骤: 数量
1. 步骤1描述
2. 步骤2描述
...
[TASK_END]

每完成一个步骤时：
[STEP_DONE: 步骤号] 简要描述完成内容

任务全部完成时：
[TASK_COMPLETE]

任务失败时：
[TASK_FAILED: 失败原因]
[END]
`

/**
 * 判断消息是否需要追加任务协议提示
 */
export function shouldAppendTaskProtocol(message: string): boolean {
  const keywords = [
    '开发', '实现', '写', '创建', '添加', '修改', '重构',
    '修复', '优化', '设计', '分析', '生成', '帮我',
    '做一个', '弄一个', '搞一个'
  ]
  
  return keywords.some(kw => message.includes(kw))
}

/**
 * 解析任务开始消息
 */
export function parseTaskStart(content: string): {
  name: string
  stepCount: number
  steps: string[]
} | null {
  const match = content.match(TASK_PATTERNS.TASK_START)
  if (!match) return null
  
  const block = match[1]
  
  // 解析任务名称
  const nameMatch = block.match(TASK_PATTERNS.TASK_NAME)
  const name = nameMatch ? nameMatch[1].trim() : '未命名任务'
  
  // 解析步骤数量
  const countMatch = block.match(TASK_PATTERNS.STEP_COUNT)
  const stepCount = countMatch ? parseInt(countMatch[1], 10) : 0
  
  // 解析步骤列表
  const steps = block.match(TASK_PATTERNS.STEP_LIST) || []
  const stepNames = steps.map(s => s.replace(/^\d+\.\s*/, '').trim())
  
  // 如果没有显式的步骤数量，用列表长度
  const finalStepCount = stepCount > 0 ? stepCount : stepNames.length
  
  return {
    name,
    stepCount: finalStepCount,
    steps: stepNames
  }
}

/**
 * 解析步骤完成消息
 */
export function parseStepDone(content: string): number | null {
  const match = content.match(TASK_PATTERNS.STEP_DONE)
  if (!match) return null
  return parseInt(match[1], 10)
}

/**
 * 解析任务完成消息
 */
export function parseTaskComplete(content: string): boolean {
  return TASK_PATTERNS.TASK_COMPLETE.test(content)
}

/**
 * 解析任务失败消息
 */
export function parseTaskFailed(content: string): string | null {
  const match = content.match(TASK_PATTERNS.TASK_FAILED)
  return match ? match[1].trim() : null
}
