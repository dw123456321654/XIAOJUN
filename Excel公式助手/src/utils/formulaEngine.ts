/**
 * Excel公式计算引擎
 * 支持TOP 50常用公式的计算
 */

/**
 * 公式计算接口
 */
export interface FormulaEngine {
  evaluate(formula: string, data: string[][]): number | string
  isFormula(cell: string): boolean
  extractFormula(cell: string): string
}

/**
 * 简单公式计算引擎实现
 */
export class SimpleFormulaEngine implements FormulaEngine {
  private variableCache: Map<string, number | string> = new Map()
  private functionMap: Map<string, Function> = new Map()

  constructor() {
    this.initializeFunctions()
  }

  /**
   * 初始化支持的公式函数
   */
  private initializeFunctions() {
    // 数学函数
    this.functionMap.set('SUM', this.sum)
    this.functionMap.set('AVERAGE', this.average)
    this.functionMap.set('COUNT', this.count)
    this.functionMap.set('MAX', this.max)
    this.functionMap.set('MIN', this.min)
    this.functionMap.set('ROUND', this.round)
    this.functionMap.set('ROUNDUP', this.roundUp)
    this.functionMap.set('ROUNDDOWN', this.roundDown)
    this.functionMap.set('INT', this.int)
    this.functionMap.set('ABS', this.abs)
    this.functionMap.set('SQRT', this.sqrt)
    this.functionMap.set('POWER', this.power)
    this.functionMap.set('MOD', this.mod)

    // 条件函数
    this.functionMap.set('SUMIF', this.sumif)
    this.functionMap.set('COUNTIF', this.countif)
    this.functionMap.set('AVERAGEIF', this.averageif)

    // 查找函数
    this.functionMap.set('VLOOKUP', this.vlookup)
    this.functionMap.set('HLOOKUP', this.hlookup)
    this.functionMap.set('INDEX', this.index)
    this.functionMap.set('MATCH', this.match)

    // 逻辑函数
    this.functionMap.set('IF', this.if)
    this.functionMap.set('AND', this.and)
    this.functionMap.set('OR', this.or)
    this.functionMap.set('NOT', this.not)
    this.functionMap.set('IFERROR', this.iferror)

    // 文本函数
    this.functionMap.set('LEFT', this.left)
    this.functionMap.set('RIGHT', this.right)
    this.functionMap.set('MID', this.mid)
    this.functionMap.set('LEN', this.len)
    this.functionMap.set('CONCAT', this.concat)
    this.functionMap.set('TEXT', this.text)
    this.functionMap.set('TRIM', this.trim)
    this.functionMap.set('UPPER', this.upper)
    this.functionMap.set('LOWER', this.lower)

    // 日期函数
    this.functionMap.set('TODAY', this.today)
    this.functionMap.set('NOW', this.now)
    this.functionMap.set('YEAR', this.year)
    this.functionMap.set('MONTH', this.month)
    this.functionMap.set('DAY', this.day)

    // 其他函数
    this.functionMap.set('RANK', this.rank)
    this.functionMap.set('LARGE', this.large)
    this.functionMap.set('SMALL', this.small)
  }

  /**
   * 计算公式
   */
  evaluate(formula: string, data: string[][]): number | string {
    try {
      // 移除等号
      const cleanFormula = formula.replace(/^=/, '').trim()

      // 解析公式
      const result = this.parseExpression(cleanFormula, data)

      // 缓存结果
      this.variableCache.set(formula, result)

      return result
    } catch (error) {
      return `#ERROR: ${error instanceof Error ? error.message : String(error)}`
    }
  }

  /**
   * 判断单元格是否是公式
   */
  isFormula(cell: string): boolean {
    return cell.trim().startsWith('=')
  }

  /**
   * 提取公式部分（去除等号）
   */
  extractFormula(cell: string): string {
    return cell.trim().replace(/^=/, '')
  }

