import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
  },
  {
    path: '/formulas',
    name: 'Formulas',
    component: () => import('../views/Formulas.vue'),
  },
  {
    path: '/formulas/:id',
    name: 'FormulaDetail',
    component: () => import('../views/FormulaDetail.vue'),
  },
  {
    path: '/practice',
    name: 'Practice',
    component: () => import('../views/Practice.vue'),
  },
  {
    path: '/practice/interactive',
    name: 'InteractivePractice',
    component: () => import('../views/InteractivePractice.vue'),
  },
  {
    path: '/favorites',
    name: 'Favorites',
    component: () => import('../views/Favorites.vue'),
  },
  {
    path: '/compare',
    name: 'Compare',
    component: () => import('../views/Compare.vue'),
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('../views/Settings.vue'),
  },
  {
    path: '/upload/excel',
    name: 'UploadExcel',
    component: () => import('../views/UploadExcel.vue'),
  },
  {
    path: '/upload/analysis',
    name: 'UploadAnalysis',
    component: () => import('../views/FormulaAnalysis.vue'),
  },
  {
    path: '/upload/case-generator',
    name: 'UploadCaseGenerator',
    component: () => import('../views/UploadCaseGenerator.vue'),
  },
  {
    path: '/upload/template-manager',
    name: 'UploadTemplateManager',
    component: () => import('../views/UploadTemplateManager.vue'),
  },
  {
    path: '/upload/formula-extractor',
    name: 'UploadFormulaExtractor',
    component: () => import('../views/UploadFormulaExtractor.vue'),
  },
  {
    path: '/upload/optimization-suggestions',
    name: 'UploadOptimizationSuggestions',
    component: () => import('../views/OptimizationSuggestions.vue'),
  },
  {
    path: '/upload/learning-path',
    name: 'UploadLearningPath',
    component: () => import('../views/LearningPathGenerator.vue'),
  },
  {
    path: '/recommend',
    name: 'Recommend',
    component: () => import('../views/Recommend.vue'),
  },
  {
    path: '/learning-paths',
    name: 'LearningPaths',
    component: () => import('../views/LearningPaths.vue'),
  },
  {
    path: '/real-cases',
    name: 'RealCases',
    component: () => import('../views/RealCases.vue'),
  },
  {
    path: '/real-cases/:id',
    name: 'CaseDetail',
    component: () => import('../views/CaseDetail.vue'),
  },
  {
    path: '/real-cases/submit',
    name: 'PersonalCaseSubmit',
    component: () => import('../views/PersonalCaseSubmit.vue'),
  },
  {
    path: '/combinations',
    name: 'Combinations',
    component: () => import('../views/Combinations.vue'),
  },
  {
    path: '/combinations/generator',
    name: 'CombinationGenerator',
    component: () => import('../views/CombinationGenerator.vue'),
  },
  {
    path: '/combinations/practice/:id',
    name: 'CombinationPractice',
    component: () => import('../views/CombinationPractice.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
