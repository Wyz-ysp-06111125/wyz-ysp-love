<template>
  <div class="home-page">
    <div class="container">
      <h1 class="page-title">数据列表</h1>
      
      <div class="search-section card">
        <div class="search-form">
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="搜索数据..."
            @input="handleSearch"
          >
          <select v-model="filterCategory" @change="handleSearch">
            <option value="">所有分类</option>
            <option value="技术">技术</option>
            <option value="市场">市场</option>
            <option value="财务">财务</option>
            <option value="人力资源">人力资源</option>
          </select>
          <button @click="handleSearch">搜索</button>
        </div>
      </div>
      
      <div class="loading-indicator" v-if="loading">
        <div class="spinner"></div>
        <p>加载中...</p>
      </div>
      
      <div v-else-if="filteredData.length === 0" class="no-data card">
        <p>没有找到匹配的数据</p>
      </div>
      
      <div v-else class="data-grid">
        <div v-for="(item, index) in filteredData" :key="index" class="data-card card">
          <div class="data-header">
            <h3>{{ item.title }}</h3>
            <span class="category-badge">{{ item.category }}</span>
          </div>
          <p class="data-description">{{ item.description }}</p>
          <div class="data-footer">
            <span class="data-date">{{ formatDate(item.date) }}</span>
            <router-link :to="`/detail/${item.id}`" class="view-details">查看详情</router-link>
          </div>
        </div>
      </div>
      
      <div class="pagination" v-if="totalPages > 1">
        <button 
          :disabled="currentPage === 1" 
          @click="changePage(currentPage - 1)"
        >
          上一页
        </button>
        <span>{{ currentPage }} / {{ totalPages }}</span>
        <button 
          :disabled="currentPage === totalPages" 
          @click="changePage(currentPage + 1)"
        >
          下一页
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchData } from '@/services/dataService';

export default {
  name: 'HomePage',
  data() {
    return {
      allData: [],
      filteredData: [],
      searchQuery: '',
      filterCategory: '',
      loading: true,
      currentPage: 1,
      itemsPerPage: 6
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.filteredData.length / this.itemsPerPage);
    },
    paginatedData() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredData.slice(start, end);
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
      try {
        // 从服务获取数据
        const data = await fetchData();
        this.allData = data;
        this.applyFilters();
      } catch (error) {
        console.error('加载数据失败:', error);
      } finally {
        this.loading = false;
      }
    },
    handleSearch() {
      this.currentPage = 1;
      this.applyFilters();
    },
    applyFilters() {
      let result = [...this.allData];
      
      // 应用搜索过滤
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        result = result.filter(item => 
          item.title.toLowerCase().includes(query) || 
          item.description.toLowerCase().includes(query)
        );
      }
      
      // 应用分类过滤
      if (this.filterCategory) {
        result = result.filter(item => item.category === this.filterCategory);
      }
      
      this.filteredData = result;
    },
    changePage(page) {
      this.currentPage = page;
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('zh-CN');
    }
  }
}
</script>

<style scoped>
.home-page {
  padding: 30px 0;
}

.search-section {
  margin-bottom: 30px;
}

.search-form {
  display: flex;
  gap: 10px;
}

.search-form input {
  flex: 2;
  margin-bottom: 0;
}

.search-form select {
  flex: 1;
  margin-bottom: 0;
}

.search-form button {
  flex: 0 0 auto;
}

.data-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.data-card {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.data-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.data-header h3 {
  margin: 0;
  color: #2c3e50;
}

.category-badge {
  background-color: #3498db;
  color: white;
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 12px;
}

.data-description {
  flex: 1;
  margin-bottom: 15px;
  color: #555;
}

.data-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.data-date {
  color: #7f8c8d;
  font-size: 14px;
}

.view-details {
  color: #3498db;
  text-decoration: none;
}

.view-details:hover {
  text-decoration: underline;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
}

.pagination button {
  padding: 8px 15px;
}

.pagination button:disabled {
  background-color: #95a5a6;
  cursor: not-allowed;
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

.no-data {
  text-align: center;
  padding: 50px 0;
  color: #7f8c8d;
}
</style>