  /**
   * 解析表达式
   */
  private parseExpression(expr: string, data: string[][]): number | string {
    // 处理单元格引用（如 A1, B2）
    const cellRefPattern = /^[A-Z]+[0-9]+$/
    const cellRefs = expr.match(/[A-Z]+[0-9]+/g)

    if (cellRefs) {
      let processedExpr = expr
      cellRefs.forEach(ref => {
        const value = this.getCellValue(ref, data)
        processedExpr = processedExpr.replace(new RegExp(ref, 'g'), String(value))
      })
      return this.evaluateSimpleExpression(processedExpr)
    }

    // 处理函数调用
    const funcMatch = expr.match(/^([A-Z]+)\((.*)\)$/)
    if (funcMatch) {
      const [, funcName, argsStr] = funcMatch
      const func = this.functionMap.get(funcName)
      if (!func) {
        throw new Error(`Unknown function: ${funcName}`)
      }

      const args = this.parseArguments(argsStr, data)
      return func.call(this, args, data)
    }

    // 简单表达式
    return this.evaluateSimpleExpression(expr)
  }

  /**
   * 解析函数参数
   */
  private parseArguments(argsStr: string, data: string[][]): any[] {
    const args: any[] = []
    let current = ''
    let depth = 0
    let inString = false

    for (let i = 0; i < argsStr.length; i++) {
      const char = argsStr[i]

      if (char === '"' && (i === 0 || argsStr[i - 1] !== '\\')) {
        inString = !inString
        current += char
      } else if (!inString) {
        if (char === '(') {
          depth++
          current += char
        } else if (char === ')') {
          depth--
          current += char
        } else if (char === ',' && depth === 0) {
          args.push(this.parseArgument(current.trim(), data))
          current = ''
        } else {
          current += char
        }
      } else {
        current += char
      }
    }

    if (current.trim()) {
      args.push(this.parseArgument(current.trim(), data))
    }

    return args
  }

  /**
   * 解析单个参数
   */
  private parseArgument(arg: string, data: string[][]): any {
    // 字符串
    if (arg.startsWith('"') && arg.endsWith('"')) {
      return arg.slice(1, -1)
    }

    // 单元格引用
    if (/^[A-Z]+[0-9]+$/.test(arg)) {
      return this.getCellValue(arg, data)
    }

    // 数字
    if (/^-?\d+\.?\d*$/.test(arg)) {
      return parseFloat(arg)
    }

    // 布尔值
    if (arg.toUpperCase() === 'TRUE') return true
    if (arg.toUpperCase() === 'FALSE') return false

    // 表达式
    return this.evaluateSimpleExpression(arg)
  }

  /**
   * 获取单元格值
   */
  private getCellValue(cellRef: string, data: string[][]): number | string {
    const col = this.parseColumn(cellRef)
    const row = this.parseRow(cellRef) - 1 // Excel从1开始

    if (row < 0 || row >= data.length || col < 0 || col >= (data[0]?.length || 0)) {
      return 0
    }

    const value = data[row][col]

    // 如果是公式，递归计算
    if (this.isFormula(value)) {
      return this.evaluate(value, data)
    }

    // 尝试转换为数字
    const num = parseFloat(value)
    return isNaN(num) ? value : num
  }

  /**
   * 解析列号（如 A -> 0, B -> 1, AA -> 26）
   */
  private parseColumn(cellRef: string): number {
    const colPart = cellRef.match(/[A-Z]+/)?.[0] || ''
    let col = 0
    for (let i = 0; i < colPart.length; i++) {
      col = col * 26 + (colPart.charCodeAt(i) - 'A'.charCodeAt(0) + 1)
    }
    return col - 1
  }

  /**
   * 解析行号（如 1 -> 1, 10 -> 10）
   */
  private parseRow(cellRef: string): number {
    return parseInt(cellRef.match(/[0-9]+/)?.[0] || '1')
  }

