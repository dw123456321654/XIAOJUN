import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import type { Formula, Practice } from '../types'
import { formulas, practices } from './data'

// 数据库类型
interface DatabaseSchema {
  favorites: string[]
  formulas: Formula[]
  practices: Practice[]
  settings: {
    theme: 'light' | 'dark'
    fontSize: 'small' | 'medium' | 'large'
  }
}

// 初始化数据库
async function initDatabase() {
  const adapter = new JSONFile<DatabaseSchema>('data/db.json')
  const db = new Low(adapter, {
    favorites: [],
    formulas: formulas,
    practices: practices,
    settings: {
      theme: 'light',
      fontSize: 'medium',
    },
  })

  // 读取数据
  await db.read()

  // 如果是第一次运行，初始化数据
  if (db.data === null) {
    db.data = {
      favorites: [],
      formulas: formulas,
      practices: practices,
      settings: {
        theme: 'light',
        fontSize: 'medium',
      },
    }
    await db.write()
  }

  return db
}

// 获取数据库实例
let dbInstance: Low<DatabaseSchema> | null = null

export async function getDatabase() {
  if (!dbInstance) {
    dbInstance = await initDatabase()
  }
  return dbInstance
}

// 收藏操作
export async function getFavorites(): Promise<string[]> {
  const db = await getDatabase()
  return db.data!.favorites
}

export async function addFavorite(formulaId: string): Promise<void> {
  const db = await getDatabase()
  if (!db.data!.favorites.includes(formulaId)) {
    db.data!.favorites.push(formulaId)
    await db.write()
  }
}

export async function removeFavorite(formulaId: string): Promise<void> {
  const db = await getDatabase()
  const index = db.data!.favorites.indexOf(formulaId)
  if (index > -1) {
    db.data!.favorites.splice(index, 1)
    await db.write()
  }
}

export async function isFavorite(formulaId: string): Promise<boolean> {
  const db = await getDatabase()
  return db.data!.favorites.includes(formulaId)
}

// 公式操作
export async function getFormulas(): Promise<Formula[]> {
  const db = await getDatabase()
  return db.data!.formulas
}

export async function getFormulaById(id: string): Promise<Formula | undefined> {
  const db = await getDatabase()
  return db.data!.formulas.find((f) => f.id === id)
}

// 练习操作
export async function getPractices(): Promise<Practice[]> {
  const db = await getDatabase()
  return db.data!.practices
}

export async function getPracticeById(id: string): Promise<Practice | undefined> {
  const db = await getDatabase()
  return db.data!.practices.find((p) => p.id === id)
}

// 设置操作
export async function getSettings() {
  const db = await getDatabase()
  return db.data!.settings
}

export async function updateSettings(settings: Partial<DatabaseSchema['settings']>) {
  const db = await getDatabase()
  db.data!.settings = { ...db.data!.settings, ...settings }
  await db.write()
}
