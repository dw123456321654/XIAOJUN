/**
 * Excel解析工具
 * 支持解析.xlsx/.xls/.csv文件，提取数据和公式
 */

import * as XLSX from 'xlsx'

/**
 * Excel文件数据
 */
export interface ExcelData {
  fileName: string
  fileSize: number
  sheetNames: string[]
  sheets: SheetData[]
  formulas: string[]
  formulaStats: FormulaStats
}

/**
 * 工作表数据
 */
export interface SheetData {
  name: string
  rowCount: number
  columnCount: number
  data: string[][]
  formulas: CellFormula[]
}

/**
 * 单元格公式
 */
export interface CellFormula {
  address: string
  formula: string
  sheet: string
}

/**
 * 公式统计
 */
export interface FormulaStats {
  totalCount: number
  formulasByFormula: Record<string, number>
  formulasBySheet: Record<string, number>
  formulasByType: Record<string, number>
  complexityStats: {
    simple: number // 1层嵌套
    medium: number // 2-3层嵌套
    complex: number // 4+层嵌套
  }
  formulaDistribution: FormulaDistribution[]
}

/**
 * 公式分布
 */
export interface FormulaDistribution {
  formula: string
  count: number
  percentage: number
}

/**
 * Excel解析器类
 */
export class ExcelParser {
  /**
   * 解析Excel文件
   */
  static async parseFile(file: File): Promise<ExcelData> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result as ArrayBuffer)
          const workbook = XLSX.read(data, { type: 'array' })

          const excelData: ExcelData = {
            fileName: file.name,
            fileSize: file.size,
            sheetNames: workbook.SheetNames,
            sheets: [],
            formulas: [],
            formulaStats: {
              totalCount: 0,
              formulasByFormula: {},
              formulasBySheet: {},
              formulasByType: {},
              complexityStats: {
                simple: 0,
                medium: 0,
                complex: 0
              },
              formulaDistribution: []
            }
          }

          // 解析每个工作表
          workbook.SheetNames.forEach((sheetName, sheetIndex) => {
            const sheet = workbook.Sheets[sheetName]
            const sheetData = this.parseSheet(sheet, sheetName)

            excelData.sheets.push(sheetData)
            excelData.formulas.push(...sheetData.formulas.map(f => f.formula))
          })

          // 统计公式
          excelData.formulaStats = this.analyzeFormulas(excelData)

          resolve(excelData)
        } catch (error) {
          reject(new Error(`解析Excel文件失败：${error instanceof Error ? error.message : String(error)}`))
        }
      }

      reader.onerror = () => {
        reject(new Error('读取文件失败'))
      }

      reader.readAsArrayBuffer(file)
    })
  }

  /**
   * 解析工作表
   */
  private static parseSheet(sheet: XLSX.WorkSheet, sheetName: string): SheetData {
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as string
    const rows = data.split('\n').filter(row => row.trim()).map(row => row.split(','))

    const rowCount = rows.length
    const columnCount = rows.length > 0 ? rows[0].length : 0

    // 提取公式
    const formulas: CellFormula[] = []
    const ref = sheet['!ref']

    if (ref) {
      // 解析引用中的公式
      const matches = ref.match(/([A-Z]+[0-9]+)="([^"]+)"/g)
      if (matches) {
        matches.forEach(match => {
          const address = match[1]
          const formula = match[2]

          if (formula && formula.trim()) {
            formulas.push({
              address,
              formula: formula.trim(),
              sheet: sheetName
            })
          }
        })
      }
    }

    return {
      name: sheetName,
      rowCount,
      columnCount,
      data: rows,
      formulas
    }
  }

  /**
   * 分析公式
   */
  private static analyzeFormulas(excelData: ExcelData): FormulaStats {
    const formulas = excelData.formulas
    const formulasByFormula: Record<string, number> = {}
    const formulasBySheet: Record<string, number> = {}
    const formulasByType: Record<string, number> = {}

    // 统计公式数量
    formulas.forEach(f => {
      const formulaName = this.extractFormulaName(f.formula)
      formulasByFormula[formulaName] = (formulasByFormula[formulaName] || 0) + 1
      formulasBySheet[f.sheet] = (formulasBySheet[f.sheet] || 0) + 1

      const formulaType = this.getFormulaType(f.formula)
      formulasByType[formulaType] = (formulasByType[formulaType] || 0) + 1
    })

    // 统计公式复杂度
    const complexityStats = {
      simple: 0,
      medium: 0,
      complex: 0
    }

    formulas.forEach(f => {
      const complexity = this.getFormulaComplexity(f.formula)
      if (complexity === 'simple') complexityStats.simple++
      else if (complexity === 'medium') complexityStats.medium++
      else complexityStats.complex++
    })

    // 公式分布（Top 10）
    const formulaDistribution: FormulaDistribution[] = Object.entries(formulasByFormula)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([formula, count], index, array) => ({
        formula,
        count,
        percentage: (count / formulas.length) * 100
      }))

    return {
      totalCount: formulas.length,
      formulasByFormula,
      formulasBySheet,
      formulasByType,
      complexityStats,
      formulaDistribution
    }
  }

  /**
   * 提取公式名称
   */
  private static extractFormulaName(formula: string): string {
    const match = formula.match(/^=([A-Z]+)/i)
    return match ? match[1] : formula
  }

  /**
   * 获取公式类型
   */
  private static getFormulaType(formula: string): string {
    const upperFormula = formula.toUpperCase()

    // 数学函数
    if (/^=SUM|^=AVERAGE|^=COUNT|^=MAX|^=MIN|^=ROUND/i.test(upperFormula)) {
      return '数学'
    }

    // 文本函数
    if (/^=LEFT|^=RIGHT|^=MID|^=LEN|^=CONCAT|^=TEXT/i.test(upperFormula)) {
      return '文本'
    }

    // 日期函数
    if (/^=TODAY|^=NOW|^=YEAR|^=MONTH|^=DAY/i.test(upperFormula)) {
      return '日期'
    }

    // 查找函数
    if (/^=VLOOKUP|^=HLOOKUP|^=INDEX|^=MATCH|^=XLOOKUP/i.test(upperFormula)) {
      return '查找'
    }

    // 逻辑函数
    if (/^=IF|^=AND|^=OR|^=NOT/i.test(upperFormula)) {
      return '逻辑'
    }

    // 条件函数
    if (/^=SUMIF|^=COUNTIF|^=AVERAGEIF/i.test(upperFormula)) {
      return '条件'
    }

    // 其他
    return '其他'
  }

  /**
   * 获取公式复杂度
   */
  private static getFormulaComplexity(formula: string): 'simple' | 'medium' | 'complex' {
    const upperFormula = formula.toUpperCase()

    // 计算嵌套层级
    let nestingLevel = 0
    let maxNesting = 0

    for (let i = 0; i < upperFormula.length; i++) {
      if (upperFormula[i] === '(') {
        nestingLevel++
        maxNesting = Math.max(maxNesting, nestingLevel)
      } else if (upperFormula[i] === ')') {
        nestingLevel--
      }
    }

    if (maxNesting <= 1) return 'simple'
    if (maxNesting <= 3) return 'medium'
    return 'complex'
  }

  /**
   * 检测文件类型
   */
  static getFileType(fileName: string): 'xlsx' | 'xls' | 'csv' {
    const lowerName = fileName.toLowerCase()
    if (lowerName.endsWith('.xlsx')) return 'xlsx'
    if (lowerName.endsWith('.xls')) return 'xls'
    if (lowerName.endsWith('.csv')) return 'csv'
    return 'xlsx' // 默认
  }

  /**
   * 格式化文件大小
   */
  static formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
  }

  /**
   * 导出为CSV
   */
  static exportToCSV(data: string[][], headers: string[]): string {
    const headerRow = headers.join(',')
    const dataRows = data.map(row => row.join(','))
    return [headerRow, ...dataRows].join('\n')
  }

  /**
   * 导出为JSON
   */
  static exportToJSON(data: any): string {
    return JSON.stringify(data, null, 2)
  }
}

/**
 * 默认Excel解析器实例
 */
export const excelParser = new ExcelParser()