  /**
   * 评估简单表达式（不含函数）
   */
  private evaluateSimpleExpression(expr: string): number {
    // 移除空格
    expr = expr.replace(/\s+/g, '')

    // 替换运算符
    expr = expr.replace(/(\+|\-|\*|\/|\^)/g, ' $1 ')

    // 计算表达式
    try {
      // 使用Function构造器（注意：生产环境应该使用更安全的解析器）
      return Function(`return ${expr}`)()
    } catch (error) {
      throw new Error(`Invalid expression: ${expr}`)
    }
  }

  // ========== 数学函数 ==========

  private sum(args: any[], data: string[][]): number {
    const values = this.getNumberValues(args, data)
    return values.reduce((a, b) => a + b, 0)
  }

  private average(args: any[], data: string[][]): number {
    const values = this.getNumberValues(args, data)
    return values.length > 0 ? this.sum(args, data) / values.length : 0
  }

  private count(args: any[], data: string[][]): number {
    const values = this.getAllValues(args, data)
    return values.filter(v => v !== '' && v !== null && v !== undefined).length
  }

  private max(args: any[], data: string[][]): number {
    const values = this.getNumberValues(args, data)
    return values.length > 0 ? Math.max(...values) : 0
  }

  private min(args: any[], data: string[][]): number {
    const values = this.getNumberValues(args, data)
    return values.length > 0 ? Math.min(...values) : 0
  }

  private round(args: any[], data: string[][]): number {
    const num = this.getNumber(args[0], data)
    const digits = args[1] !== undefined ? this.getNumber(args[1], data) : 0
    return Number(num.toFixed(digits))
  }

  private roundUp(args: any[], data: string[][]): number {
    const num = this.getNumber(args[0], data)
    const digits = args[1] !== undefined ? this.getNumber(args[1], data) : 0
    const factor = Math.pow(10, digits)
    return Math.ceil(num * factor) / factor
  }

  private roundDown(args: any[], data: string[][]): number {
    const num = this.getNumber(args[0], data)
    const digits = args[1] !== undefined ? this.getNumber(args[1], data) : 0
    const factor = Math.pow(10, digits)
    return Math.floor(num * factor) / factor
  }

  private int(args: any[], data: string[][]): number {
    return Math.floor(this.getNumber(args[0], data))
  }

  private abs(args: any[], data: string[][]): number {
    return Math.abs(this.getNumber(args[0], data))
  }

  private sqrt(args: any[], data: string[][]): number {
    return Math.sqrt(this.getNumber(args[0], data))
  }

  private power(args: any[], data: string[][]): number {
    return Math.pow(this.getNumber(args[0], data), this.getNumber(args[1], data))
  }

  private mod(args: any[], data: string[][]): number {
    return this.getNumber(args[0], data) % this.getNumber(args[1], data)
  }

  // ========== 条件函数 ==========

  private sumif(args: any[], data: string[][]): number {
    const range = this.getArrayValue(args[0], data)
    const criteria = this.getValue(args[1])
    const sumRange = args[2] !== undefined ? this.getArrayValue(args[2], data) : range

    let sum = 0
    for (let i = 0; i < range.length && i < sumRange.length; i++) {
      if (this.matchesCriteria(range[i], criteria)) {
        sum += this.getNumber(sumRange[i])
      }
    }
    return sum
  }

  private countif(args: any[], data: string[][]): number {
    const range = this.getArrayValue(args[0], data)
    const criteria = this.getValue(args[1])

    return range.filter(v => this.matchesCriteria(v, criteria)).length
  }

  private averageif(args: any[], data: string[][]): number {
    const range = this.getArrayValue(args[0], data)
    const criteria = this.getValue(args[1])
    const avgRange = args[2] !== undefined ? this.getArrayValue(args[2], data) : range

    const values: number[] = []
    for (let i = 0; i < range.length && i < avgRange.length; i++) {
      if (this.matchesCriteria(range[i], criteria)) {
        values.push(this.getNumber(avgRange[i]))
      }
    }

    return values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0
  }

