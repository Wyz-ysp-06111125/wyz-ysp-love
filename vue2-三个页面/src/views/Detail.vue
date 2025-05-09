<template>
  <div class="detail-page">
    <div class="container">
      <div class="back-link">
        <router-link to="/home">
          &larr; 返回列表
        </router-link>
      </div>
      
      <div class="loading-indicator" v-if="loading">
        <div class="spinner"></div>
        <p>加载中...</p>
      </div>
      
      <div v-else-if="error" class="error-message card">
        <p>{{ error }}</p>
        <button @click="$router.push('/home')">返回首页</button>
      </div>
      
      <div v-else class="detail-content">
        <div class="detail-header card">
          <div class="detail-title-section">
            <h1>{{ data.title }}</h1>
            <span class="category-badge">{{ data.category }}</span>
          </div>
          <div class="detail-meta">
            <span class="detail-date">发布日期: {{ formatDate(data.date) }}</span>
            <span class="detail-id">ID: {{ data.id }}</span>
          </div>
        </div>
        
        <div class="detail-body card">
          <h2>详细描述</h2>
          <p>{{ data.description }}</p>
        </div>
        
        <div class="detail-actions card">
          <button class="edit-btn" @click="editData">编辑</button>
          <button class="delete-btn" @click="confirmDelete">删除</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchDataById } from '@/services/dataService';

export default {
  name: 'DetailPage',
  data() {
    return {
      data: null,
      loading: true,
      error: null
    }
  },
  created() {
    // 检查登录状态
    if (!this.$store.state.isLoggedIn) {
      this.$router.push('/login');
      return;
    }
    
    this.loadData();
  },
  methods: {
    async loadData() {
      this.loading = true;
      this.error = null;
      
      try {
        const id = this.$route.params.id;
        this.data = await fetchDataById(id);
      } catch (error) {
        console.error('加载数据详情失败:', error);
        this.error = '无法加载数据详情，请稍后重试';
      } finally {
        this.loading = false;
      }
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('zh-CN');
    },
    editData() {
      // 在实际应用中，这里会跳转到编辑页面或打开编辑模态框
      alert('编辑功能将在未来版本中实现');
    },
    confirmDelete() {
      if (confirm('确定要删除这条数据吗？此操作不可撤销。')) {
        // 在实际应用中，这里会调用删除API
        alert('删除功能将在未来版本中实现');
        this.$router.push('/home');
      }
    }
  }
}
</script>

<style scoped>
.detail-page {
  padding: 30px 0;
}

.back-link {
  margin-bottom: 20px;
}

.back-link a {
  color: #3498db;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
}

.back-link a:hover {
  text-decoration: underline;
}

.detail-content {
  max-width: 800px;
  margin: 0 auto;
}

.detail-header {
  margin-bottom: 20px;
}

.detail-title-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.detail-title-section h1 {
  margin: 0;
  color: #2c3e50;
}

.category-badge {
  background-color: #3498db;
  color: white;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 14px;
}

.detail-meta {
  display: flex;
  justify-content: space-between;
  color: #7f8c8d;
  font-size: 14px;
}

.detail-body {
  margin-bottom: 20px;
}

.detail-body h2 {
  color: #2c3e50;
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 20px;
}

.detail-body p {
  line-height: 1.6;
  color: #333;
}

.detail-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
}

.edit-btn {
  background-color: #f39c12;
}

.edit-btn:hover {
  background-color: #e67e22;
}

.delete-btn {
  background-color: #e74c3c;
}

.delete-btn:hover {
  background-color: #c0392b;
}

.loading-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px 0;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: #3498db;
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 15px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-message {
  text-align: center;
  padding: 50px 0;
  color: #e74c3c;
}

.error-message button {
  margin-top: 20px;
}
</style>