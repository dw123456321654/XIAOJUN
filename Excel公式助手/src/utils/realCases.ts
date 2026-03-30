/**
 * 实战案例库数据
 * 数码3C行业，20个案例
 */

import type { RealCase } from '../types'

export const realCases: RealCase[] = [
  // ========== 销售管理（6个案例） ==========

  {
    id: 'RC001',
    title: '手机销售业绩分析',
    industry: '数码3C',
    category: '销售管理',
    difficulty: '中级',
    scenario: '分析各品牌手机的月度销售数据，计算总销售额、同比增长率、排名等',
    dataTemplate: {
      headers: ['日期', '品牌', '型号', '单价', '数量', '销售额'],
      rows: [
        ['2026-03-01', '苹果', 'iPhone 15', 5999, 50, 299950],
        ['2026-03-01', '华为', 'Mate 60', 5499, 45, 247455],
        ['2026-03-01', '小米', '小米14', 4299, 60, 257940],
        ['2026-03-01', '三星', 'Galaxy S24', 5999, 35, 209965]
      ]
    },
    steps: [
      {
        step: 1,
        description: '计算月度总销售额',
        formula: '=SUMPRODUCT(E2:E10, F2:F10)',
        explanation: '单价 × 数量 = 销售额，使用SUMPRODUCT计算'
      },
      {
        step: 2,
        description: '按品牌统计销售额',
        formula: '=SUMIF(B2:B10, "苹果", F2:F10)',
        explanation: '按品牌汇总销售额'
      },
      {
        step: 3,
        description: '计算销售额排名',
        formula: '=RANK(F2, F:F, 0)',
        explanation: '按销售额降序排名，0表示降序'
      },
      {
        step: 4,
        description: '计算环比增长率',
        formula: '=(本月销售额-上月销售额)/上月销售额',
        explanation: '增长率 = (本月-上月)/上月'
      }
    ],
    keyFormulas: ['SUMPRODUCT', 'SUMIF', 'RANK'],
    downloadUrl: '/templates/case-001.xlsx'
  },
  {
    id: 'RC002',
    title: '多条件销售统计',
    industry: '数码3C',
    category: '销售管理',
    difficulty: '中级',
    scenario: '按地区和产品类别统计销售额，计算各地区占比',
    dataTemplate: {
      headers: ['销售员', '地区', '产品类别', '销售额'],
      rows: [
        ['张三', '华东', '手机', 100000],
        ['李四', '华东', '平板', 50000],
        ['王五', '华南', '手机', 80000],
        ['赵六', '华南', '平板', 60000]
      ]
    },
    steps: [
      {
        step: 1,
        description: '计算华东地区手机销售额',
        formula: '=SUMIFS(D:D, B:B, "华东", C:C, "手机")',
        explanation: '多条件求和：地区=华东 AND 产品=手机'
      },
      {
        step: 2,
        description: '计算各地区总销售额',
        formula: '=SUMIF(B:B, "华东", D:D)',
        explanation: '单条件求和：按地区汇总'
      },
      {
        step: 3,
        description: '计算华东地区占比',
        formula: '=SUMIF(B:B, "华东", D:D)/SUM(D:D)',
        explanation: '占比 = 地区销售额 / 总销售额'
      }
    ],
    keyFormulas: ['SUMIFS', 'SUMIF'],
    downloadUrl: '/templates/case-002.xlsx'
  },
  {
    id: 'RC003',
    title: '销售员业绩排名',
    industry: '数码3C',
    category: '销售管理',
    difficulty: '初级',
    scenario: '根据销售额对销售员进行排名，标记优秀销售员',
    dataTemplate: {
      headers: ['销售员', '产品', '销售额'],
      rows: [
        ['张三', 'iPhone 15', 10000],
        ['李四', 'Mate 60', 15000],
        ['王五', '小米14', 8000],
        ['赵六', 'Galaxy S24', 12000]
      ]
    },
    steps: [
      {
        step: 1,
        description: '计算销售额排名',
        formula: '=RANK(C2, C:C, 0)',
        explanation: '按销售额降序排名'
      },
      {
        step: 2,
        description: '标记优秀销售员（销售额>10000）',
        formula: '=IF(C2>10000, "优秀", "普通")',
        explanation: '销售额>10000为优秀'
      },
      {
        step: 3,
        description: '计算前三名平均销售额',
        formula: '=AVERAGE(LARGE(C:C, 1), LARGE(C:C, 2), LARGE(C:C, 3))',
        explanation: '使用LARGE取前三，再计算平均'
      }
    ],
    keyFormulas: ['RANK', 'IF', 'LARGE'],
    downloadUrl: '/templates/case-003.xlsx'
  },
  {
    id: 'RC004',
    title: '销售趋势分析',
    industry: '数码3C',
    category: '销售管理',
    difficulty: '高级',
    scenario: '计算环比/同比增长率，分析销售趋势',
    dataTemplate: {
      headers: ['月份', '2025年销售额', '2026年销售额'],
      rows: [
        ['1月', 100000, 120000],
        ['2月', 110000, 130000],
        ['3月', 105000, 140000]
      ]
    },
    steps: [
      {
        step: 1,
        description: '计算环比增长率',
        formula: '=(C2-B2)/B2',
        explanation: '环比 = (本月-上月)/上月'
      },
      {
        step: 2,
        description: '计算同比增长率',
        formula: '=(C2-B2)/B2',
        explanation: '同比 = (今年-去年)/去年'
      },
      {
        step: 3,
        description: '判断增长趋势',
        formula: '=IF((C2-B2)>0, "增长", "下降")',
        explanation: '根据差值判断增长还是下降'
      },
      {
        step: 4,
        description: '计算移动平均（3个月）',
        formula: '=AVERAGE(OFFSET(C2, -2, 0, 3, 1))',
        explanation: '使用OFFSET和AVERAGE计算3个月移动平均'
      }
    ],
    keyFormulas: ['IF', 'OFFSET', 'AVERAGE'],
    downloadUrl: '/templates/case-004.xlsx'
  },
  {
    id: 'RC005',
    title: '客户销售分析',
    industry: '数码3C',
    category: '销售管理',
    difficulty: '中级',
    scenario: '根据客户类型和地区分析销售情况，识别高价值客户',
    dataTemplate: {
      headers: ['客户名称', '客户类型', '地区', '购买金额', '购买次数'],
      rows: [
        ['客户A', 'VIP', '华东', 50000, 10],
        ['客户B', '普通', '华南', 10000, 3],
        ['客户C', 'VIP', '华东', 30000, 8]
      ]
    },
    steps: [
      {
        step: 1,
        description: '计算VIP客户总销售额',
        formula: '=SUMIF(B:B, "VIP", D:D)',
        explanation: '按客户类型汇总销售额'
      },
      {
        step: 2,
        description: '计算客户平均购买金额',
        formula: '=SUMIF(A:A, "客户A", D:D)/COUNTIF(A:A, "客户A")',
        explanation: '总金额 / 购买次数 = 平均金额'
      },
      {
        step: 3,
        description: '识别高价值客户（VIP且金额>30000）',
        formula: '=IF(AND(B2="VIP", D2>30000), "高价值", "普通")',
        explanation: '多条件判断：VIP AND 金额>30000'
      },
      {
        step: 4,
        description: '按地区和客户类型交叉分析',
        formula: '=SUMIFS(D:D, B:B, "VIP", C:C, "华东")',
        explanation: '多条件求和：VIP AND 华东'
      }
    ],
    keyFormulas: ['SUMIF', 'COUNTIF', 'IF', 'AND', 'SUMIFS'],
    downloadUrl: '/templates/case-005.xlsx'
  },
  {
    id: 'RC006',
    title: '销售报表汇总',
    industry: '数码3C',
    category: '销售管理',
    difficulty: '初级',
    scenario: '汇总多个销售员的报表，计算总销售额、平均值、最高值',
    dataTemplate: {
      headers: ['销售员', '1月', '2月', '3月', '总计'],
      rows: [
        ['张三', 10000, 12000, 11000, 33000],
        ['李四', 15000, 14000, 16000, 45000],
        ['王五', 8000, 9000, 10000, 27000]
      ]
    },
    steps: [
      {
        step: 1,
        description: '计算个人月度总计',
        formula: '=SUM(B2:D2)',
        explanation: '横向求和：1月+2月+3月'
      },
      {
        step: 2,
        description: '计算全公司月度总计',
        formula: '=SUM(B:B)',
        explanation: '纵向求和：所有销售员'
      },
      {
        step: 3,
        description: '计算全公司月度平均值',
        formula: '=AVERAGE(B:B)',
        explanation: '月度平均值'
      },
      {
        step: 4,
        description: '找出月度最高销售额',
        formula: '=MAX(B:B)',
        explanation: '找出最高值'
      },
      {
        step: 5,
        description: '找出月度最高销售员',
        formula: '=INDEX(A:A, MATCH(MAX(B:B), B:B, 0))',
        explanation: '使用INDEX+MATCH反向查找'
      }
    ],
    keyFormulas: ['SUM', 'AVERAGE', 'MAX', 'INDEX', 'MATCH'],
    downloadUrl: '/templates/case-006.xlsx'
  },

  // ========== 库存管理（5个案例） ==========

  {
    id: 'RC007',
    title: '库存预警系统',
    industry: '数码3C',
    category: '库存管理',
    difficulty: '初级',
    scenario: '实时监控产品库存，标记库存不足的产品',
    dataTemplate: {
      headers: ['产品ID', '产品名称', '当前库存', '最低库存', '安全库存', '状态'],
      rows: [
        ['P001', 'iPhone 15', 50, 100, 150, ''],
        ['P002', 'Mate 60', 200, 80, 100, ''],
        ['P003', '小米14', 10, 20, 30, ''],
        ['P004', 'Galaxy S24', 150, 100, 120, '']
      ]
    },
    steps: [
      {
        step: 1,
        description: '自动标记库存状态',
        formula: '=IF(C2<D2, "严重不足", IF(C2<E2, "需补货", "充足"))',
        explanation: '三态判断：严重不足/需补货/充足'
      },
      {
        step: 2,
        description: '统计需补货产品数',
        formula: '=COUNTIF(F:F, "需补货")',
        explanation: '统计标记为"需补货"的产品'
      },
      {
        step: 3,
        description: '统计严重不足产品数',
        formula: '=COUNTIF(F:F, "严重不足")',
        explanation: '统计标记为"严重不足"的产品'
      }
    ],
    keyFormulas: ['IF', 'COUNTIF'],
    downloadUrl: '/templates/case-007.xlsx'
  },
  {
    id: 'RC008',
    title: '补货计划',
    industry: '数码3C',
    category: '库存管理',
    difficulty: '中级',
    scenario: '根据销售速度和当前库存，计算补货数量',
    dataTemplate: {
      headers: ['产品', '当前库存', '月销量', '补货数量'],
      rows: [
        ['iPhone 15', 50, 200, ''],
        ['Mate 60', 200, 180, ''],
        ['小米14', 10, 150, '']
      ]
    },
    steps: [
      {
        step: 1,
        description: '计算月销量平均',
        formula: '=C2/30',
        explanation: '月销量 / 30天 = 日均销量'
      },
      {
        step: 2,
        description: '计算库存可用天数',
        formula: '=B2/C2',
        explanation: '当前库存 / 月销量 = 可用月数'
      },
      {
        step: 3,
        description: '计算补货数量（补至2个月库存）',
        formula: '=C2*2-B2',
        explanation: '2个月销量 - 当前库存 = 补货数量'
      },
      {
        step: 4,
        description: '标记是否需要补货（库存<1个月销量）',
        formula: '=IF(B2<C2, "需要补货", "暂不需要")',
        explanation: '库存<月销量则需要补货'
      }
    ],
    keyFormulas: ['IF'],
    downloadUrl: '/templates/case-008.xlsx'
  },
  {
    id: 'RC009',
    title: '库存盘点',
    industry: '数码3C',
    category: '库存管理',
    difficulty: '初级',
    scenario: '对比账面库存和实际库存，计算盘点差异',
    dataTemplate: {
      headers: ['产品', '账面库存', '实际库存', '差异', '状态'],
      rows: [
        ['iPhone 15', 100, 98, '', ''],
        ['Mate 60', 50, 50, '', ''],
        ['小米14', 80, 75, '', '']
      ]
    },
    steps: [
      {
        step: 1,
        description: '计算盘点差异',
        formula: '=C2-B2',
        explanation: '实际库存 - 账面库存 = 差异'
      },
      {
        step: 2,
        description: '标记盘点状态',
        formula: '=IF(D2=0, "正常", IF(D2>0, "盘盈", "盘亏"))',
        explanation: '差异=0正常，>0盘盈，<0盘亏'
      },
      {
        step: 3,
        description: '计算盘点差异率',
        formula: '=ABS(D2)/B2',
        explanation: '|差异| / 账面库存 = 差异率'
      },
      {
        step: 4,
        description: '统计盘亏产品数',
        formula: '=COUNTIF(E:E, "盘亏")',
        explanation: '统计盘亏产品'
      }
    ],
    keyFormulas: ['IF', 'ABS', 'COUNTIF'],
    downloadUrl: '/templates/case-009.xlsx'
  },
  {
    id: 'RC010',
    title: '库存周转率',
    industry: '数码3C',
    category: '库存管理',
    difficulty: '中级',
    scenario: '计算库存周转率，评估库存管理效率',
    dataTemplate: {
      headers: ['产品', '期初库存', '期末库存', '销售成本', '平均库存', '周转率'],
      rows: [
        ['iPhone 15', 100, 80, 200000, '', ''],
        ['Mate 60', 50, 60, 150000, '', ''],
        ['小米14', 80, 90, 120000, '', '']
      ]
    },
    steps: [
      {
        step: 1,
        description: '计算平均库存',
        formula: '=(B2+C2)/2',
        explanation: '(期初+期末)/2 = 平均库存'
      },
      {
        step: 2,
        description: '计算库存周转率',
        formula: '=D2/E2',
        explanation: '销售成本 / 平均库存 = 周转率'
      },
      {
        step: 3,
        description: '计算库存周转天数',
        formula: '=360/F2',
        explanation: '360天 / 周转率 = 周转天数'
      },
      {
        step: 4,
        description: '评估周转效率',
        formula: '=IF(F2>12, "高效", IF(F2>6, "正常", "低效"))',
        explanation: '周转率>12高效，6-12正常，<6低效'
      }
    ],
    keyFormulas: ['IF'],
    downloadUrl: '/templates/case-010.xlsx'
  },
  {
    id: 'RC011',
    title: '缺货分析',
    industry: '数码3C',
    category: '库存管理',
    difficulty: '高级',
    scenario: '分析缺货原因，统计缺货次数和影响',
    dataTemplate: {
      headers: ['日期', '产品', '订单数量', '库存', '缺货数量', '缺货原因'],
      rows: [
        ['2026-03-01', 'iPhone 15', 50, 30, '', ''],
        ['2026-03-01', 'Mate 60', 20, 20, '', ''],
        ['2026-03-02', '小米14', 30, 20, '', '']
      ]
    },
    steps: [
      {
        step: 1,
        description: '计算缺货数量',
        formula: '=IF(D2<C2, C2-D2, 0)',
        explanation: '订单>库存则缺货，否则为0'
      },
      {
        step: 2,
        description: '标记缺货原因',
        formula: '=IF(E2>0, IF(D2=0, "无库存", "库存不足"), "无缺货")',
        explanation: '判断缺货原因'
      },
      {
        step: 3,
        description: '统计产品缺货次数',
        formula: '=COUNTIFS(B:B, "iPhone 15", F:F, "<>无缺货")',
        explanation: '统计特定产品的缺货次数'
      },
      {
        step: 4,
        description: '计算缺货影响（销售额损失）',
        formula: '=E2*G2',
        explanation: '缺货数量 × 单价 = 销售额损失'
      }
    ],
    keyFormulas: ['IF', 'COUNTIFS'],
    downloadUrl: '/templates/case-011.xlsx'
  },

  // ========== 财务管理（4个案例） ==========

  {
    id: 'RC012',
    title: '成本核算',
    industry: '数码3C',
    category: '财务管理',
    difficulty: '中级',
    scenario: '计算产品的成本构成，分析成本占比',
    dataTemplate: {
      headers: ['产品', '材料成本', '人工成本', '其他成本', '总成本', '成本占比'],
      rows: [
        ['iPhone 15', 3000, 500, 1000, '', ''],
        ['Mate 60', 2500, 400, 800, '', ''],
        ['小米14', 2000, 300, 600, '', '']
      ]
    },
    steps: [
      {
        step: 1,
        description: '计算总成本',
        formula: '=SUM(B2:D2)',
        explanation: '材料+人工+其他 = 总成本'
      },
      {
        step: 2,
        description: '计算成本占比',
        formula: '=B2/E2',
        explanation: '材料成本 / 总成本 = 材料占比'
      },
      {
        step: 3,
        description: '计算毛利率',
        formula: '=(销售单价-E2)/销售单价',
        explanation: '(售价-成本)/售价 = 毛利率'
      },
      {
        step: 4,
        description: '标记高成本产品（成本>3000）',
        formula: '=IF(E2>3000, "高成本", "正常")',
        explanation: '成本>3000为高成本'
      }
    ],
    keyFormulas: ['SUM', 'IF'],
    downloadUrl: '/templates/case-012.xlsx'
  },
  {
    id: 'RC013',
    title: '利润分析',
    industry: '数码3C',
    category: '财务管理',
    difficulty: '中级',
    scenario: '计算毛利、净利，分析利润率',
    dataTemplate: {
      headers: ['产品', '销售额', '成本', '毛利', '费用', '净利', '毛利率'],
      rows: [
        ['iPhone 15', 5000, 4500, '', 200, '', ''],
        ['Mate 60', 5500, 4700, '', 200, '', ''],
        ['小米14', 4300, 3700, '', 150, '', '']
      ]
    },
    steps: [
      {
        step: 1,
        description: '计算毛利',
        formula: '=B2-C2',
        explanation: '销售额 - 成本 = 毛利'
      },
      {
        step: 2,
        description: '计算净利',
        formula: '=D2-E2',
        explanation: '毛利 - 费用 = 净利'
      },
      {
        step: 3,
        description: '计算毛利率',
        formula: '=D2/B2',
        explanation: '毛利 / 销售额 = 毛利率'
      },
      {
        step: 4,
        description: '标记高利润产品（毛利率>20%）',
        formula: '=IF(F2>0.2, "高利润", "正常")',
        explanation: '毛利率>20%为高利润'
      }
    ],
    keyFormulas: ['IF'],
    downloadUrl: '/templates/case-013.xlsx'
  },
  {
    id: 'RC014',
    title: '账单管理',
    industry: '数码3C',
    category: '财务管理',
    difficulty: '初级',
    scenario: '管理应付账款，计算应付金额和到期日',
    dataTemplate: {
      headers: ['供应商', '订单日期', '付款期限(天)', '应付金额', '到期日', '状态'],
      rows: [
        ['供应商A', '2026-03-01', 30, 50000, '', ''],
        ['供应商B', '2026-03-05', 15, 30000, '', ''],
        ['供应商C', '2026-03-10', 60, 80000, '', '']
      ]
    },
    steps: [
      {
        step: 1,
        description: '计算到期日',
        formula: '=B2+C2',
        explanation: '订单日期 + 付款期限 = 到期日'
      },
      {
        step: 2,
        description: '判断是否逾期',
        formula: '=IF(E2<TODAY(), "已逾期", "未逾期")',
        explanation: '到期日<今天则已逾期'
      },
      {
        step: 3,
        description: '计算逾期天数',
        formula: '=TODAY()-E2',
        explanation: '今天 - 到期日 = 逾期天数'
      },
      {
        step: 4,
        description: '统计总应付金额',
        formula: '=SUM(D:D)',
        explanation: '汇总所有应付金额'
      }
    ],
    keyFormulas: ['IF', 'SUM', 'TODAY'],
    downloadUrl: '/templates/case-014.xlsx'
  },
  {
    id: 'RC015',
    title: '财务报表',
    industry: '数码3C',
    category: '财务管理',
    difficulty: '高级',
    scenario: '编制简易财务报表，计算资产负债和利润',
    dataTemplate: {
      headers: ['项目', '金额', '占比'],
      rows: [
        ['资产-流动资产', 1000000, ''],
        ['资产-固定资产', 2000000, ''],
        ['负债-流动负债', 500000, ''],
        ['负债-长期负债', 1000000, ''],
        ['所有者权益', '', '']
      ]
    },
    steps: [
      {
        step: 1,
        description: '计算总资产',
        formula: '=SUM(B2:B3)',
        explanation: '流动资产 + 固定资产 = 总资产'
      },
      {
        step: 2,
        description: '计算总负债',
        formula: '=SUM(B4:B5)',
        explanation: '流动负债 + 长期负债 = 总负债'
      },
      {
        step: 3,
        description: '计算所有者权益',
        formula: '=B6-B7',
        explanation: '总资产 - 总负债 = 所有者权益'
      },
      {
        step: 4,
        description: '计算资产负债率',
        formula: '=B7/B6',
        explanation: '总负债 / 总资产 = 资产负债率'
      },
      {
        step: 5,
        description: '计算各项目占比',
        formula: '=B2/$B$6',
        explanation: '项目金额 / 总资产 = 占比'
      }
    ],
    keyFormulas: ['SUM'],
    downloadUrl: '/templates/case-015.xlsx'
  },

  // ========== 客户服务（3个案例） ==========

  {
    id: 'RC016',
    title: '客户投诉处理',
    industry: '数码3C',
    category: '客户服务',
    difficulty: '中级',
    scenario: '统计分析客户投诉，计算投诉率和响应时间',
    dataTemplate: {
      headers: ['客户', '投诉日期', '投诉类型', '处理日期', '响应时间(小时)', '状态'],
      rows: [
        ['客户A', '2026-03-01', '质量问题', '2026-03-01', '', ''],
        ['客户B', '2026-03-02', '物流问题', '2026-03-03', '', ''],
        ['客户C', '2026-03-03', '售后问题', '2026-03-03', '', '']
      ]
    },
    steps: [
      {
        step: 1,
        description: '计算响应时间',
        formula: '=(E2-D2)*24',
        explanation: '(处理日期-投诉日期)×24 = 响应时间（小时）'
      },
      {
        step: 2,
        description: '判断响应是否及时（<24小时）',
        formula: '=IF(F2<=24, "及时", "超时")',
        explanation: '响应时间<=24小时为及时'
      },
      {
        step: 3,
        description: '按投诉类型统计',
        formula: '=COUNTIF(C:C, "质量问题")',
        explanation: '统计质量问题的数量'
      },
      {
        step: 4,
        description: '计算投诉率',
        formula: '=COUNTA(A:A)/总客户数',
        explanation: '投诉客户数 / 总客户数 = 投诉率'
      }
    ],
    keyFormulas: ['IF', 'COUNTIF', 'COUNTA'],
    downloadUrl: '/templates/case-016.xlsx'
  },
  {
    id: 'RC017',
    title: '售后跟踪',
    industry: '数码3C',
    category: '客户服务',
    difficulty: '初级',
    scenario: '跟踪售后服务状态，计算完成率和满意度',
    dataTemplate: {
      headers: ['客户', '服务类型', '开始日期', '完成日期', '满意度', '状态'],
      rows: [
        ['客户A', '维修', '2026-03-01', '2026-03-03', 5, ''],
        ['客户B', '更换', '2026-03-02', '', 0, ''],
        ['客户C', '咨询', '2026-03-03', '2026-03-03', 4, '']
      ]
    },
    steps: [
      {
        step: 1,
        description: '计算服务时长',
        formula: '=IF(D2="", "进行中", D2-C2)',
        explanation: '完成日期-开始日期，未完成则显示"进行中"'
      },
      {
        step: 2,
        description: '标记服务状态',
        formula: '=IF(D2="", "进行中", IF(D2> C2+7, "超时", "完成"))',
        explanation: '7天内完成则为"完成"，否则"超时"'
      },
      {
        step: 3,
        description: '计算服务满意度',
        formula: '=IF(E2>=4, "满意", IF(E2>=3, "一般", "不满意"))',
        explanation: '5分制：4-5满意，3一般，1-2不满意'
      },
      {
        step: 4,
        description: '计算完成率',
        formula: '=COUNTIF(F:F, "完成")/COUNTA(A:A)',
        explanation: '完成数 / 总数 = 完成率'
      }
    ],
    keyFormulas: ['IF', 'COUNTIF', 'COUNTA'],
    downloadUrl: '/templates/case-017.xlsx'
  },
  {
    id: 'RC018',
    title: '客户满意度分析',
    industry: '数码3C',
    category: '客户服务',
    difficulty: '中级',
    scenario: '分析客户满意度调查，计算平均分和分布',
    dataTemplate: {
      headers: ['客户', '产品', '服务质量', '产品质量', '物流速度', '总体评价'],
      rows: [
        ['客户A', 'iPhone 15', 5, 4, 3, ''],
        ['客户B', 'Mate 60', 4, 5, 4, ''],
        ['客户C', '小米14', 5, 5, 5, '']
      ]
    },
    steps: [
      {
        step: 1,
        description: '计算总体评价（平均分）',
        formula: '=AVERAGE(B2:E2)',
        explanation: '各项评价的平均分'
      },
      {
        step: 2,
        description: '标记满意度等级',
        formula: '=IF(F2>=4.5, "非常满意", IF(F2>=4, "满意", IF(F2>=3, "一般", "不满意")))',
        explanation: '4.5+非常满意，4-4.5满意，3-4一般，<3不满意'
      },
      {
        step: 3,
        description: '计算各维度平均分',
        formula: '=AVERAGE(C:C)',
        explanation: '服务质量的平均分'
      },
      {
        step: 4,
        description: '统计各满意度等级人数',
        formula: '=COUNTIF(G:G, "非常满意")',
        explanation: '统计"非常满意"的客户数'
      },
      {
        step: 5,
        description: '识别高价值客户（总体评价>4.5）',
        formula: '=IF(F2>4.5, "高价值客户", "普通客户")',
        explanation: '总体评价>4.5为高价值客户'
      }
    ],
    keyFormulas: ['AVERAGE', 'IF', 'COUNTIF'],
    downloadUrl: '/templates/case-018.xlsx'
  },

  // ========== 产品分析（2个案例） ==========

  {
    id: 'RC019',
    title: '产品生命周期',
    industry: '数码3C',
    category: '产品分析',
    difficulty: '高级',
    scenario: '分析产品生命周期阶段，计算增长率',
    dataTemplate: {
      headers: ['产品', '上市时间', '1月销量', '2月销量', '3月销量', '增长率', '生命周期阶段'],
      rows: [
        ['iPhone 15', '2026-01', 50000, 60000, 70000, '', ''],
        ['Mate 60', '2025-06', 80000, 75000, 70000, '', ''],
        ['小米14', '2025-01', 100000, 110000, 105000, '', '']
      ]
    },
    steps: [
      {
        step: 1,
        description: '计算月度增长率',
        formula: '=(D2-C2)/C2',
        explanation: '(本月-上月)/上月 = 增长率'
      },
      {
        step: 2,
        description: '判断生命周期阶段',
        formula: '=IF(G2>0.2, "成长期", IF(G2>0, "成熟期", "衰退期"))',
        explanation: '增长>20%成长期，0-20%成熟期，<0衰退期'
      },
      {
        step: 3,
        description: '计算上市天数',
        formula: '=TODAY()-B2',
        explanation: '今天 - 上市时间 = 上市天数'
      },
      {
        step: 4,
        description: '识别明星产品（成长期且销量>50000）',
        formula: '=IF(AND(H2="成长期", D2>50000), "明星产品", "普通产品")',
        explanation: '成长期+高销量=明星产品'
      }
    ],
    keyFormulas: ['IF', 'AND', 'TODAY'],
    downloadUrl: '/templates/case-019.xlsx'
  },
  {
    id: 'RC020',
    title: '竞品对比',
    industry: '数码3C',
    category: '产品分析',
    difficulty: '中级',
    scenario: '对比竞品的价格、性能、销量，分析竞争优势',
    dataTemplate: {
      headers: ['品牌', '型号', '价格', '性能评分', '销量', '性价比', '市场地位'],
      rows: [
        ['苹果', 'iPhone 15', 5999, 9, 100000, '', ''],
        ['华为', 'Mate 60', 5499, 8, 80000, '', ''],
        ['小米', '小米14', 4299, 7, 120000, '', '']
      ]
    },
    steps: [
      {
        step: 1,
        description: '计算性价比',
        formula: '=D2/C2',
        explanation: '性能评分 / 价格 = 性价比'
      },
      {
        step: 2,
        description: '标记市场地位',
        formula: '=IF(F2>100000, "领导者", IF(F2>80000, "挑战者", "跟随者"))',
        explanation: '销量>10万领导者，8-10万挑战者，<8万跟随者'
      },
      {
        step: 3,
        description: '识别高性价比产品（性价比>0.0015）',
        formula: '=IF(G2>0.0015, "高性价比", "普通")',
        explanation: '性价比>0.0015为高性价比'
      },
      {
        step: 4,
        description: '计算市场份额',
        formula: '=F2/SUM(F:F)',
        explanation: '该产品销量 / 总销量 = 市场份额'
      }
    ],
    keyFormulas: ['IF', 'SUM'],
    downloadUrl: '/templates/case-020.xlsx'
  }
]