  // ========== 查找函数 ==========

  private vlookup(args: any[], data: string[][]): number | string {
    const lookupValue = this.getValue(args[0])
    const tableArray = this.get2DArrayValue(args[1], data)
    const colIndexNum = this.getNumber(args[2], data)
    const rangeLookup = args[3] !== undefined ? args[3] : true

    if (colIndexNum < 1 || colIndexNum > tableArray[0]?.length || 0) {
      throw new Error('#REF!')
    }

    // 查找行
    let rowIndex = -1
    if (rangeLookup === false || rangeLookup === 'FALSE') {
      // 精确查找
      rowIndex = tableArray.findIndex(row => row[0] === lookupValue)
    } else {
      // 近似查找
      rowIndex = this.findApproximateIndex(tableArray, 0, lookupValue)
    }

    if (rowIndex === -1) {
      return '#N/A'
    }

    return tableArray[rowIndex][colIndexNum - 1]
  }

  private hlookup(args: any[], data: string[][]): number | string {
    const lookupValue = this.getValue(args[0])
    const tableArray = this.get2DArrayValue(args[1], data)
    const rowIndexNum = this.getNumber(args[2], data)
    const rangeLookup = args[3] !== undefined ? args[3] : true

    if (rowIndexNum < 1 || rowIndexNum > tableArray.length) {
      throw new Error('#REF!')
    }

    // 查找列
    let colIndex = -1
    if (rangeLookup === false || rangeLookup === 'FALSE') {
      colIndex = tableArray[0].findIndex(val => val === lookupValue)
    } else {
      colIndex = this.findApproximateIndex(tableArray, 0, lookupValue, true)
    }

    if (colIndex === -1) {
      return '#N/A'
    }

    return tableArray[rowIndexNum - 1][colIndex]
  }

  private index(args: any[], data: string[][]): number | string {
    const array = args.length >= 2 ? this.get2DArrayValue(args[0], data) : this.getArrayValue(args[0], data)
    const rowNum = args.length >= 2 ? this.getNumber(args[1], data) - 1 : this.getNumber(args[0], data) - 1
    const colNum = args.length >= 3 ? this.getNumber(args[2], data) - 1 : undefined

    if (Array.isArray(array[0])) {
      // 二维数组
      if (colNum !== undefined) {
        if (rowNum < 0 || rowNum >= array.length || colNum < 0 || colNum >= array[0]?.length) {
          return '#REF!'
        }
        return array[rowNum][colNum]
      } else {
        if (rowNum < 0 || rowNum >= array.length) {
          return '#REF!'
        }
        return array[rowNum][0]
      }
    } else {
      // 一维数组
      if (rowNum < 0 || rowNum >= array.length) {
        return '#REF!'
      }
      return array[rowNum]
    }
  }

  private match(args: any[], data: string[][]): number {
    const lookupValue = this.getValue(args[0])
    const lookupArray = this.getArrayValue(args[1], data)
    const matchType = args[2] !== undefined ? this.getNumber(args[2], data) : 1

    if (matchType === 0) {
      // 精确匹配
      const index = lookupArray.findIndex(v => v === lookupValue)
      return index >= 0 ? index + 1 : '#N/A'
    } else {
      // 近似匹配
      const index = this.findApproximateIndex(lookupArray.map(v => [v]), 0, lookupValue)
      return index >= 0 ? index + 1 : '#N/A'
    }
  }

  // ========== 逻辑函数 ==========

  private if(args: any[], data: string[][]): number | string {
    const condition = this.getBoolean(args[0])
    return condition ? args[1] : args[2]
  }

  private and(args: any[], data: string[][]): boolean {
    return args.every(arg => this.getBoolean(arg))
  }

  private or(args: any[], data: string[][]): boolean {
    return args.some(arg => this.getBoolean(arg))
  }

  private not(args: any[], data: string[][]): boolean {
    return !this.getBoolean(args[0])
  }

