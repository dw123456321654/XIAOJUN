import type { Formula, Practice, LearningPath, RealCase, FormulaCombination } from '../types'

// 公式数据
export const formulas: Formula[] = [
  // ========== 数学与三角函数 ==========
  {
    id: 'sum-001',
    name: 'SUM',
    formula: '=SUM(number1, number2, ...)',
    description: '求和。对一组数值进行加法运算，是Excel中最基础的数学函数。',
    tags: ['数学与三角'],
    difficulty: 'beginner',
    examples: {
      basic: {
        data: [
          { id: 1, cells: [{ id: 1, value: 'A' }, { id: 2, value: 'B' }] },
          { id: 2, cells: [{ id: 1, value: '10' }, { id: 2, value: '20' }] },
          { id: 3, cells: [{ id: 1, value: '30' }, { id: 2, value: '' }] },
        ],
        formula: '=SUM(A2:A3)',
        result: '30',
      },
      advanced: {
        data: [
          { id: 1, cells: [{ id: 1, value: 'A' }, { id: 2, value: 'B' }, { id: 3, value: 'C' }] },
          { id: 2, cells: [{ id: 1, value: '100' }, { id: 2, value: '200' }, { id: 3, value: '300' }] },
          { id: 3, cells: [{ id: 1, value: '150' }, { id: 2, value: '250' }, { id: 3, value: '' }] },
        ],
        formula: '=SUM(A2:C3)',
        result: '1000',
      },
      nested: {
        data: [
          { id: 1, cells: [{ id: 1, value: 'A' }, { id: 2, value: 'B' }] },
          { id: 2, cells: [{ id: 1, value: '10' }, { id: 2, value: '20' }] },
          { id: 3, cells: [{ id: 1, value: '30' }, { id: 2, value: '' }] },
        ],
        formula: '=SUM(A2:A3)*2',
        result: '60',
      },
      real: {
        data: [
          { id: 1, cells: [{ id: 1, value: 'A' }, { id: 2, value: 'B' }, { id: 3, value: 'C' }] },
          { id: 2, cells: [{ id: 1, value: '一月' }, { id: 2, value: '50000' }, { id: 3, value: '销售' }] },
          { id: 3, cells: [{ id: 1, value: '二月' }, { id: 2, value: '60000' }, { id: 3, value: '销售' }] },
          { id: 4, cells: [{ id: 1, value: '三月' }, { id: 2, value: '70000' }, { id: 3, value: '销售' }] },
        ],
        formula: '=SUMIF(C2:C4, "销售", B2:B4)',
        result: '180000',
      },
    },
  },
  {
    id: 'avg-001',
    name: 'AVERAGE',
    formula: '=AVERAGE(number1, number2, ...)',
    description: '平均值。计算一组数值的算术平均值，常用于计算平均成绩、平均销售额等。',
    tags: ['统计'],
    difficulty: 'beginner',
    examples: {
      basic: {
        data: [
          { id: 1, cells: [{ id: 1, value: 'A' }, { id: 2, value: 'B' }] },
          { id: 2, cells: [{ id: 1, value: '80' }, { id: 2, value: '90' }] },
          { id: 3, cells: [{ id: 1, value: '85' }, { id: 2, value: '' }] },
        ],
        formula: '=AVERAGE(A2:A3)',
        result: '85',
      },
      advanced: {
        data: [
          { id: 1, cells: [{ id: 1, value: 'A' }, { id: 2, value: 'B' }, { id: 3, value: 'C' }] },
          { id: 2, cells: [{ id: 1, value: '张三' }, { id: 2, value: '85' }, { id: 3, value: '销售部' }] },
          { id: 3, cells: [{ id: 1, value: '李四' }, { id: 2, value: '92' }, { id: 3, value: '销售部' }] },
          { id: 4, cells: [{ id: 1, value: '王五' }, { id: 2, value: '78' }, { id: 3, value: '技术部' }] },
        ],
        formula: '=AVERAGE(B2:B4)',
        result: '85',
      },
      nested: {
        data: [
          { id: 1, cells: [{ id: 1, value: 'A' }, { id: 2, value: 'B' }] },
          { id: 2, cells: [{ id: 1, value: '80' }, { id: 2, value: '90' }] },
          { id: 3, cells: [{ id: 1, value: '85' }, { id: 2, value: '' }] },
        ],
        formula: '=ROUND(AVERAGE(A2:A3), 0)',
        result: '85',
      },
      real: {
        data: [
          { id: 1, cells: [{ id: 1, value: 'A' }, { id: 2, value: 'B' }, { id: 3, value: 'C' }] },
          { id: 2, cells: [{ id: 1, value: '一月' }, { id: 2, value: '50000' }, { id: 3, value: '销售' }] },
          { id: 3, cells: [{ id: 1, value: '二月' }, { id: 2, value: '60000' }, { id: 3, value: '销售' }] },
          { id: 4, cells: [{ id: 1, value: '三月' }, { id: 2, value: '70000' }, { id: 3, value: '销售' }] },
        ],
        formula: '=AVERAGE(B2:B4)',
        result: '60000',
      },
    },
  },
  {
    id: 'cnt-001',
    name: 'COUNT',
    formula: '=COUNT(value1, value2, ...)',
    description: '计数。统计包含数字的单元格数量，常用于统计有效数据个数。',
    tags: ['统计'],
    difficulty: 'beginner',
    examples: {
      basic: {
        data: [
          { id: 1, cells: [{ id: 1, value: 'A' }, { id: 2, value: 'B' }] },
          { id: 2, cells: [{ id: 1, value: '10' }, { id: 2, value: '20' }] },
          { id: 3, cells: [{ id: 1, value: '30' }, { id: 2, value: '' }] },
          { id: 4, cells: [{ id: 1, value: '文本' }, { id: 2, value: '' }] },
        ],
        formula: '=COUNT(A2:A4)',
        result: '2',
      },
      advanced: {
        data: [
          { id: 1, cells: [{ id: 1, value: 'A' }, { id: 2, value: 'B' }] },
          { id: 2, cells: [{ id: 1, value: '张三' }, { id: 2, value: '85' }] },
          { id: 3, cells: [{ id: 1, value: '李四' }, { id: 2, value: '92' }] },
          { id: 4, cells: [{ id: 1, value: '王五' }, { id: 2, value: '' }] },
        ],
        formula: '=COUNT(B2:B4)',
        result: '2',
      },
      nested: {
        data: [
          { id: 1, cells: [{ id: 1, value: 'A' }, { id: 2, value: 'B' }] },
          { id: 2, cells: [{ id: 1, value: '10' }, { id: 2, value: '20' }] },
          { id: 3, cells: [{ id: 1, value: '30' }, { id: 2, value: '' }] },
        ],
        formula: '=SUM(A2:A3)/COUNT(A2:A3)',
        result: '15',
      },
      real: {
        data: [
          { id: 1, cells: [{ id: 1, value: 'A' }, { id: 2, value: 'B' }] },
          { id: 2, cells: [{ id: 1, value: '100' }, { id: 2, value: '已完成' }] },
          { id: 3, cells: [{ id: 1, value: '150' }, { id: 2, value: '进行中' }] },
          { id: 4, cells: [{ id: 1, value: '' }, { id: 2, value: '未开始' }] },
        ],
        formula: '=COUNT(A2:A4)',
        result: '2',
      },
    },
  },
  {
    id: 'max-001',
    name: 'MAX',
    formula: '=MAX(number1, number2, ...)',
    description: '最大值。返回一组数值中的最大值，常用于找出最高分、最高销售额等。',
    tags: ['统计'],
    difficulty: 'beginner',
    examples: {
      basic: {
        data: [
          { id: 1, cells: [{ id: 1, value: 'A' }, { id: 2, value: 'B' }] },
          { id: 2, cells: [{ id: 1, value: '10' }, { id: 2, value: '20' }] },
          { id: 3, cells: [{ id: 1, value: '30' }, { id: 2, value: '' }] },
        ],
        formula: '=MAX(A2:A3)',
        result: '30',
      },
      advanced: {
        data: [
          { id: 1, cells: [{ id: 1, value: 'A' }, { id: 2, value: 'B' }, { id: 3, value: 'C' }] },
          { id: 2, cells: [{ id: 1, value: '张三' }, { id: 2, value: '85' }, { id: 3, value: '销售部' }] },
          { id: 3, cells: [{ id: 1, value: '李四' }, { id: 2, value: '92' }, { id: 3, value: '销售部' }] },
          { id: 4, cells: [{ id: 1, value: '王五' }, { id: 2, value: '78' }, { id: 3, value: '技术部' }] },
        ],
        formula: '=MAX(B2:B4)',
        result: '92',
      },
      nested: {
        data: [
          { id: 1, cells: [{ id: 1, value: 'A' }, { id: 2, value: 'B' }] },
          { id: 2, cells: [{ id: 1, value: '10' }, { id: 2, value: '20' }] },
          { id: 3, cells: [{ id: 1, value: '30' }, { id: 2, value: '' }] },
        ],
        formula: '=MAX(A2:A3)-MIN(A2:A3)',
        result: '20',
      },
      real: {
        data: [
          { id: 1, cells: [{ id: 1, value: 'A' }, { id: 2, value: 'B' }, { id: 3, value: 'C' }] },
          { id: 2, cells: [{ id: 1, value: '产品A' }, { id: 2, value: '500' }, { id: 3, value: '100' }] },
          { id: 3, cells: [{ id: 1, value: '产品B' }, { id: 2, value: '800' }, { id: 3, value: '200' }] },
          { id: 4, cells: [{ id: 1, value: '产品C' }, { id: 2, value: '600' }, { id: 3, value: '150' }] },
        ],
        formula: '=MAX(B2:B4)',
        result: '800',
      },
    },
  },
  {
    id: 'min-001',
    name: 'MIN',
    formula: '=MIN(number1, number2, ...)',
    description: '最小值。返回一组数值中的最小值，常用于找出最低分、最低成本等。',
    tags: ['统计'],
    difficulty: 'beginner',
    examples: {
      basic: {
        data: [
          { id: 1, cells: [{ id: 1, value: 'A' }, { id: 2, value: 'B' }] },
          { id: 2, cells: [{ id: 1, value: '10' }, { id: 2, value: '20' }] },
          { id: 3, cells: [{ id: 1, value: '30' }, { id: 2, value: '' }] },
        ],
        formula: '=MIN(A2:A3)',
        result: '10',
      },
      advanced: {
        data: [
          { id: 1, cells: [{ id: 1, value: 'A' }, { id: 2, value: 'B' }, { id: 3, value: 'C' }] },
          { id: 2, cells: [{ id: 1, value: '张三' }, { id: 2, value: '85' }, { id: 3, value: '销售部' }] },
          { id: 3, cells: [{ id: 1, value: '李四' }, { id: 2, value: '92' }, { id: 3, value: '销售部' }] },
          { id: 4, cells: [{ id: 1, value: '王五' }, { id: 2, value: '78' }, { id: 3, value: '技术部' }] },
        ],
        formula: '=MIN(B2:B4)',
        result: '78',
      },
      nested: {
        data: [
          { id: 1, cells: [{ id: 1, value: 'A' }, { id: 2, value: 'B' }] },
          { id: 2, cells: [{ id: 1, value: '10' }, { id: 2, value: '20' }] },
          { id: 3, cells: [{ id: 1, value: '30' }, { id: 2, value: '' }] },
        ],
        formula: '=IF(MIN(A2:A3)<15, "偏低", "正常")',
        result: '正常',
      },
      real: {
        data: [
          { id: 1, cells: [{ id: 1, value: 'A' }, { id: 2, value: 'B' }, { id: 3, value: 'C' }] },
          { id: 2, cells: [{ id: 1, value: '产品A' }, { id: 2, value: '500' }, { id: 3, value: '100' }] },
          { id: 3, cells: [{ id: 1, value: '产品B' }, { id: 2, value: '800' }, { id: 3, value: '200' }] },
          { id: 4, cells: [{ id: 1, value: '产品C' }, { id: 2, value: '600' }, { id: 3, value: '150' }] },
        ],
        formula: '=MIN(C2:C4)',
        result: '100',
      },
    },
  },
  {
    id: 'rnd-001',
    name: 'ROUND',
    formula: '=ROUND(number, num_digits)',
    description: '四舍五入。按指定的小数位数对数值进行四舍五入。',
    tags: ['数学与三角'],
    difficulty: 'beginner',
    examples: {
      basic: {
        data: [
          { id: 1, cells: [{ id: 1, value: 'A' }, { id: 2, value: 'B' }] },
          { id: 2, cells: [{ id: 1, value: '3.14159' }, { id: 2, value: '' }] },
        ],
        formula: '=ROUND(A2, 2)',
        result: '3.14',
      },
      advanced: {
        data: [
          { id: 1, cells: [{ id: 1, value: 'A' }, { id: 2, value: 'B' }] },
          { id: 2, cells: [{ id: 1, value: '100.456' }, { id: 2, value: '' }] },
          { id: 3, cells: [{ id: 1, value: '200.789' }, { id: 2, value: '' }] },
        ],
        formula: '=ROUND(SUM(A2:A3), 1)',
        result: '301.2',
      },
      nested: {
        data: [
          { id: 1, cells: [{ id: 1, value: 'A' }, { id: 2, value: 'B' }] },
          { id: 2, cells: [{ id: 1, value: '3.14159' }, { id: 2, value: '' }] },
        ],
        formula: '=ROUND(A2, 0)',
        result: '3',
      },
      real: {
        data: [
          { id: 1, cells: [{ id: 1, value: 'A' }, { id: 2, value: 'B' }] },
          { id: 2, cells: [{ id: 1, value: '1234.5678' }, { id: 2, value: '' }] },
        ],
        formula: '=ROUND(A2, 2)',
        result: '1234.57',
      },
    },
  },
  // ========== 查找与引用函数 ==========
  {
    id: 'vlookup-001',
    name: 'VLOOKUP',
    formula: '=VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup])',
    description:
      '在表格中查找值并返回同行的其他列的值。VLOOKUP是Excel中最常用的查找函数之一。',
    tags: ['查找与引用'],
    difficulty: 'intermediate',
    examples: {
      basic: {
        data: [
          {
            id: 1,
            cells: [
              { id: 1, value: 'A' },
              { id: 2, value: 'B' },
            ],
          },
          {
            id: 2,
            cells: [
              { id: 1, value: '苹果' },
              { id: 2, value: '5' },
            ],
          },
          {
            id: 3,
            cells: [
              { id: 1, value: '香蕉' },
              { id: 2, value: '3' },
            ],
          },
        ],
        formula: '=VLOOKUP("苹果", A2:B3, 2, FALSE)',
        result: '5',
      },
      advanced: {
        data: [
          {
            id: 1,
            cells: [
              { id: 1, value: 'A' },
              { id: 2, value: 'B' },
              { id: 3, value: 'C' },
            ],
          },
          {
            id: 2,
            cells: [
              { id: 1, value: '001' },
              { id: 2, value: '张三' },
              { id: 3, value: '销售部' },
            ],
          },
          {
            id: 3,
            cells: [
              { id: 1, value: '002' },
              { id: 2, value: '李四' },
              { id: 3, value: '技术部' },
            ],
          },
        ],
        formula: '=VLOOKUP("001", A2:C3, 3, FALSE)',
        result: '销售部',
      },
      nested: {
        data: [
          {
            id: 1,
            cells: [
              { id: 1, value: 'A' },
              { id: 2, value: 'B' },
              { id: 3, value: 'C' },
            ],
          },
          {
            id: 2,
            cells: [
              { id: 1, value: 'A' },
              { id: 2, value: '10' },
              { id: 3, value: '20' },
            ],
          },
          {
            id: 3,
            cells: [
              { id: 1, value: 'B' },
              { id: 2, value: '15' },
              { id: 3, value: '25' },
            ],
          },
        ],
        formula: '=VLOOKUP("A", A2:C3, 2) + VLOOKUP("A", A2:C3, 3)',
        result: '30',
      },
      real: {
        data: [
          {
            id: 1,
            cells: [
              { id: 1, value: 'A' },
              { id: 2, value: 'B' },
            ],
          },
          {
            id: 2,
            cells: [
              { id: 1, value: 'P001' },
              { id: 2, value: '100' },
            ],
          },
          {
            id: 3,
            cells: [
              { id: 1, value: 'P002' },
              { id: 2, value: '150' },
            ],
          },
        ],
        formula: '=VLOOKUP("P001", A2:B3, 2, FALSE)',
        result: '100',
      },
    },
  },
  {
    id: '2',
    name: 'SUMIF',
    formula: '=SUMIF(range, criteria, [sum_range])',
    description:
      '对满足条件的单元格求和。常用于按条件统计数据，例如统计某类别的总销售额。',
    tags: ['数学与三角'],
    difficulty: 'beginner',
    examples: {
      basic: {
        data: [
          {
            id: 1,
            cells: [
              { id: 1, value: 'A' },
              { id: 2, value: 'B' },
            ],
          },
          {
            id: 2,
            cells: [
              { id: 1, value: '苹果' },
              { id: 2, value: '10' },
            ],
          },
          {
            id: 3,
            cells: [
              { id: 1, value: '蔬菜' },
              { id: 2, value: '5' },
            ],
          },
          {
            id: 4,
            cells: [
              { id: 1, value: '苹果' },
              { id: 2, value: '15' },
            ],
          },
        ],
        formula: '=SUMIF(A2:A4, "苹果", B2:B4)',
        result: '25',
      },
      advanced: {
        data: [
          {
            id: 1,
            cells: [
              { id: 1, value: 'A' },
              { id: 2, value: 'B' },
              { id: 3, value: 'C' },
            ],
          },
          {
            id: 2,
            cells: [
              { id: 1, value: '张三' },
              { id: 2, value: '销售部' },
              { id: 3, value: '1000' },
            ],
          },
          {
            id: 3,
            cells: [
              { id: 1, value: '李四' },
              { id: 2, value: '销售部' },
              { id: 3, value: '1500' },
            ],
          },
          {
            id: 4,
            cells: [
              { id: 1, value: '王五' },
              { id: 2, value: '技术部' },
              { id: 3, value: '1200' },
            ],
          },
        ],
        formula: '=SUMIF(B2:B4, "销售部", C2:C4)',
        result: '2500',
      },
      nested: {
        data: [
          {
            id: 1,
            cells: [
              { id: 1, value: 'A' },
              { id: 2, value: 'B' },
            ],
          },
          {
            id: 2,
            cells: [
              { id: 1, value: '100' },
              { id: 2, value: '销售' },
            ],
          },
          {
            id: 3,
            cells: [
              { id: 1, value: '150' },
              { id: 2, value: '销售' },
            ],
          },
          {
            id: 4,
            cells: [
              { id: 1, value: '200' },
              { id: 2, value: '市场' },
            ],
          },
        ],
        formula: '=SUMIF(B2:B4, "销售", A2:A4) / COUNTIF(B2:B4, "销售")',
        result: '125',
      },
      real: {
        data: [
          {
            id: 1,
            cells: [
              { id: 1, value: 'A' },
              { id: 2, value: 'B' },
              { id: 3, value: 'C' },
            ],
          },
          {
            id: 2,
            cells: [
              { id: 1, value: '一月' },
              { id: 2, value: '电子产品' },
              { id: 3, value: '50000' },
            ],
          },
          {
            id: 3,
            cells: [
              { id: 1, value: '一月' },
              { id: 2, value: '服装' },
              { id: 3, value: '30000' },
            ],
          },
          {
            id: 4,
            cells: [
              { id: 1, value: '二月' },
              { id: 2, value: '电子产品' },
              { id: 3, value: '60000' },
            ],
          },
        ],
        formula: '=SUMIF(B2:B4, "电子产品", C2:C4)',
        result: '110000',
      },
    },
  },
  {
    id: '3',
    name: 'INDEX+MATCH',
    formula: '=INDEX(return_range, MATCH(lookup_value, lookup_range, 0))',
    description:
      'INDEX和MATCH组合使用，可以实现比VLOOKUP更灵活的查找功能。可以从任意方向查找，不受列序限制。',
    tags: ['查找与引用'],
    difficulty: 'advanced',
    examples: {
      basic: {
        data: [
          {
            id: 1,
            cells: [
              { id: 1, value: 'A' },
              { id: 2, value: 'B' },
              { id: 3, value: 'C' },
            ],
          },
          {
            id: 2,
            cells: [
              { id: 1, value: '产品A' },
              { id: 2, value: '10' },
              { id: 3, value: '100' },
            ],
          },
          {
            id: 3,
            cells: [
              { id: 1, value: '产品B' },
              { id: 2, value: '20' },
              { id: 3, value: '200' },
            ],
          },
        ],
        formula: '=INDEX(C2:C3, MATCH("产品A", A2:A3, 0))',
        result: '100',
      },
      advanced: {
        data: [
          {
            id: 1,
            cells: [
              { id: 1, value: 'A' },
              { id: 2, value: 'B' },
              { id: 3, value: 'C' },
              { id: 4, value: 'D' },
            ],
          },
          {
            id: 2,
            cells: [
              { id: 1, value: 'Q1' },
              { id: 2, value: '销售额' },
              { id: 3, value: '利润' },
              { id: 4, value: '客户数' },
            ],
          },
          {
            id: 3,
            cells: [
              { id: 1, value: 'Q1' },
              { id: 2, value: '1000' },
              { id: 3, value: '200' },
              { id: 4, value: '50' },
            ],
          },
        ],
        formula: '=INDEX(B3:D3, MATCH("利润", B2:D2, 0))',
        result: '200',
      },
      nested: {
        data: [
          {
            id: 1,
            cells: [
              { id: 1, value: 'A' },
              { id: 2, value: 'B' },
              { id: 3, value: 'C' },
            ],
          },
          {
            id: 2,
            cells: [
              { id: 1, value: '产品A' },
              { id: 2, value: '100' },
              { id: 3, value: '10' },
            ],
          },
          {
            id: 3,
            cells: [
              { id: 1, value: '产品B' },
              { id: 2, value: '200' },
              { id: 3, value: '20' },
            ],
          },
        ],
        formula: '=INDEX(C2:C3, MATCH(MAX(B2:B3), B2:B3, 0))',
        result: '20',
      },
      real: {
        data: [
          {
            id: 1,
            cells: [
              { id: 1, value: 'A' },
              { id: 2, value: 'B' },
              { id: 3, value: 'C' },
            ],
          },
          {
            id: 2,
            cells: [
              { id: 1, value: '张三' },
              { id: 2, value: '销售部' },
              { id: 3, value: '8000' },
            ],
          },
          {
            id: 3,
            cells: [
              { id: 1, value: '李四' },
              { id: 2, value: '技术部' },
              { id: 3, value: '10000' },
            ],
          },
          {
            id: 4,
            cells: [
              { id: 1, value: '王五' },
              { id: 2, value: '销售部' },
              { id: 3, value: '9000' },
            ],
          },
        ],
        formula: '=INDEX(C2:C4, MATCH("销售部", B2:B4, 0))',
        result: '8000',
      },
    },
  },
  {
    id: '4',
    name: 'COUNTIF',
    formula: '=COUNTIF(range, criteria)',
    description:
      '统计满足条件的单元格数量。常用于计算出现次数、统计达标人数等场景。',
    tags: ['统计'],
    difficulty: 'beginner',
    examples: {
      basic: {
        data: [
          {
            id: 1,
            cells: [
              { id: 1, value: 'A' },
              { id: 2, value: 'B' },
            ],
          },
          {
            id: 2,
            cells: [
              { id: 1, value: '苹果' },
              { id: 2, value: '5' },
            ],
          },
          {
            id: 3,
            cells: [
              { id: 1, value: '香蕉' },
              { id: 2, value: '3' },
            ],
          },
          {
            id: 4,
            cells: [
              { id: 1, value: '苹果' },
              { id: 2, value: '2' },
            ],
          },
        ],
        formula: '=COUNTIF(A2:A4, "苹果")',
        result: '2',
      },
      advanced: {
        data: [
          {
            id: 1,
            cells: [
              { id: 1, value: 'A' },
              { id: 2, value: 'B' },
            ],
          },
          {
            id: 2,
            cells: [
              { id: 1, value: '张三' },
              { id: 2, value: '85' },
            ],
          },
          {
            id: 3,
            cells: [
              { id: 1, value: '李四' },
              { id: 2, value: '92' },
            ],
          },
          {
            id: 4,
            cells: [
              { id: 1, value: '王五' },
              { id: 2, value: '78' },
            ],
          },
          {
            id: 5,
            cells: [
              { id: 1, value: '赵六' },
              { id: 2, value: '90' },
            ],
          },
        ],
        formula: '=COUNTIF(B2:B5, ">=90")',
        result: '2',
      },
      nested: {
        data: [
          {
            id: 1,
            cells: [
              { id: 1, value: 'A' },
              { id: 2, value: 'B' },
            ],
          },
          {
            id: 2,
            cells: [
              { id: 1, value: '销售部' },
              { id: 2, value: '10' },
            ],
          },
          {
            id: 3,
            cells: [
              { id: 1, value: '技术部' },
              { id: 2, value: '8' },
            ],
          },
          {
            id: 4,
            cells: [
              { id: 1, value: '销售部' },
              { id: 2, value: '12' },
            ],
          },
        ],
        formula: '=COUNTIF(A2:A4, "销售部") * COUNTIF(B2:B4, ">10")',
        result: '2',
      },
      real: {
        data: [
          {
            id: 1,
            cells: [
              { id: 1, value: 'A' },
              { id: 2, value: 'B' },
            ],
          },
          {
            id: 2,
            cells: [
              { id: 1, value: '已完成' },
              { id: 2, value: '任务1' },
            ],
          },
          {
            id: 3,
            cells: [
              { id: 1, value: '进行中' },
              { id: 2, value: '任务2' },
            ],
          },
          {
            id: 4,
            cells: [
              { id: 1, value: '已完成' },
              { id: 2, value: '任务3' },
            ],
          },
          {
            id: 5,
            cells: [
              { id: 1, value: '已完成' },
              { id: 2, value: '任务4' },
            ],
          },
        ],
        formula: '=COUNTIF(A2:A5, "已完成")',
        result: '3',
      },
    },
  },
  {
    id: '5',
    name: 'CONCATENATE',
    formula: '=CONCATENATE(text1, text2, ...)',
    description:
      '将多个文本字符串合并为一个字符串。例如，可以将名字和姓氏合并成全名。',
    tags: ['文本处理'],
    difficulty: 'beginner',
    examples: {
      basic: {
        data: [
          {
            id: 1,
            cells: [
              { id: 1, value: 'A' },
              { id: 2, value: 'B' },
              { id: 3, value: 'C' },
            ],
          },
          {
            id: 2,
            cells: [
              { id: 1, value: '张' },
              { id: 2, value: '三' },
              { id: 3, value: '25' },
            ],
          },
          {
            id: 3,
            cells: [
              { id: 1, value: '李' },
              { id: 2, value: '四' },
              { id: 3, value: '30' },
            ],
          },
        ],
        formula: '=CONCATENATE(A2, B2)',
        result: '张三',
      },
      advanced: {
        data: [
          {
            id: 1,
            cells: [
              { id: 1, value: 'A' },
              { id: 2, value: 'B' },
              { id: 3, value: 'C' },
            ],
          },
          {
            id: 2,
            cells: [
              { id: 1, value: '张' },
              { id: 2, value: '三' },
              { id: 3, value: '25' },
            ],
          },
          {
            id: 3,
            cells: [
              { id: 1, value: '李' },
              { id: 2, value: '四' },
              { id: 3, value: '30' },
            ],
          },
        ],
        formula: '=CONCATENATE(A2, B2, "，", C3, "岁")',
        result: '张三，30岁',
      },
      nested: {
        data: [
          {
            id: 1,
            cells: [
              { id: 1, value: 'A' },
              { id: 2, value: 'B' },
              { id: 3, value: 'C' },
            ],
          },
          {
            id: 2,
            cells: [
              { id: 1, value: '张' },
              { id: 2, value: '三' },
              { id: 3, value: '25' },
            ],
          },
          {
            id: 3,
            cells: [
              { id: 1, value: '李' },
              { id: 2, value: '四' },
              { id: 3, value: '30' },
            ],
          },
        ],
        formula: '=CONCATENATE(A2, B2, "-", YEAR(TODAY()))',
        result: '张三-2026',
      },
      real: {
        data: [
          {
            id: 1,
            cells: [
              { id: 1, value: 'A' },
              { id: 2, value: 'B' },
              { id: 3, value: 'C' },
            ],
          },
          {
            id: 2,
            cells: [
              { id: 1, value: '张' },
              { id: 2, value: '三' },
              { id: 3, value: '北京' },
            ],
          },
          {
            id: 3,
            cells: [
              { id: 1, value: '李' },
              { id: 2, value: '四' },
              { id: 3, value: '上海' },
            ],
          },
        ],
        formula: '=CONCATENATE(A2, B2, "(", C2, ")")',
        result: '张三(北京)',
      },
    },
  },
  {
    id: '6',
    name: 'IF',
    formula: '=IF(logical_test, value_if_true, value_if_false)',
    description:
      '根据条件返回不同的值。是Excel中最常用的函数之一，可以实现逻辑判断和条件运算。',
    tags: ['逻辑'],
    difficulty: 'intermediate',
    examples: {
      basic: {
        data: [
          {
            id: 1,
            cells: [
              { id: 1, value: 'A' },
              { id: 2, value: 'B' },
              { id: 3, value: 'C' },
            ],
          },
          {
            id: 2,
            cells: [
              { id: 1, value: '85' },
              { id: 2, value: '90' },
              { id: 3, value: '78' },
            ],
          },
        ],
        formula: '=IF(A2>=90, "优秀", "良好")',
        result: '良好',
      },
      advanced: {
        data: [
          {
            id: 1,
            cells: [
              { id: 1, value: 'A' },
              { id: 2, value: 'B' },
              { id: 3, value: 'C' },
            ],
          },
          {
            id: 2,
            cells: [
              { id: 1, value: '85' },
              { id: 2, value: '90' },
              { id: 3, value: '78' },
            ],
          },
        ],
        formula: '=IF(A2>=90, "优秀", IF(A2>=80, "良好", "及格"))',
        result: '良好',
      },
      nested: {
        data: [
          {
            id: 1,
            cells: [
              { id: 1, value: 'A' },
              { id: 2, value: 'B' },
              { id: 3, value: 'C' },
              { id: 4, value: 'D' },
            ],
          },
          {
            id: 2,
            cells: [
              { id: 1, value: '张三' },
              { id: 2, value: '销售部' },
              { id: 3, value: '10000' },
              { id: 4, value: '95' },
            ],
          },
          {
            id: 3,
            cells: [
              { id: 1, value: '李四' },
              { id: 2, value: '技术部' },
              { id: 3, value: '12000' },
              { id: 4, value: '88' },
            ],
          },
        ],
        formula: '=IF(AND(B2="销售部", C2>10000), "达标", "未达标")',
        result: '达标',
      },
      real: {
        data: [
          {
            id: 1,
            cells: [
              { id: 1, value: 'A' },
              { id: 2, value: 'B' },
              { id: 3, value: 'C' },
            ],
          },
          {
            id: 2,
            cells: [
              { id: 1, value: '100' },
              { id: 2, value: '200' },
              { id: 3, value: '50' },
            ],
          },
          {
            id: 3,
            cells: [
              { id: 1, value: '150' },
              { id: 2, value: '300' },
              { id: 3, value: '75' },
            ],
          },
        ],
        formula: '=IF(SUM(A2:A3)>300, "库存充足", "需要补货")',
        result: '需要补货',
      },
    },
  },
  {
    id: '7',
    name: 'MID',
    formula: '=MID(text, start_num, num_chars)',
    description:
      '从文本字符串中返回从指定位置开始的指定数量的字符。常用于提取身份证号中的出生日期、产品编码等。',
    tags: ['文本处理'],
    difficulty: 'intermediate',
    examples: {
      basic: {
        data: [
          {
            id: 1,
            cells: [
              { id: 1, value: 'A' },
              { id: 2, value: 'B' },
            ],
          },
          {
            id: 2,
            cells: [
              { id: 1, value: 'Excel函数助手' },
              { id: 2, value: '' },
            ],
          },
        ],
        formula: '=MID(A2, 1, 5)',
        result: 'Excel',
      },
      advanced: {
        data: [
          {
            id: 1,
            cells: [
              { id: 1, value: 'A' },
              { id: 2, value: 'B' },
            ],
          },
          {
            id: 2,
            cells: [
              { id: 1, value: 'Excel函数助手' },
              { id: 2, value: '' },
            ],
          },
        ],
        formula: '=MID(A2, FIND("函数", A2), 2)',
        result: '函数',
      },
      nested: {
        data: [
          {
            id: 1,
            cells: [
              { id: 1, value: 'A' },
              { id: 2, value: 'B' },
            ],
          },
          {
            id: 2,
            cells: [
              { id: 1, value: 'Excel函数助手' },
              { id: 2, value: '' },
            ],
          },
        ],
        formula: '=UPPER(MID(A2, 1, 5))',
        result: 'EXCEL',
      },
      real: {
        data: [
          {
            id: 1,
            cells: [
              { id: 1, value: 'A' },
              { id: 2, value: 'B' },
            ],
          },
          {
            id: 2,
            cells: [
              { id: 1, value: '420105199005011234' },
              { id: 2, value: '' },
            ],
          },
        ],
        formula: '=MID(A2, 7, 8)',
        result: '19900501',
      },
    },
  },
  {
    id: '8',
    name: 'TODAY',
    formula: '=TODAY()',
    description:
      '返回当前日期。不包含时间部分。常用于计算日期间隔、计算截止日期等场景。',
    tags: ['日期时间'],
    difficulty: 'beginner',
    examples: {
      basic: {
        data: [
          {
            id: 1,
            cells: [
              { id: 1, value: 'A' },
              { id: 2, value: 'B' },
            ],
          },
          {
            id: 2,
            cells: [
              { id: 1, value: '当前日期' },
              { id: 2, value: '=TODAY()' },
            ],
          },
        ],
        formula: '=TODAY()',
        result: '2026-03-28',
      },
      advanced: {
        data: [
          {
            id: 1,
            cells: [
              { id: 1, value: 'A' },
              { id: 2, value: 'B' },
              { id: 3, value: 'C' },
            ],
          },
          {
            id: 2,
            cells: [
              { id: 1, value: '开始日期' },
              { id: 2, value: '结束日期' },
              { id: 3, value: '天数' },
            ],
          },
          {
            id: 3,
            cells: [
              { id: 1, value: '2026-03-01' },
              { id: 2, value: '2026-03-28' },
              { id: 3, value: '=B2-A2' },
            ],
          },
        ],
        formula: '=TODAY()-A2',
        result: '27',
      },
      nested: {
        data: [
          {
            id: 1,
            cells: [
              { id: 1, value: 'A' },
              { id: 2, value: 'B' },
            ],
          },
          {
            id: 2,
            cells: [
              { id: 1, value: '当前日期' },
              { id: 2, value: '=TEXT(TODAY(), "yyyy-mm-dd")' },
            ],
          },
        ],
        formula: '=TEXT(TODAY(), "yyyy年mm月dd日")',
        result: '2026年03月28日',
      },
      real: {
        data: [
          {
            id: 1,
            cells: [
              { id: 1, value: 'A' },
              { id: 2, value: 'B' },
            ],
          },
          {
            id: 2,
            cells: [
              { id: 1, value: '当前日期' },
              { id: 2, value: '=IF(WEEKDAY(TODAY())=1, "周一", WEEKDAY(TODAY(),2))' },
            ],
          },
        ],
        formula: '=IF(WEEKDAY(TODAY())=6, "周六", IF(WEEKDAY(TODAY())=7, "周日", "工作日"))',
        result: '工作日',
      },
    },
  },
]

