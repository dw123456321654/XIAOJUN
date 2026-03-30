/**
 * 公式组合数据
 * 包含10个常用公式组合，每个组合包含：
 * - 名称、描述
 * - 包含的公式
 * - 组合公式
 * - 优势说明
 * - 适用场景
 * - 性能对比数据
 * - 示例数据和公式
 * - 难度、常用度
 */

import type { FormulaCombination } from '../types'

export const formulaCombinations: FormulaCombination[] = [
  {
    id: 1,
    name: 'INDEX+MATCH 灵活查找',
    description: '比VLOOKUP更灵活的查找方式，支持任意方向查找和动态列号',
    formulas: ['INDEX', 'MATCH'],
    combinationFormula: '=INDEX(返回范围, MATCH(查找值, 查找范围, 0))',
    advantages: [
      '可以从右向左查找',
      '可以指定查找列，不一定是第一列',
      '性能比VLOOKUP好（快30-40%）',
      '支持动态列号查找',
      '可以处理数组公式'
    ],
    scenarios: [
      '需要反向查找时',
      '查找列不在数据表最左侧时',
      '大数据量查找',
      '需要动态指定返回列时',
      '多表合并查找'
    ],
    performance: {
      vsSingleFormula: '比VLOOKUP快30-40%',
      dataSize: '适合1000+行数据',
      loadTime: '比VLOOKUP减少20-30%'
    },
    difficulty: '中级',
    popularity: 5,
    example: {
      title: '根据工号查找员工姓名',
      data: {
        headers: ['姓名', '工号', '薪资'],
        rows: [
          ['张三', '001', 5000],
          ['李四', '002', 6000],
          ['王五', '003', 7000]
        ]
      },
      formula: '=INDEX(A2:A4, MATCH("002", B2:B4, 0))',
      explanation: '从B列查找"002"，返回A列对应的姓名',
      result: '李四'
    },
    practiceQuestions: [
      {
        question: '使用INDEX+MATCH根据产品ID查找产品名称',
        data: {
          headers: ['产品名称', '产品ID', '价格'],
          rows: [
            ['iPhone 15', 'P001', 5999],
            ['Mate 60', 'P002', 5499],
            ['小米14', 'P003', 4299]
          ]
        },
        formula: '=INDEX(A2:A4, MATCH("P002", B2:B4, 0))',
        answer: 'Mate 60',
        explanation: '从B列查找"P002"，返回A列的产品名称'
      },
      {
        question: '使用INDEX+MATCH根据销售额查找销售员',
        data: {
          headers: ['销售员', '产品', '销售额'],
          rows: [
            ['张三', 'iPhone 15', 50000],
            ['李四', 'Mate 60', 60000],
            ['王五', '小米14', 40000]
          ]
        },
        formula: '=INDEX(A2:A4, MATCH(60000, C2:C4, 0))',
        answer: '李四',
        explanation: '从C列查找60000，返回A列的销售员'
      },
      {
        question: '使用INDEX+MATCH根据城市查找人口',
        data: {
          headers: ['城市', '人口（万）', 'GDP（亿）'],
          rows: [
            ['北京', 2154, 41610],
            ['上海', 2428, 43215],
            ['广州', 1867, 28232]
          ]
        },
        formula: '=INDEX(A2:A4, MATCH(2428, B2:B4, 0))',
        answer: '上海',
        explanation: '从B列查找2428，返回A列的城市'
      }
    ]
  },
  {
    id: 2,
    name: 'IF+AND+OR 多条件判断',
    description: '支持多条件同时判断和多条件任一满足的复杂逻辑',
    formulas: ['IF', 'AND', 'OR'],
    combinationFormula: '=IF(AND(条件1, 条件2), 结果1, IF(OR(条件3, 条件4), 结果2, 结果3))',
    advantages: [
      '支持多条件同时判断',
      '支持多条件任一满足',
      '逻辑清晰易懂',
      '支持嵌套判断',
      '灵活组合各种条件'
    ],
    scenarios: [
      '综合评定（多门课都及格）',
      '多维度筛选（同时满足多个条件）',
      '复杂业务逻辑判断',
      '分类评级系统',
      '多条件审批流程'
    ],
    performance: {
      vsSingleFormula: '性能相当',
      dataSize: '适合任意大小数据',
      loadTime: '计算速度快'
    },
    difficulty: '初级',
    popularity: 5,
    example: {
      title: '根据两科成绩评定等级',
      data: {
        headers: ['姓名', '语文', '数学', '等级'],
        rows: [
          ['张三', 95, 92, ''],
          ['李四', 85, 78, ''],
          ['王五', 75, 68, '']
        ]
      },
      formula: '=IF(AND(B2>=90, C2>=90), "优秀", IF(OR(B2>=80, C2>=80), "良好", "及格"))',
      explanation: '两科都>=90为优秀，任一科>=80为良好，否则及格',
      result: '优秀'
    },
    practiceQuestions: [
      {
        question: '使用IF+AND判断是否达标（两科都>=60）',
        data: {
          headers: ['姓名', '语文', '数学', '是否达标'],
          rows: [
            ['张三', 75, 68, ''],
            ['李四', 55, 78, ''],
            ['王五', 65, 58, '']
          ]
        },
        formula: '=IF(AND(B2>=60, C2>=60), "达标", "不达标")',
        answer: '达标',
        explanation: '两科都>=60则为达标'
      },
      {
        question: '使用IF+OR判断是否需要补考（任一科<60）',
        data: {
          headers: ['姓名', '语文', '数学', '是否补考'],
          rows: [
            ['张三', 75, 68, ''],
            ['李四', 55, 78, ''],
            ['王五', 65, 58, '']
          ]
        },
        formula: '=IF(OR(B2<60, C2<60), "需要补考", "不需要")',
        answer: '不需要',
        explanation: '任一科<60则需要补考'
      },
      {
        question: '使用IF+AND+OR评定产品等级',
        data: {
          headers: ['产品', '销量', '好评率', '等级'],
          rows: [
            ['iPhone 15', 10000, 95, ''],
            ['Mate 60', 8000, 90, ''],
            ['小米14', 6000, 85, '']
          ]
        },
        formula: '=IF(AND(B2>=8000, C2>=90), "爆款", IF(OR(B2>=5000, C2>=85), "热门", "普通"))',
        answer: '爆款',
        explanation: '销量>=8000且好评率>=90为爆款'
      }
    ]
  },
  {
    id: 3,
    name: 'SUMIF+COUNTIF 条件统计',
    description: '灵活的条件统计组合，可以实现条件求和、条件计数、条件平均等',
    formulas: ['SUMIF', 'COUNTIF'],
    combinationFormula: '=SUMIF(条件范围, 条件, 求和范围)/COUNTIF(条件范围, 条件)',
    advantages: [
      '可以计算平均值',
      '支持多条件统计',
      '灵活组合多种方式',
      '语法简单易懂',
      '适合基础统计'
    ],
    scenarios: [
      '计算某部门的平均业绩',
      '计算某产品的平均销量',
      '统计特定条件的数据',
      '条件平均值计算',
      '分类统计汇总'
    ],
    performance: {
      vsSingleFormula: '性能相当',
      dataSize: '适合10000+行数据',
      loadTime: '计算速度快'
    },
    difficulty: '初级',
    popularity: 4,
    example: {
      title: '计算销售部的平均销售额',
      data: {
        headers: ['姓名', '部门', '销售额'],
        rows: [
          ['张三', '销售部', 10000],
          ['李四', '销售部', 12000],
          ['王五', '市场部', 8000],
          ['赵六', '销售部', 9000]
        ]
      },
      formula: '=SUMIF(B2:B5, "销售部", C2:C5)/COUNTIF(B2:B5, "销售部")',
      explanation: 'SUMIF计算销售部总销售额，COUNTIF计算销售部人数',
      result: 10333.33
    },
    practiceQuestions: [
      {
        question: '使用SUMIF+COUNTIF计算销售部的平均业绩',
        data: {
          headers: ['姓名', '部门', '业绩'],
          rows: [
            ['张三', '销售部', 100],
            ['李四', '销售部', 120],
            ['王五', '市场部', 80],
            ['赵六', '销售部', 90]
          ]
        },
        formula: '=SUMIF(B2:B5, "销售部", C2:C5)/COUNTIF(B2:B5, "销售部")',
        answer: 103.33,
        explanation: '销售部平均业绩 = (100+120+90)/3 = 103.33'
      },
      {
        question: '使用SUMIF+COUNTIF计算产品的平均价格',
        data: {
          headers: ['产品', '类别', '价格'],
          rows: [
            ['iPhone', '手机', 5999],
            ['iPad', '平板', 3299],
            ['MacBook', '电脑', 8999],
            ['AirPods', '耳机', 1299]
          ]
        },
        formula: '=SUMIF(B2:B5, "手机", C2:C5)/COUNTIF(B2:B5, "手机")',
        answer: 5999,
        explanation: '只有iPhone是手机类别，平均价格就是5999'
      },
      {
        question: '使用SUMIF+COUNTIF计算合格率',
        data: {
          headers: ['姓名', '成绩', '状态'],
          rows: [
            ['张三', 95, ''],
            ['李四', 55, ''],
            ['王五', 85, ''],
            ['赵六', 45, '']
          ]
        },
        formula: '=COUNTIF(B2:B5, ">=60")/COUNTA(B2:B5)',
        answer: '50%',
        explanation: '4人中有2人及格，合格率=50%'
      }
    ]
  },
  {
    id: 4,
    name: 'LEFT+MID+RIGHT 文本提取组合',
    description: '组合使用文本提取函数，从不同位置提取文本的各个部分',
    formulas: ['LEFT', 'MID', 'RIGHT'],
    combinationFormula: '=LEFT(文本, n) & MID(文本, n+1, m) & RIGHT(文本, k)',
    advantages: [
      '可以从任意位置提取文本',
      '支持拼接多个部分',
      '可以处理固定格式数据',
      '语法简单直观',
      '适合处理身份证、手机号等'
    ],
    scenarios: [
      '提取身份证号的各个部分',
      '从产品编码中提取信息',
      '从订单号中提取日期',
      '格式转换和重组',
      '数据清洗和标准化'
    ],
    performance: {
      vsSingleFormula: '性能相当',
      dataSize: '适合任意大小数据',
      loadTime: '计算速度快'
    },
    difficulty: '初级',
    popularity: 4,
    example: {
      title: '从身份证号提取出生日期',
      data: {
        headers: ['姓名', '身份证号', '出生日期'],
        rows: [
          ['张三', '110101199001011234', ''],
          ['李四', '310101198502025678', ''],
          ['王五', '420101199505038765', '']
        ]
      },
      formula: '=MID(B2, 7, 4) & "-" & MID(B2, 11, 2) & "-" & MID(B2, 13, 2)',
      explanation: '从第7位开始取4位（年），第11位取2位（月），第13位取2位（日）',
      result: '1990-01-01'
    },
    practiceQuestions: [
      {
        question: '使用LEFT+MID+RIGHT从手机号中提取区号',
        data: {
          headers: ['姓名', '手机号', '区号'],
          rows: [
            ['张三', '13812345678', ''],
            ['李四', '15987654321', ''],
            ['王五', '18655556666', '']
          ]
        },
        formula: '=LEFT(B2, 3)',
        answer: '138',
        explanation: '手机号前3位是区号'
      },
      {
        question: '使用MID从订单号中提取日期',
        data: {
          headers: ['订单号', '日期'],
          rows: [
            ['ORD20260329001', ''],
            ['ORD20260328002', ''],
            ['ORD20260327003', '']
          ]
        },
        formula: '=MID(A2, 4, 8)',
        answer: '20260329',
        explanation: '从第4位开始取8位（年月日）'
      },
      {
        question: '使用LEFT+RIGHT从产品编码中提取信息',
        data: {
          headers: ['产品编码', '类别', '编号'],
          rows: [
            ['PH-001-A', '', ''],
            ['TB-002-B', '', ''],
            ['LT-003-C', '', '']
          ]
        },
        formula: '=LEFT(A2, 2)',
        answer: 'PH',
        explanation: '产品编码前2位是类别'
      }
    ]
  },
  {
    id: 5,
    name: 'TODAY+YEAR+MONTH+DAY 日期提取组合',
    description: '从当前日期中提取年、月、日等信息，便于日期计算和统计',
    formulas: ['TODAY', 'YEAR', 'MONTH', 'DAY'],
    combinationFormula: '=YEAR(TODAY()) & "-" & MONTH(TODAY()) & "-" & DAY(TODAY())',
    advantages: [
      '可以获取当前日期',
      '可以提取日期的各个部分',
      '支持日期计算',
      '语法简单直观',
      '适合制作报表和看板'
    ],
    scenarios: [
      '动态日期显示',
      '按年月日统计数据',
      '计算日期差',
      '制作日期筛选',
      '生成时间戳'
    ],
    performance: {
      vsSingleFormula: '性能相当',
      dataSize: '适合任意大小数据',
      loadTime: '实时计算，速度快'
    },
    difficulty: '初级',
    popularity: 4,
    example: {
      title: '显示当前年月日',
      data: {
        headers: ['当前日期', '年份', '月份', '日期'],
        rows: [
          ['2026-03-29', '2026', '3', '29']
        ]
      },
      formula: '=YEAR(TODAY()) & "年" & MONTH(TODAY()) & "月" & DAY(TODAY()) & "日"',
      explanation: '从当前日期提取年、月、日并拼接',
      result: '2026年3月29日'
    },
    practiceQuestions: [
      {
        question: '使用YEAR+MONTH+DAY格式化当前日期',
        data: {
          headers: ['当前日期', '格式化日期'],
          rows: [
            ['2026-03-29', '']
          ]
        },
        formula: '=YEAR(A2) & "-" & MONTH(A2) & "-" & DAY(A2)',
        answer: '2026-3-29',
        explanation: '提取年月日并用"-"连接'
      },
      {
        question: '使用YEAR计算年份',
        data: {
          headers: ['出生日期', '年龄'],
          rows: [
            ['1990-01-01', ''],
            ['1985-05-20', ''],
            ['1995-10-15', '']
          ]
        },
        formula: '=YEAR(TODAY())-YEAR(A2)',
        answer: 36,
        explanation: '当前年份减去出生年份'
      },
      {
        question: '使用MONTH判断是否是当前月份',
        data: {
          headers: ['日期', '是否当前月份'],
          rows: [
            ['2026-03-29', ''],
            ['2026-04-15', ''],
            ['2026-03-01', '']
          ]
        },
        formula: '=IF(MONTH(A2)=MONTH(TODAY()), "是", "否")',
        answer: '是',
        explanation: '比较月份是否相等'
      }
    ]
  },
  {
    id: 6,
    name: 'IFERROR+VLOOKUP 错误处理',
    description: '为VLOOKUP查找添加错误处理，避免显示#N/A等错误',
    formulas: ['IFERROR', 'VLOOKUP'],
    combinationFormula: '=IFERROR(VLOOKUP(查找值, 查找范围, 列号, FALSE), 默认值)',
    advantages: [
      '避免显示#N/A等错误',
      '可以设置默认返回值',
      '提升表格美观度',
      '语法简单',
      '使用场景广泛'
    ],
    scenarios: [
      '查找值不存在时显示默认值',
      '避免错误影响后续计算',
      '提升数据质量',
      '制作友好的用户界面',
      '数据匹配和合并'
    ],
    performance: {
      vsSingleFormula: '性能相当',
      dataSize: '适合任意大小数据',
      loadTime: '计算速度快'
    },
    difficulty: '初级',
    popularity: 5,
    example: {
      title: '查找员工信息，不存在时显示"未找到"',
      data: {
        headers: ['查找姓名', '工号', '提示'],
        rows: [
          ['张三', '001', ''],
          ['李四', '002', ''],
          ['赵七', '003', '']
        ]
      },
      formula: '=IFERROR(VLOOKUP(A2, 员工表!A:B, 2, FALSE), "未找到")',
      explanation: '如果VLOOKUP返回错误，则显示"未找到"',
      result: '未找到'
    },
    practiceQuestions: [
      {
        question: '使用IFERROR+VLOOKUP查找产品价格',
        data: {
          headers: ['产品名称', '价格', '提示'],
          rows: [
            ['iPhone 15', '', ''],
            ['Galaxy S24', '', ''],
            ['Pixel 8', '', '']
          ]
        },
        formula: '=IFERROR(VLOOKUP(A2, 产品表!A:B, 2, FALSE), "价格未设置")',
        answer: '价格未设置',
        explanation: '如果VLOOKUP返回错误，则显示"价格未设置"'
      },
      {
        question: '使用IFERROR+VLOOKUP查找员工薪资',
        data: {
          headers: ['姓名', '薪资', '提示'],
          rows: [
            ['张三', '', ''],
            ['李四', '', ''],
            ['王五', '', '']
          ]
        },
        formula: '=IFERROR(VLOOKUP(A2, 员工表!A:C, 3, FALSE), 0)',
        answer: 0,
        explanation: '如果VLOOKUP返回错误，则显示0'
      },
      {
        question: '使用IFERROR+VLOOKUP查找库存',
        data: {
          headers: ['产品', '库存', '提示'],
          rows: [
            ['iPhone 15', '', ''],
            ['Mate 60', '', ''],
            ['小米14', '', '']
          ]
        },
        formula: '=IFERROR(VLOOKUP(A2, 库存表!A:B, 2, FALSE), "缺货")',
        answer: '缺货',
        explanation: '如果VLOOKUP返回错误，则显示"缺货"'
      }
    ]
  },
  {
    id: 7,
    name: 'SUMPRODUCT 加权求和',
    description: '强大的数组函数，可以计算加权平均、多条件求和等',
    formulas: ['SUMPRODUCT'],
    combinationFormula: '=SUMPRODUCT(数组1, 数组2, ...)',
    advantages: [
      '支持多维数组计算',
      '可以计算加权平均',
      '支持多条件求和',
      '功能强大灵活',
      '替代SUMIFS的某些场景'
    ],
    scenarios: [
      '计算加权平均值',
      '计算多条件求和',
      '计算销量（单价×数量）',
      '复杂条件统计',
      '矩阵计算'
    ],
    performance: {
      vsSingleFormula: '比SUMIF等函数稍慢，但功能更强',
      dataSize: '适合10000+行数据',
      loadTime: '中等，取决于数组大小'
    },
    difficulty: '中级',
    popularity: 4,
    example: {
      title: '计算销售额（单价×数量）',
      data: {
        headers: ['产品', '单价', '数量', '销售额'],
        rows: [
          ['iPhone 15', 5999, 50, ''],
          ['Mate 60', 5499, 45, ''],
          ['小米14', 4299, 60, '']
        ]
      },
      formula: '=SUMPRODUCT(B2:B4, C2:C4)',
      explanation: '单价列和数量列对应相乘再求和',
      result: 764520
    },
    practiceQuestions: [
      {
        question: '使用SUMPRODUCT计算总销售额',
        data: {
          headers: ['产品', '单价', '数量'],
          rows: [
            ['iPhone 15', 5999, 50],
            ['Mate 60', 5499, 45],
            ['小米14', 4299, 60]
          ]
        },
        formula: '=SUMPRODUCT(B2:B4, C2:C4)',
        answer: 764520,
        explanation: '5999×50 + 5499×45 + 4299×60 = 764520'
      },
      {
        question: '使用SUMPRODUCT计算加权平均分',
        data: {
          headers: ['课程', '成绩', '学分'],
          rows: [
            ['数学', 90, 4],
            ['英语', 85, 3],
            ['物理', 88, 4]
          ]
        },
        formula: '=SUMPRODUCT(B2:B4, C2:C4)/SUM(C2:C4)',
        answer: 87.9,
        explanation: '加权平均 = (90×4 + 85×3 + 88×4) / (4+3+4) = 87.9'
      },
      {
        question: '使用SUMPRODUCT计算某品牌销量',
        data: {
          headers: ['品牌', '型号', '销量'],
          rows: [
            ['苹果', 'iPhone 15', 50],
            ['苹果', 'iPhone 14', 30],
            ['华为', 'Mate 60', 45],
            ['小米', '小米14', 60]
          ]
        },
        formula: '=SUMPRODUCT((A2:A5="苹果")*C2:C5)',
        answer: 80,
        explanation: '苹果品牌总销量 = 50+30 = 80'
      }
    ]
  },
  {
    id: 8,
    name: 'OFFSET+MATCH 动态范围',
    description: '使用MATCH确定位置，用OFFSET获取动态范围，实现灵活的数据引用',
    formulas: ['OFFSET', 'MATCH'],
    combinationFormula: '=OFFSET(起始单元格, 行偏移, 列偏移, 高度, 宽度)',
    advantages: [
      '可以获取动态范围',
      '支持灵活的数据引用',
      '可以基于条件确定范围',
      '功能强大灵活',
      '适合动态报表'
    ],
    scenarios: [
      '动态求和（最近N个月）',
      '动态平均值（最近N个数据）',
      '基于条件的数据提取',
      '制作动态图表',
      '滚动平均值'
    ],
    performance: {
      vsSingleFormula: '性能稍慢，但功能强大',
      dataSize: '适合10000+行数据',
      loadTime: '中等'
    },
    difficulty: '高级',
    popularity: 3,
    example: {
      title: '计算最近3个月的总销售额',
      data: {
        headers: ['月份', '销售额'],
        rows: [
          ['1月', 10000],
          ['2月', 12000],
          ['3月', 15000],
          ['4月', 13000],
          ['5月', 14000]
        ]
      },
      formula: '=SUM(OFFSET(B2, COUNT(B:B)-3, 0, 3, 1))',
      explanation: '从倒数第3个数据开始，取3行1列的范围求和',
      result: 42000
    },
    practiceQuestions: [
      {
        question: '使用OFFSET+MATCH计算最近3个月总销售额',
        data: {
          headers: ['月份', '销售额'],
          rows: [
            ['1月', 10000],
            ['2月', 12000],
            ['3月', 15000],
            ['4月', 13000],
            ['5月', 14000]
          ]
        },
        formula: '=SUM(OFFSET(B2, COUNT(B:B)-3, 0, 3, 1))',
        answer: 42000,
        explanation: '最近3个月（3月、4月、5月）总销售额 = 15000+13000+14000 = 42000'
      },
      {
        question: '使用OFFSET计算动态平均值',
        data: {
          headers: ['月份', '销售额'],
          rows: [
            ['1月', 10000],
            ['2月', 12000],
            ['3月', 15000],
            ['4月', 13000]
          ]
        },
        formula: '=AVERAGE(OFFSET(B2, 0, 0, MATCH(TODAY(), A:A, 0), 1))',
        answer: 12500,
        explanation: '动态计算当前月份之前的平均值'
      },
      {
        question: '使用OFFSET提取特定范围数据',
        data: {
          headers: ['月份', '销售额'],
          rows: [
            ['1月', 10000],
            ['2月', 12000],
            ['3月', 15000],
            ['4月', 13000],
            ['5月', 14000]
          ]
        },
        formula: '=SUM(OFFSET(B2, 2, 0, 2, 1))',
        answer: 28000,
        explanation: '从第3行（2月后2行）开始，取2行数据求和（3月+4月）'
      }
    ]
  },
  {
    id: 9,
    name: 'AGGREGATE 高级统计',
    description: '强大的统计函数，可以忽略隐藏行、错误值等，功能涵盖多个统计函数',
    formulas: ['AGGREGATE'],
    combinationFormula: '=AGGREGATE(功能码, 选项, 数组, [k])',
    advantages: [
      '可以忽略隐藏行',
      '可以忽略错误值',
      '功能涵盖多个统计函数',
      '比单独使用更灵活',
      '支持多种统计方式'
    ],
    scenarios: [
      '忽略错误值求和',
      '忽略隐藏行计算',
      '处理含有错误的数据',
      '复杂条件统计',
      '数据清洗'
    ],
    performance: {
      vsSingleFormula: '性能相当，但更灵活',
      dataSize: '适合10000+行数据',
      loadTime: '计算速度快'
    },
    difficulty: '高级',
    popularity: 2,
    example: {
      title: '忽略错误值求和',
      data: {
        headers: ['产品', '销售额'],
        rows: [
          ['iPhone 15', 10000],
          ['Mate 60', '#N/A'],
          ['小米14', 8000],
          ['Pixel 8', '#REF!']
        ]
      },
      formula: '=AGGREGATE(9, 6, B2:B5)',
      explanation: '9表示SUM，6表示忽略错误值',
      result: 18000
    },
    practiceQuestions: [
      {
        question: '使用AGGREGATE忽略错误值求和',
        data: {
          headers: ['产品', '销售额'],
          rows: [
            ['iPhone 15', 10000],
            ['Mate 60', '#N/A'],
            ['小米14', 8000],
            ['Pixel 8', '#REF!']
          ]
        },
        formula: '=AGGREGATE(9, 6, B2:B5)',
        answer: 18000,
        explanation: '忽略#N/A和#REF!，求和10000+8000=18000'
      },
      {
        question: '使用AGGREGATE忽略错误值求平均',
        data: {
          headers: ['产品', '评分'],
          rows: [
            ['iPhone 15', 4.5],
            ['Mate 60', '#N/A'],
            ['小米14', 4.2],
            ['Pixel 8', '#REF!']
          ]
        },
        formula: '=AGGREGATE(1, 6, B2:B5)',
        answer: 4.35,
        explanation: '忽略#N/A和#REF!，求平均(4.5+4.2)/2=4.35'
      },
      {
        question: '使用AGGREGATE忽略隐藏行求和',
        data: {
          headers: ['产品', '销售额'],
          rows: [
            ['iPhone 15', 10000],
            ['Mate 60', 8000],
            ['小米14', 6000]
          ]
        },
        formula: '=AGGREGATE(9, 5, B2:B4)',
        answer: 24000,
        explanation: '5表示忽略隐藏行，求和10000+8000+6000=24000'
      }
    ]
  },
  {
    id: 10,
    name: 'XLOOKUP+XMATCH 新版查找',
    description: 'Office 365专用的新版查找函数，比VLOOKUP更简洁、更强大',
    formulas: ['XLOOKUP', 'XMATCH'],
    combinationFormula: '=XLOOKUP(查找值, 查找数组, 返回数组, [未找到值], [匹配模式], [搜索模式])',
    advantages: [
      '语法比VLOOKUP更简洁',
      '支持任意方向查找',
      '内置错误处理',
      '性能更优',
      '支持近似匹配和精确匹配'
    ],
    scenarios: [
      'Office 365环境下的查找',
      '需要任意方向查找',
      '需要内置错误处理',
      '需要多条件查找',
      '替代VLOOKUP的升级方案'
    ],
    performance: {
      vsSingleFormula: '比VLOOKUP快30-50%',
      dataSize: '适合1000+行数据',
      loadTime: '比VLOOKUP减少30-40%'
    },
    difficulty: '中级',
    popularity: 4,
    example: {
      title: '根据工号查找员工姓名',
      data: {
        headers: ['姓名', '工号', '薪资'],
        rows: [
          ['张三', '001', 5000],
          ['李四', '002', 6000],
          ['王五', '003', 7000]
        ]
      },
      formula: '=XLOOKUP("002", B2:B4, A2:A4, "未找到")',
      explanation: '从B列查找"002"，返回A列对应的姓名，未找到显示"未找到"',
      result: '李四'
    },
    practiceQuestions: [
      {
        question: '使用XLOOKUP查找产品价格',
        data: {
          headers: ['产品', 'ID', '价格'],
          rows: [
            ['iPhone 15', 'P001', 5999],
            ['Mate 60', 'P002', 5499],
            ['小米14', 'P003', 4299]
          ]
        },
        formula: '=XLOOKUP("P002", B2:B4, C2:C4, "价格未设置")',
        answer: 5499,
        explanation: '从B列查找"P002"，返回C列的价格'
      },
      {
        question: '使用XLOOKUP反向查找',
        data: {
          headers: ['姓名', '工号', '薪资'],
          rows: [
            ['张三', '001', 5000],
            ['李四', '002', 6000],
            ['王五', '003', 7000]
          ]
        },
        formula: '=XLOOKUP(6000, C2:C4, A2:A4)',
        answer: '李四',
        explanation: '从C列查找6000，返回A列的姓名（反向查找）'
      },
      {
        question: '使用XLOOKUP+XMATCH查找',
        data: {
          headers: ['姓名', '工号', '薪资'],
          rows: [
            ['张三', '001', 5000],
            ['李四', '002', 6000],
            ['王五', '003', 7000]
          ]
        },
        formula: '=XLOOKUP(XMATCH("002", B2:B4), ROW(B2:B4)-ROW(B2)+1, C2:C4)',
        answer: 6000,
        explanation: '先使用XMATCH找到位置，再用XLOOKUP返回对应值'
      }
    ]
  }
]

/**
 * 根据ID获取公式组合
 */
export function getCombinationById(id: number): FormulaCombination | undefined {
  return formulaCombinations.find(c => c.id === id)
}

/**
 * 根据难度筛选公式组合
 */
export function filterCombinationsByDifficulty(difficulty: string): FormulaCombination[] {
  return formulaCombinations.filter(c => c.difficulty === difficulty)
}

/**
 * 根据常用度筛选公式组合
 */
export function filterCombinationsByPopularity(minPopularity: number): FormulaCombination[] {
  return formulaCombinations.filter(c => c.popularity >= minPopularity)
}

/**
 * 搜索公式组合
 */
export function searchCombinations(keyword: string): FormulaCombination[] {
  const lowerKeyword = keyword.toLowerCase()
  return formulaCombinations.filter(c =>
    c.name.toLowerCase().includes(lowerKeyword) ||
    c.description.toLowerCase().includes(lowerKeyword) ||
    c.formulas.some(f => f.toLowerCase().includes(lowerKeyword))
  )
}
