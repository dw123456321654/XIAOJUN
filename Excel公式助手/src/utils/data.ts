import type { Formula, Practice, LearningPath, RealCase, FormulaCombination } from '../types'

// 公式数据
export const formulas: Formula[] = [
  {
    id: '1',
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