// 学习路径数据
export const learningPaths: LearningPath[] = [
  {
    id: 'beginner',
    name: '新手入门',
    description: '从零开始学习Excel公式，适合完全的新手',
    difficulty: 'beginner',
    formulaIds: ['2', '4', '5', '8'],
    estimatedTime: 30,
  },
  {
    id: 'intermediate',
    name: '进阶提升',
    description: '掌握常用公式，提升工作效率',
    difficulty: 'intermediate',
    formulaIds: ['1', '6', '7'],
    estimatedTime: 45,
  },
  {
    id: 'advanced',
    name: '高级精通',
    description: '精通公式组合，解决复杂问题',
    difficulty: 'advanced',
    formulaIds: ['3'],
    estimatedTime: 30,
  },
]

// 练习题数据
export const practices: Practice[] = [
  {
    id: '1',
    task: '使用VLOOKUP查找"苹果"的数量',
    example: {
      data: [
        { id: 1, cells: [{ id: 1, value: 'A' }, { id: 2, value: 'B' }] },
        { id: 2, cells: [{ id: 1, value: '苹果' }, { id: 2, value: '5' }] },
        { id: 3, cells: [{ id: 1, value: '香蕉' }, { id: 2, value: '3' }] },
      ],
    },
    answer: '=VLOOKUP("苹果", A2:B3, 2, FALSE)',
    difficulty: 'intermediate',
  },
  {
    id: '2',
    task: '使用SUMIF计算"苹果"类别的总销量',
    example: {
      data: [
        { id: 1, cells: [{ id: 1, value: 'A' }, { id: 2, value: 'B' }] },
        { id: 2, cells: [{ id: 1, value: '苹果' }, { id: 2, value: '10' }] },
        { id: 3, cells: [{ id: 1, value: '蔬菜' }, { id: 2, value: '5' }] },
        { id: 4, cells: [{ id: 1, value: '苹果' }, { id: 2, value: '15' }] },
      ],
    },
    answer: '=SUMIF(A2:A4, "苹果", B2:B4)',
    difficulty: 'beginner',
  },
  {
    id: '3',
    task: '使用COUNTIF统计"苹果"出现的次数',
    example: {
      data: [
        { id: 1, cells: [{ id: 1, value: 'A' }, { id: 2, value: 'B' }] },
        { id: 2, cells: [{ id: 1, value: '苹果' }, { id: 2, value: '5' }] },
        { id: 3, cells: [{ id: 1, value: '香蕉' }, { id: 2, value: '3' }] },
        { id: 4, cells: [{ id: 1, value: '苹果' }, { id: 2, value: '2' }] },
      ],
    },
    answer: '=COUNTIF(A2:A4, "苹果")',
    difficulty: 'beginner',
  },
  {
    id: '4',
    task: '使用INDEX+MATCH组合查找"产品A"的利润',
    example: {
      data: [
        {
          id: 1,
          cells: [
            { id: 1, value: 'A' },
            { id: 2, value: 'B' },
            { id: 3, value: 'C' },
          ],
        },
        {
          id: 2,
          cells: [
            { id: 1, value: '产品A' },
            { id: 2, value: '100' },
            { id: 3, value: '20' },
          ],
        },
        {
          id: 3,
          cells: [
            { id: 1, value: '产品B' },
            { id: 2, value: '200' },
            { id: 3, value: '40' },
          ],
        },
      ],
    },
    answer: '=INDEX(C2:C3, MATCH("产品A", A2:A3, 0))',
    difficulty: 'advanced',
  },
  {
    id: '5',
    task: '使用VLOOKUP查找"张三"所属的部门',
    example: {
      data: [
        {
          id: 1,
          cells: [
            { id: 1, value: 'A' },
            { id: 2, value: 'B' },
            { id: 3, value: 'C' },
          ],
        },
        {
          id: 2,
          cells: [
            { id: 1, value: '001' },
            { id: 2, value: '张三' },
            { id: 3, value: '销售部' },
          ],
        },
        {
          id: 3,
          cells: [
            { id: 1, value: '002' },
            { id: 2, value: '李四' },
            { id: 3, value: '技术部' },
          ],
        },
      ],
    },
    answer: '=VLOOKUP("张三", B2:C3, 2, FALSE)',
    difficulty: 'intermediate',
  },
  {
    id: '6',
    task: '使用SUMIF计算"销售部"的奖金总额（每人奖金=销售额*10%）',
    example: {
      data: [
        {
          id: 1,
          cells: [
            { id: 1, value: 'A' },
            { id: 2, value: 'B' },
            { id: 3, value: 'C' },
          ],
        },
        {
          id: 2,
          cells: [
            { id: 1, value: '张三' },
            { id: 2, value: '销售部' },
            { id: 3, value: '10000' },
          ],
        },
        {
          id: 3,
          cells: [
            { id: 1, value: '李四' },
            { id: 2, value: '销售部' },
            { id: 3, value: '15000' },
          ],
        },
        {
          id: 4,
          cells: [
            { id: 1, value: '王五' },
            { id: 2, value: '技术部' },
            { id: 3, value: '12000' },
          ],
        },
      ],
    },
    answer: '=SUMIF(B2:B4, "销售部", C2:C4) * 0.1',
    difficulty: 'beginner',
  },
  {
    id: '7',
    task: '使用CONCATENATE合并姓和名',
    example: {
      data: [
        { id: 1, cells: [{ id: 1, value: 'A' }, { id: 2, value: 'B' }] },
        { id: 2, cells: [{ id: 1, value: '张' }, { id: 2, value: '三' }] },
      ],
    },
    answer: '=CONCATENATE(A2, B2)',
    difficulty: 'beginner',
  },
  {
    id: '8',
    task: '使用IF函数判断分数是否及格（>=60为及格）',
    example: {
      data: [
        { id: 1, cells: [{ id: 1, value: 'A' }, { id: 2, value: 'B' }] },
        { id: 2, cells: [{ id: 1, value: '85' }, { id: 2, value: '及格' }] },
      ],
    },
    answer: '=IF(A2>=60, "及格", "不及格")',
    difficulty: 'intermediate',
  },
  {
    id: '9',
    task: '使用MID从身份证号中提取出生日期（假设格式：420105199005011234）',
    example: {
      data: [
        { id: 1, cells: [{ id: 1, value: 'A' }] },
        { id: 2, cells: [{ id: 1, value: '420105199005011234' }] },
      ],
    },
    answer: '=MID(A2, 7, 8)',
    difficulty: 'intermediate',
  },
  {
    id: '10',
    task: '使用TODAY返回当前日期',
    example: {
      data: [
        { id: 1, cells: [{ id: 1, value: 'A' }, { id: 2, value: 'B' }] },
        { id: 2, cells: [{ id: 1, value: '当前日期' }, { id: 2, value: '' }] },
      ],
    },
    answer: '=TODAY()',
    difficulty: 'beginner',
  },
]

