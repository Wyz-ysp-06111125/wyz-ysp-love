<template>
  <div class="form-page">
    <div class="container">
      <h1 class="page-title">提交数据</h1>
      
      <div class="form-container card">
        <form @submit.prevent="submitForm">
          <div class="form-group">
            <label for="title">标题</label>
            <input 
              type="text" 
              id="title" 
              v-model="formData.title" 
              placeholder="请输入标题"
              required
            >
          </div>
          
          <div class="form-group">
            <label for="category">分类</label>
            <select 
              id="category" 
              v-model="formData.category"
              required
            >
              <option value="">请选择分类</option>
              <option value="技术">技术</option>
              <option value="市场">市场</option>
              <option value="财务">财务</option>
              <option value="人力资源">人力资源</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="description">描述</label>
            <textarea 
              id="description" 
              v-model="formData.description" 
              placeholder="请输入详细描述"
              rows="5"
              required
            ></textarea>
          </div>
          
          <div class="form-group">
            <label for="date">日期</label>
            <input 
              type="date" 
              id="date" 
              v-model="formData.date"
              required
            >
          </div>
          
          <div class="form-group">
            <label for="file">附件</label>
            <div class="file-upload">
              <input 
                type="file" 
                id="file" 
                @change="handleFileUpload"
              >
              <div class="file-info" v-if="formData.file">
                已选择: {{ formData.file.name }}
              </div>
            </div>
          </div>
          
          <div class="form-actions">
            <button type="button" class="reset-btn" @click="resetForm">重置</button>
            <button type="submit" :disabled="submitting">
              {{ submitting ? '提交中...' : '提交' }}
            </button>
          </div>
        </form>
      </div>
      
      <!-- 提交成功提示 -->
      <div class="success-message card" v-if="showSuccess">
        <div class="success-icon">✓</div>
        <h3>提交成功!</h3>
        <p>您的数据已成功提交到系统。</p>
        <button @click="resetForm">继续提交</button>
      </div>
    </div>
  </div>
</template>

<script>
import { submitFormData } from '@/services/dataService';

export default {
  name: 'FormPage',
  data() {
    return {
      formData: {
        title: '',
        category: '',
        description: '',
        date: this.formatDate(new Date()),
        file: null
      },
      submitting: false,
      showSuccess: false
    }
  },
  created() {
    // 检查登录状态
    if (!this.$store.state.isLoggedIn) {
      this.$router.push('/login');
    }
  },
  methods: {
    formatDate(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
    handleFileUpload(event) {
      this.formData.file = event.target.files[0] || null;
    },
    async submitForm() {
      this.submitting = true;
      
      try {
        // 调用服务提交表单数据
        await submitFormData(this.formData);
        this.showSuccess = true;
      } catch (error) {
        console.error('提交表单失败:', error);
        alert('提交失败，请稍后重试');
      } finally {
        this.submitting = false;
      }
    },
    resetForm() {
      this.formData = {
        title: '',
        category: '',
        description: '',
        date: this.formatDate(new Date()),
        file: null
      };
      this.showSuccess = false;
      
      // 重置文件输入
      const fileInput = document.getElementById('file');
      if (fileInput) {
        fileInput.value = '';
      }
    }
  }
}
</script>

<style scoped>
.form-page {
  padding: 30px 0;
}

.form-container {
  max-width: 800px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #555;
}

.file-upload {
  border: 2px dashed #ddd;
  padding: 15px;
  border-radius: 4px;
  text-align: center;
  transition: border-color 0.3s;
}

.file-upload:hover {
  border-color: #3498db;
}

.file-info {
  margin-top: 10px;
  font-size: 14px;
  color: #555;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 30px;
}

.reset-btn {
  background-color: #95a5a6;
}

.reset-btn:hover {
  background-color: #7f8c8d;
}

.success-message {
  max-width: 500px;
  margin: 30px auto;
  text-align: center;
  padding: 30px;
}

.success-icon {
  width: 60px;
  height: 60px;
  background-color: #2ecc71;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  margin: 0 auto 20px;
}

.success-message h3 {
  color: #2ecc71;
  margin-bottom: 10px;
}

.success-message p {
  margin-bottom: 20px;
  color: #555;
}

.success-message button {
  background-color: #2ecc71;
}

.success-message button:hover {
  background-color: #27ae60;
}
</style>