  private iferror(args: any[], data: string[][]): number | string {
    const value = this.getValue(args[0])
    return (value === '#N/A' || value === '#VALUE!' || value === '#REF!' || value === '#DIV/0!' || value === '#NUM!' || value === '#NAME!' || value === '#NULL!')
      ? args[1]
      : value
  }

  // ========== 文本函数 ==========

  private left(args: any[], data: string[][]): string {
    const text = String(this.getValue(args[0]))
    const numChars = args[1] !== undefined ? this.getNumber(args[1], data) : 1
    return text.substring(0, numChars)
  }

  private right(args: any[], data: string[][]): string {
    const text = String(this.getValue(args[0]))
    const numChars = args[1] !== undefined ? this.getNumber(args[1], data) : 1
    return text.substring(text.length - numChars)
  }

  private mid(args: any[], data: string[][]): string {
    const text = String(this.getValue(args[0]))
    const startNum = this.getNumber(args[1], data) - 1
    const numChars = this.getNumber(args[2], data)
    return text.substring(startNum, startNum + numChars)
  }

  private len(args: any[], data: string[][]): number {
    return String(this.getValue(args[0])).length
  }

  private concat(args: any[], data: string[][]): string {
    return args.map(arg => String(this.getValue(arg))).join('')
  }

  private text(args: any[], data: string[][]): string {
    const value = this.getValue(args[0])
    const format = String(args[1])
    // 简化版，只支持基本格式
    return String(value)
  }

  private trim(args: any[], data: string[][]): string {
    return String(this.getValue(args[0])).trim()
  }

  private upper(args: any[], data: string[][]): string {
    return String(this.getValue(args[0])).toUpperCase()
  }

  private lower(args: any[], data: string[][]): string {
    return String(this.getValue(args[0])).toLowerCase()
  }

  // ========== 日期函数 ==========

  private today(): number {
    return Math.floor(Date.now() / 86400000)
  }

  private now(): number {
    return Date.now()
  }

  private year(args: any[], data: string[][]): number {
    const date = this.getNumber(args[0], data)
    const d = new Date(date * 86400000)
    return d.getFullYear()
  }

  private month(args: any[], data: string[][]): number {
    const date = this.getNumber(args[0], data)
    const d = new Date(date * 86400000)
    return d.getMonth() + 1
  }

  private day(args: any[], data: string[][]): number {
    const date = this.getNumber(args[0], data)
    const d = new Date(date * 86400000)
    return d.getDate()
  }

  // ========== 其他函数 ==========

  private rank(args: any[], data: string[][]): number {
    const num = this.getNumber(args[0], data)
    const ref = this.getNumberValues(args, data)
    const order = args[1] !== undefined ? this.getNumber(args[1], data) : 0

    const sorted = [...ref].sort((a, b) => order === 0 ? b - a : a - b)
    return sorted.indexOf(num) + 1
  }

  private large(args: any[], data: string[][]): number {
    const k = this.getNumber(args[1], data)
    const array = this.getNumberValues(args, data).sort((a, b) => b - a)
    return array[k - 1] || 0
  }

  private small(args: any[], data: string[][]): number {
    const k = this.getNumber(args[1], data)
    const array = this.getNumberValues(args, data).sort((a, b) => a - b)
    return array[k - 1] || 0
  }

  // ========== 辅助方法 ==========

  private matchesCriteria(value: any, criteria: any): boolean {
    // 简化版，支持基本比较
    const strValue = String(value)
    const strCriteria = String(criteria)

    if (strCriteria.startsWith('=')) {
      return strValue === strCriteria.substring(1)
    } else if (strCriteria.startsWith('>')) {
      return parseFloat(strValue) > parseFloat(strCriteria.substring(1))
    } else if (strCriteria.startsWith('<')) {
      return parseFloat(strValue) < parseFloat(strCriteria.substring(1))
    } else if (strCriteria.startsWith('>=')) {
      return parseFloat(strValue) >= parseFloat(strCriteria.substring(2))
    } else if (strCriteria.startsWith('<=')) {
      return parseFloat(strValue) <= parseFloat(strCriteria.substring(2))
    } else if (strCriteria.startsWith('<>')) {
      return parseFloat(strValue) !== parseFloat(strCriteria.substring(2))
    } else {
      return strValue === strCriteria
    }
  }