// 实战案例数据
export const realCases: RealCase[] = [
  {
    id: '1',
    title: 'HR考勤统计',
    industry: '人力资源',
    scenario: '统计员工出勤天数、迟到次数和出勤率',
    dataTemplate: '员工打卡记录表（员工ID、日期、打卡时间）',
    steps: [
      {
        step: 1,
        description: '提取打卡时间的小时部分',
        formula: '=HOUR(B2)',
        explanation: '使用HOUR函数从打卡时间中提取小时',
      },
      {
        step: 2,
        description: '统计迟到次数（打卡时间 > 9:00）',
        formula: '=COUNTIF(C:C, ">9:00")',
        explanation: '使用COUNTIF统计9点以后打卡的次数',
      },
      {
        step: 3,
        description: '计算出勤天数（打卡时间在8:00-18:00之间）',
        formula: '=COUNTIFS(C:C, ">=8:00", C:C, "<=18:00")',
        explanation: '使用COUNTIFS多条件统计符合工作时间的天数',
      },
    ],
  },
  {
    id: '2',
    title: '销售业绩分析',
    industry: '销售',
    scenario: '统计各产品类别的销售总额和排名',
    dataTemplate: '销售记录表（日期、产品类别、销售额、销售员）',
    steps: [
      {
        step: 1,
        description: '统计每个产品类别的销售总额',
        formula: '=SUMIF(B:B, "电子产品", C:C)',
        explanation: '使用SUMIF按产品类别汇总销售额',
      },
      {
        step: 2,
        description: '统计销售员业绩',
        formula: '=SUMIF(D:D, "张三", C:C)',
        explanation: '使用SUMIF按销售员汇总业绩',
      },
      {
        step: 3,
        description: '计算排名',
        formula: '=RANK(C2, C:C, 0)',
        explanation: '使用RANK函数计算销售额在所有销售额中的排名',
      },
    ],
  },
  {
    id: '3',
    title: '库存管理',
    industry: '仓储物流',
    scenario: '统计库存数量、预警缺货产品',
    dataTemplate: '库存记录表（产品ID、产品名称、当前库存、最低库存）',
    steps: [
      {
        step: 1,
        description: '标记库存不足的产品',
        formula: '=IF(C2<D2, "缺货", "充足")',
        explanation: '使用IF函数判断当前库存是否低于最低库存',
      },
      {
        step: 2,
        description: '统计缺货产品数量',
        formula: '=COUNTIF(E:E, "缺货")',
        explanation: '使用COUNTIF统计标记为缺货的产品数量',
      },
      {
        step: 3,
        description: '计算库存周转率',
        formula: '=SUM(C:C)/AVERAGE(C:C)',
        explanation: '计算总库存与平均库存的比值',
      },
    ],
  },
]

