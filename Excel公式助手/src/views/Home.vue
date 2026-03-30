<template>
  <div class="home-container">
    <div class="hero-section">
      <h1 class="hero-title">Excel公式助手</h1>
      <p class="hero-subtitle">8+ 常用公式，实时预览，轻松学习</p>

      <div class="action-buttons">
        <n-button type="primary" size="large" @click="router.push('/recommend')">
          🔮 公式推荐
        </n-button>
        <n-button size="large" @click="router.push('/formulas')">
          浏览公式
        </n-button>
        <n-button size="large" @click="router.push('/practice')">
          开始练习
        </n-button>
      </div>

      <div class="stats-section">
        <div class="stat-card">
          <div class="stat-number">{{ formulas.length }}</div>
          <div class="stat-label">公式总数</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ practices.length }}</div>
          <div class="stat-label">练习题</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ tags.length }}</div>
          <div class="stat-label">标签分类</div>
        </div>
      </div>

      <div class="new-features">
        <h2>✨ 新功能</h2>
        <div class="features-grid">
          <div class="feature-item" @click="router.push('/learning-paths')">
            <div class="feature-icon">📚</div>
            <h3>学习路径</h3>
            <p>系统化学习，从入门到精通</p>
          </div>
          <div class="feature-item" @click="router.push('/real-cases')">
            <div class="feature-icon">💼</div>
            <h3>实战案例</h3>
            <p>真实场景，快速应用到工作</p>
          </div>
          <div class="feature-item" @click="router.push('/combinations')">
            <div class="feature-icon">🔗</div>
            <h3>公式组合</h3>
            <p>多个公式组合，解决复杂问题</p>
          </div>
        </div>
      </div>

      <div class="feature-cards">
        <div class="feature-card">
          <div class="feature-icon">🔮</div>
          <h3>公式推荐</h3>
          <p>智能分析数据，自动推荐公式</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">📚</div>
          <h3>公式浏览</h3>
          <p>8+ 常用公式，支持标签筛选</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🎯</div>
          <h3>实时预览</h3>
          <p>4 种示例格式，实时响应</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">✏️</div>
          <h3>公式练习</h3>
          <p>示例展示 + 练习区域</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">⭐</div>
          <h3>公式收藏</h3>
          <p>收藏夹管理，随时查看</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">⚖️</div>
          <h3>公式对比</h3>
          <p>多公式对比，选择最佳方案</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { NButton } from 'naive-ui'
import { formulas, practices, tags } from '../utils/data'

const router = useRouter()
</script>

<style scoped lang="scss">
.home-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.hero-section {
  text-align: center;
  color: white;
  max-width: 900px;
}

.hero-title {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.hero-subtitle {
  font-size: 1.5rem;
  margin-bottom: 3rem;
  opacity: 0.9;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 4rem;
  flex-wrap: wrap;
}

.stats-section {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;
}

.stat-card {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
  min-width: 150px;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.875rem;
  opacity: 0.9;
}

.new-features {
  margin-bottom: 3rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.new-features h2 {
  margin: 0 0 1.5rem 0;
  text-align: center;
  color: white;
  font-size: 1.5rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.feature-item {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s;
  border: 1px solid rgba(255, 255, 255, 0.1);

  &:hover {
    transform: translateY(-4px);
    background: rgba(255, 255, 255, 0.2);
  }
}

.feature-item .feature-icon {
  font-size: 2rem;
  margin-bottom: 0.75rem;
}

.feature-item h3 {
  margin: 0.5rem 0;
  font-size: 1.125rem;
  font-weight: 600;
}

.feature-item p {
  margin: 0;
  font-size: 0.875rem;
  opacity: 0.8;
}

.feature-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.feature-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-4px);
  }
}

.feature-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.feature-card p {
  font-size: 0.875rem;
  opacity: 0.8;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1.25rem;
  }

  .action-buttons {
    flex-direction: column;
  }

  .action-buttons .n-button {
    width: 100%;
  }

  .feature-cards {
    grid-template-columns: 1fr;
  }
}
</style>