/**
 * 根据ID获取案例
 */
export function getCaseById(id: string): RealCase | undefined {
  return realCases.find(c => c.id === id)
}

/**
 * 根据行业筛选案例
 */
export function filterCasesByIndustry(industry: string): RealCase[] {
  return realCases.filter(c => c.industry === industry)
}

/**
 * 根据类别筛选案例
 */
export function filterCasesByCategory(category: string): RealCase[] {
  return realCases.filter(c => c.category === category)
}

/**
 * 根据难度筛选案例
 */
export function filterCasesByDifficulty(difficulty: string): RealCase[] {
  return realCases.filter(c => c.difficulty === difficulty)
}

/**
 * 搜索案例
 */
export function searchCases(keyword: string): RealCase[] {
  const lowerKeyword = keyword.toLowerCase()
  return realCases.filter(c =>
    c.title.toLowerCase().includes(lowerKeyword) ||
    c.scenario.toLowerCase().includes(lowerKeyword) ||
    c.industry.toLowerCase().includes(lowerKeyword) ||
    c.category.toLowerCase().includes(lowerKeyword)
  )
}

/**
 * 获取所有行业
 */
export function getAllIndustries(): string[] {
  const industries = [...new Set(realCases.map(c => c.industry))]
  return industries.sort()
}

/**
 * 获取所有类别
 */
export function getAllCategories(): string[] {
  const categories = [...new Set(realCases.map(c => c.category))]
  return categories.sort()
}

/**
 * 获取案例统计
 */
export function getCaseStats() {
  return {
    total: realCases.length,
    byIndustry: getAllIndustries().map(ind => ({
      industry: ind,
      count: realCases.filter(c => c.industry === ind).length
    })),
    byCategory: getAllCategories().map(cat => ({
      category: cat,
      count: realCases.filter(c => c.category === cat).length
    })),
    byDifficulty: [
      { difficulty: '初级', count: realCases.filter(c => c.difficulty === '初级').length },
      { difficulty: '中级', count: realCases.filter(c => c.difficulty === '中级').length },
      { difficulty: '高级', count: realCases.filter(c => c.difficulty === '高级').length }
    ]
  }
}