  private findApproximateIndex(array: any[][], col: number, value: any, horizontal: boolean = false): number {
    const values = horizontal ? array[0] : array.map(row => row[col])
    const numValues = values.map(v => parseFloat(String(v))).filter(v => !isNaN(v))
    const numValue = parseFloat(String(value))

    if (isNaN(numValue)) return -1

    let index = -1
    for (let i = 0; i < numValues.length; i++) {
      if (numValues[i] <= numValue) {
        index = i
      } else {
        break
      }
    }

    return index
  }

  private getValue(arg: any): any {
    if (typeof arg === 'string' && this.isFormula(arg)) {
      return this.variableCache.get(arg) || arg
    }
    return arg
  }

  private getNumber(arg: any, data: string[][]): number {
    const value = this.getValue(arg)
    if (typeof value === 'number') return value
    const num = parseFloat(String(value))
    return isNaN(num) ? 0 : num
  }

  private getBoolean(arg: any): boolean {
    const value = this.getValue(arg)
    if (typeof value === 'boolean') return value
    if (typeof value === 'number') return value !== 0
    if (typeof value === 'string') {
      const upper = value.toUpperCase()
      if (upper === 'TRUE') return true
      if (upper === 'FALSE') return false
    }
    return !!value
  }

  private getArrayValue(arg: any, data: string[][]): any[] {
    if (Array.isArray(arg)) return arg
    if (typeof arg === 'string') {
      const cellRefs = arg.match(/[A-Z]+[0-9]+:[A-Z]+[0-9]+/g)
      if (cellRefs) {
        return cellRefs.map(ref => this.getCellValue(ref, data))
      }
    }
    return [arg]
  }

  private get2DArrayValue(arg: any, data: string[][]): any[][] {
    if (Array.isArray(arg) && Array.isArray(arg[0])) return arg
    if (typeof arg === 'string' && /^[A-Z]+[0-9]+:[A-Z]+[0-9]+$/.test(arg)) {
      return this.getCellRange(arg, data)
    }
    return [[arg]]
  }

  private getCellRange(range: string, data: string[][]): any[][] {
    const [start, end] = range.split(':')
    const startCol = this.parseColumn(start)
    const startRow = this.parseRow(start) - 1
    const endCol = this.parseColumn(end)
    const endRow = this.parseRow(end) - 1

    const result: any[][] = []
    for (let r = startRow; r <= endRow && r < data.length; r++) {
      const row: any[] = []
      for (let c = startCol; c <= endCol && c < (data[r]?.length || 0); c++) {
        row.push(data[r][c])
      }
      result.push(row)
    }

    return result
  }

  private getNumberValues(args: any[], data: string[][]): number[] {
    const values: number[] = []
    args.forEach(arg => {
      if (Array.isArray(arg)) {
        values.push(...arg.map(a => this.getNumber(a, data)))
      } else {
        values.push(this.getNumber(arg, data))
      }
    })
    return values.filter(v => !isNaN(v))
  }

  private getAllValues(args: any[], data: string[][]): any[] {
    const values: any[] = []
    args.forEach(arg => {
      if (Array.isArray(arg)) {
        values.push(...arg)
      } else {
        values.push(arg)
      }
    })
    return values
  }
}

/**
 * 创建公式引擎实例
 */
export function createFormulaEngine(): FormulaEngine {
  return new SimpleFormulaEngine()
}

/**
 * 默认公式引擎实例
 */
export const formulaEngine = createFormulaEngine()