// 公式组合数据
export const formulaCombinations: FormulaCombination[] = [
  {
    id: '1',
    name: 'INDEX+MATCH组合',
    description: '比VLOOKUP更灵活的查找方式，可以从任意方向查找',
    formulas: ['3'],
    combinedFormula: '=INDEX(C2:C3, MATCH("产品A", A2:A3, 0))',
    example: {
      data: [
        {
          id: 1,
          cells: [
            { id: 1, value: 'A' },
            { id: 2, value: 'B' },
            { id: 3, value: 'C' },
          ],
        },
        {
          id: 2,
          cells: [
            { id: 1, value: '产品A' },
            { id: 2, value: '100' },
            { id: 3, value: '200' },
          ],
        },
        {
          id: 3,
          cells: [
            { id: 1, value: '产品B' },
            { id: 2, value: '150' },
            { id: 3, value: '250' },
          ],
        },
      ],
      formula: '=INDEX(C2:C3, MATCH("产品A", A2:A3, 0))',
      result: '200',
    },
    useCase: '需要反向查找或查找结果在查找值左侧时',
    advantage: '可以左右查找，不受列序限制，灵活性更强',
  },
  {
    id: '2',
    name: 'IF+SUMIF组合',
    description: '多条件判断并求和',
    formulas: ['6', '2'],
    combinedFormula: '=IF(SUMIF(B:B, "销售部", C:C)>10000, "达标", "未达标")',
    example: {
      data: [
        {
          id: 1,
          cells: [
            { id: 1, value: 'A' },
            { id: 2, value: 'B' },
            { id: 3, value: 'C' },
          ],
        },
        {
          id: 2,
          cells: [
            { id: 1, value: '张三' },
            { id: 2, value: '销售部' },
            { id: 3, value: '8000' },
          ],
        },
        {
          id: 3,
          cells: [
            { id: 1, value: '李四' },
            { id: 2, value: '销售部' },
            { id: 3, value: '12000' },
          ],
        },
      ],
      formula: '=IF(SUMIF(B:B, "销售部", C:C)>10000, "达标", "未达标")',
      result: '达标',
    },
    useCase: '需要根据条件求和的结果进行判断',
    advantage: '实现条件求和+结果判断，一次性完成复杂逻辑',
  },
  {
    id: '3',
    name: 'IF+AND组合',
    description: '多条件逻辑判断',
    formulas: ['6'],
    combinedFormula: '=IF(AND(A2>60, B2>60), "合格", "不合格")',
    example: {
      data: [
        {
          id: 1,
          cells: [
            { id: 1, value: 'A' },
            { id: 2, value: 'B' },
            { id: 3, value: 'C' },
          ],
        },
        {
          id: 2,
          cells: [
            { id: 1, value: '85' },
            { id: 2, value: '90' },
            { id: 3, value: '合格' },
          ],
        },
        {
          id: 3,
          cells: [
            { id: 1, value: '75' },
            { id: 2, value: '55' },
            { id: 3, value: '不合格' },
          ],
        },
      ],
      formula: '=IF(AND(A2>60, B2>60), "合格", "不合格")',
      result: '合格',
    },
    useCase: '需要同时满足多个条件时才返回某个结果',
    advantage: 'AND函数确保所有条件都满足，逻辑更严谨',
  },
  // ========== 更多文本处理函数 ==========
  {
    id: 'left-001',
    name: 'LEFT',
    formula: '=LEFT(text, num_chars)',
    description: '从文本左侧开始提取指定数量的字符。常用于提取姓氏、区域代码等。',
    tags: ['文本处理'],
    difficulty: 'beginner',
    examples: {
      basic: {
        data: [
          { id: 1, cells: [{ id: 1, value: 'A' }, { id: 2, value: 'B' }] },
          { id: 2, cells: [{ id: 1, value: 'Excel函数助手' }, { id: 2, value: '' }] },
        ],
        formula: '=LEFT(A2, 5)',
        result: 'Excel',
      },
      advanced: {
        data: [
          { id: 1, cells: [{ id: 1, value: 'A' }, { id: 2, value: 'B' }] },
          { id: 2, cells: [{ id: 1, value: '张三丰' }, { id: 2, value: '' }] },
        ],
        formula: '=LEFT(A2, 1)',
        result: '张',
      },
      nested: {
        data: [
          { id: 1, cells: [{ id: 1, value: 'A' }, { id: 2, value: 'B' }] },
          { id: 2, cells: [{ id: 1, value: 'Excel' }, { id: 2, value: '' }] },
        ],
        formula: '=LEFT(A2, 2)&LEFT(A2, 1)',
        result: 'ExE',
      },
      real: {
        data: [
          { id: 1, cells: [{ id: 1, value: 'A' }, { id: 2, value: 'B' }] },
          { id: 2, cells: [{ id: 1, value: 'H-12345' }, { id: 2, value: '' }] },
        ],
        formula: '=LEFT(A2, 1)',
        result: 'H',
      },
    },
  },
  {
    id: 'right-001',
    name: 'RIGHT',
    formula: '=RIGHT(text, num_chars)',
    description: '从文本右侧开始提取指定数量的字符。常用于提取后缀、扩展名等。',
    tags: ['文本处理'],
    difficulty: 'beginner',
    examples: {
      basic: {
        data: [
          { id: 1, cells: [{ id: 1, value: 'A' }, { id: 2, value: 'B' }] },
          { id: 2, cells: [{ id: 1, value: 'Excel函数助手' }, { id: 2, value: '' }] },
        ],
        formula: '=RIGHT(A2, 2)',
        result: '手',
      },
      advanced: {
        data: [
          { id: 1, cells: [{ id: 1, value: 'A' }, { id: 2, value: 'B' }] },
          { id: 2, cells: [{ id: 1, value: '张三丰' }, { id: 2, value: '' }] },
        ],
        formula: '=RIGHT(A2, 1)',
        result: '丰',
      },
      nested: {
        data: [
          { id: 1, cells: [{ id: 1, value: 'A' }, { id: 2, value: 'B' }] },
          { id: 2, cells: [{ id: 1, value: 'data.xlsx' }, { id: 2, value: '' }] },
        ],
        formula: '=RIGHT(A2, LEN(A2)-FIND(".", A2))',
        result: 'xlsx',
      },
      real: {
        data: [
          { id: 1, cells: [{ id: 1, value: 'A' }, { id: 2, value: 'B' }] },
          { id: 2, cells: [{ id: 1, value: 'P-12345' }, { id: 2, value: '' }] },
        ],
        formula: '=RIGHT(A2, 5)',
        result: '12345',
      },
    },
  },
  {
    id: 'len-001',
    name: 'LEN',
    formula: '=LEN(text)',
    description: '返回文本字符串的字符数。常用于验证数据长度、限制输入长度等。',
    tags: ['文本处理'],
    difficulty: 'beginner',
    examples: {
      basic: {
        data: [
          { id: 1, cells: [{ id: 1, value: 'A' }, { id: 2, value: 'B' }] },
          { id: 2, cells: [{ id: 1, value: 'Excel' }, { id: 2, value: '' }] },
        ],
        formula: '=LEN(A2)',
        result: '5',
      },
      advanced: {
        data: [
          { id: 1, cells: [{ id: 1, value: 'A' }, { id: 2, value: 'B' }] },
          { id: 2, cells: [{ id: 1, value: '张三' }, { id: 2, value: '' }] },
        ],
        formula: '=LEN(A2)',
        result: '2',
      },
      nested: {
        data: [
          { id: 1, cells: [{ id: 1, value: 'A' }, { id: 2, value: 'B' }] },
          { id: 2, cells: [{ id: 1, value: 'Excel' }, { id: 2, value: '' }] },
        ],
        formula: '=IF(LEN(A2)>5, "太长", "正常")',
        result: '正常',
      },
      real: {
        data: [
          { id: 1, cells: [{ id: 1, value: 'A' }, { id: 2, value: 'B' }] },
          { id: 2, cells: [{ id: 1, value: '420105199005011234' }, { id: 2, value: '' }] },
        ],
        formula: '=LEN(A2)',
        result: '18',
      },
    },
  },
  // ========== 更多逻辑函数 ==========
  {
    id: 'and-001',
    name: 'AND',
    formula: '=AND(logical1, logical2, ...)',
    description: '与运算。当所有条件都为TRUE时返回TRUE，否则返回FALSE。常用于多条件判断。',
    tags: ['逻辑'],
    difficulty: 'beginner',
    examples: {
      basic: {
        data: [
          { id: 1, cells: [{ id: 1, value: 'A' }, { id: 2, value: 'B' }] },
          { id: 2, cells: [{ id: 1, value: '85' }, { id: 2, value: '90' }] },
        ],
        formula: '=AND(A2>=60, B2>=60)',
        result: 'TRUE',
      },
      advanced: {
        data: [
          { id: 1, cells: [{ id: 1, value: 'A' }, { id: 2, value: 'B' }, { id: 3, value: 'C' }] },
          { id: 2, cells: [{ id: 1, value: '85' }, { id: 2, value: '90' }, { id: 3, value: '' }] },
        ],
        formula: '=IF(AND(A2>=60, B2>=60), "合格", "不合格")',
        result: '合格',
      },
      nested: {
        data: [
          { id: 1, cells: [{ id: 1, value: 'A' }, { id: 2, value: 'B' }, { id: 3, value: 'C' }] },
          { id: 2, cells: [{ id: 1, value: '85' }, { id: 2, value: '90' }, { id: 3, value: '95' }] },
        ],
        formula: '=AND(AND(A2>=60, B2>=60), C2>=60)',
        result: 'TRUE',
      },
      real: {
        data: [
          { id: 1, cells: [{ id: 1, value: 'A' }, { id: 2, value: 'B' }, { id: 3, value: 'C' }] },
          { id: 2, cells: [{ id: 1, value: '销售部' }, { id: 2, value: '8000' }, { id: 3, value: '10' }] },
        ],
        formula: '=IF(AND(B2>5000, C2>5), "达标", "未达标")',
        result: '达标',
      },
    },
  },
  {
    id: 'or-001',
    name: 'OR',
    formula: '=OR(logical1, logical2, ...)',
    description: '或运算。当任意一个条件为TRUE时返回TRUE。常用于多条件任一满足的情况。',
    tags: ['逻辑'],
    difficulty: 'beginner',
    examples: {
      basic: {
        data: [
          { id: 1, cells: [{ id: 1, value: 'A' }, { id: 2, value: 'B' }] },
          { id: 2, cells: [{ id: 1, value: '85' }, { id: 2, value: '55' }] },
        ],
        formula: '=OR(A2>=60, B2>=60)',
        result: 'TRUE',
      },
      advanced: {
        data: [
          { id: 1, cells: [{ id: 1, value: 'A' }, { id: 2, value: 'B' }, { id: 3, value: 'C' }] },
          { id: 2, cells: [{ id: 1, value: '85' }, { id: 2, value: '55' }, { id: 3, value: '' }] },
        ],
        formula: '=IF(OR(A2>=90, B2>=90), "优秀", "良好")',
        result: '良好',
      },
      nested: {
        data: [
          { id: 1, cells: [{ id: 1, value: 'A' }, { id: 2, value: 'B' }, { id: 3, value: 'C' }] },
          { id: 2, cells: [{ id: 1, value: '85' }, { id: 2, value: '55' }, { id: 3, value: '95' }] },
        ],
        formula: '=OR(OR(A2>=60, B2>=60), C2>=60)',
        result: 'TRUE',
      },
      real: {
        data: [
          { id: 1, cells: [{ id: 1, value: 'A' }, { id: 2, value: 'B' }, { id: 3, value: 'C' }] },
          { id: 2, cells: [{ id: 1, value: '销售部' }, { id: 2, value: '技术部' }, { id: 3, value: '' }] },
        ],
        formula: '=IF(OR(A2="销售部", B2="技术部"), "核心部门", "其他部门")',
        result: '核心部门',
      },
    },
  },
  {
    id: 'iferror-001',
    name: 'IFERROR',
    formula: '=IFERROR(value, value_if_error)',
    description: '错误处理。如果第一个参数返回错误，则返回第二个参数。常用于容错处理。',
    tags: ['逻辑'],
    difficulty: 'intermediate',
    examples: {
      basic: {
        data: [
          { id: 1, cells: [{ id: 1, value: 'A' }, { id: 2, value: 'B' }] },
          { id: 2, cells: [{ id: 1, value: '5' }, { id: 2, value: '' }] },
        ],
        formula: '=IFERROR(10/A2, "错误")',
        result: '2',
      },
      advanced: {
        data: [
          { id: 1, cells: [{ id: 1, value: 'A' }, { id: 2, value: 'B' }, { id: 3, value: 'C' }] },
          { id: 2, cells: [{ id: 1, value: '100' }, { id: 2, value: '50' }, { id: 3, value: '' }] },
        ],
        formula: '=IFERROR(A2/B2, 0)',
        result: '2',
      },
      nested: {
        data: [
          { id: 1, cells: [{ id: 1, value: 'A' }, { id: 2, value: 'B' }, { id: 3, value: 'C' }] },
          { id: 2, cells: [{ id: 1, value: '100' }, { id: 2, value: '50' }, { id: 3, value: '' }] },
        ],
        formula: '=IFERROR(A2/B2, IFERROR(A2*C2, "计算错误"))',
        result: '2',
      },
      real: {
        data: [
          { id: 1, cells: [{ id: 1, value: 'A' }, { id: 2, value: 'B' }, { id: 3, value: 'C' }] },
          { id: 2, cells: [{ id: 1, value: '001' }, { id: 2, value: '张三' }, { id: 3, value: '' }] },
        ],
        formula: '=IFERROR(VLOOKUP(A2, 数据表, 2, FALSE), "未找到")',
        result: '未找到',
      },
    },
  },
  // ========== 更多日期时间函数 ==========
  {
    id: 'year-001',
    name: 'YEAR',
    formula: '=YEAR(serial_number)',
    description: '年份。从日期中提取年份部分。',
    tags: ['日期时间'],
    difficulty: 'beginner',
    examples: {
      basic: {
        data: [
          { id: 1, cells: [{ id: 1, value: 'A' }, { id: 2, value: 'B' }] },
          { id: 2, cells: [{ id: 1, value: '2026-03-28' }, { id: 2, value: '' }] },
        ],
        formula: '=YEAR(A2)',
        result: '2026',
      },
      advanced: {
        data: [
          { id: 1, cells: [{ id: 1, value: 'A' }, { id: 2, value: 'B' }] },
          { id: 2, cells: [{ id: 1, value: '2026-03-28' }, { id: 2, value: '' }] },
        ],
        formula: '=YEAR(A2)&"年"',
        result: '2026年',
      },
      nested: {
        data: [
          { id: 1, cells: [{ id: 1, value: 'A' }, { id: 2, value: 'B' }] },
          { id: 2, cells: [{ id: 1, value: '2026-03-28' }, { id: 2, value: '' }] },
        ],
        formula: '=IF(YEAR(A2)=2026, "本年度", "非本年度")',
        result: '本年度',
      },
      real: {
        data: [
          { id: 1, cells: [{ id: 1, value: 'A' }, { id: 2, value: 'B' }] },
          { id: 2, cells: [{ id: 1, value: '2026-03-28' }, { id: 2, value: '' }] },
        ],
        formula: '=YEAR(A2)',
        result: '2026',
      },
    },
  },
  {
    id: 'month-001',
    name: 'MONTH',
    formula: '=MONTH(serial_number)',
    description: '月份。从日期中提取月份部分（1-12）。',
    tags: ['日期时间'],
    difficulty: 'beginner',
    examples: {
      basic: {
        data: [
          { id: 1, cells: [{ id: 1, value: 'A' }, { id: 2, value: 'B' }] },
          { id: 2, cells: [{ id: 1, value: '2026-03-28' }, { id: 2, value: '' }] },
        ],
        formula: '=MONTH(A2)',
        result: '3',
      },
      advanced: {
        data: [
          { id: 1, cells: [{ id: 1, value: 'A' }, { id: 2, value: 'B' }] },
          { id: 2, cells: [{ id: 1, value: '2026-03-28' }, { id: 2, value: '' }] },
        ],
        formula: '=MONTH(A2)&"月"',
        result: '3月',
      },
      nested: {
        data: [
          { id: 1, cells: [{ id: 1, value: 'A' }, { id: 2, value: 'B' }] },
          { id: 2, cells: [{ id: 1, value: '2026-03-28' }, { id: 2, value: '' }] },
        ],
        formula: '=IF(MONTH(A2)>=3, "Q1", "其他季度")',
        result: 'Q1',
      },
      real: {
        data: [
          { id: 1, cells: [{ id: 1, value: 'A' }, { id: 2, value: 'B' }] },
          { id: 2, cells: [{ id: 1, value: '2026-03-28' }, { id: 2, value: '' }] },
        ],
        formula: '=MONTH(A2)',
        result: '3',
      },
    },
  },
  {
    id: 'day-001',
    name: 'DAY',
    formula: '=DAY(serial_number)',
    description: '日期。从日期中提取日期部分（1-31）。',
    tags: ['日期时间'],
    difficulty: 'beginner',
    examples: {
      basic: {
        data: [
          { id: 1, cells: [{ id: 1, value: 'A' }, { id: 2, value: 'B' }] },
          { id: 2, cells: [{ id: 1, value: '2026-03-28' }, { id: 2, value: '' }] },
        ],
        formula: '=DAY(A2)',
        result: '28',
      },
      advanced: {
        data: [
          { id: 1, cells: [{ id: 1, value: 'A' }, { id: 2, value: 'B' }] },
          { id: 2, cells: [{ id: 1, value: '2026-03-28' }, { id: 2, value: '' }] },
        ],
        formula: '=DAY(A2)&"日"',
        result: '28日',
      },
      nested: {
        data: [
          { id: 1, cells: [{ id: 1, value: 'A' }, { id: 2, value: 'B' }] },
          { id: 2, cells: [{ id: 1, value: '2026-03-28' }, { id: 2, value: '' }] },
        ],
        formula: '=IF(DAY(A2)<=15, "上半月", "下半月")',
        result: '下半月',
      },
      real: {
        data: [
          { id: 1, cells: [{ id: 1, value: 'A' }, { id: 2, value: 'B' }] },
          { id: 2, cells: [{ id: 1, value: '2026-03-28' }, { id: 2, value: '' }] },
        ],
        formula: '=DAY(A2)',
        result: '28',
      },
    },
  },
]

// 标签列表
export const tags = [
  '查找与引用',
  '数学与三角',
  '文本处理',
  '日期时间',
  '逻辑',
  '统计',
  '数据库',
]
