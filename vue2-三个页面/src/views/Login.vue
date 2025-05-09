<template>
  <div class="login-page">
    <div class="login-card">
      <h1>数据管理系统</h1>
      <!-- 登录表单，阻止默认提交行为，使用自定义login方法 -->
      <form @submit.prevent="login">
        <div class="form-group">
          <label for="username">用户名</label>
          <input 
            type="text" 
            id="username" 
            v-model="username" 
            placeholder="请输入用户名"
            required
          >
        </div>
        <div class="form-group">
          <label for="password">密码</label>
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            placeholder="请输入密码"
            required
          >
        </div>
        <!-- 错误信息显示区域 -->
        <div class="error-message" v-if="errorMessage">{{ errorMessage }}</div>
        <button type="submit" class="login-btn" :disabled="loading">
          {{ loading ? '登录中...' : '登录' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginPage',
  data() {
    return {
      username: '', // 用户名
      password: '', // 密码
      errorMessage: '', // 错误信息
      loading: false // 加载状态
    }
  },
  created() {
    // 如果已登录，直接跳转到首页
    if (this.$store.state.isLoggedIn) {
      this.$router.push('/home');
    }
  },
  methods: {
    login() {
      // 设置加载状态，清空错误信息
      this.loading = true;
      this.errorMessage = '';
      
      // 模拟登录请求，实际项目中应替换为API调用
      setTimeout(() => {
        // 简单的用户名密码验证
        if (this.username === 'admin' && this.password === 'admin123') {
          // 登录成功，更新状态并跳转
          this.$store.commit('setLoggedIn', true);
          this.$router.push('/home');
        } else {
          // 登录失败，显示错误信息
          this.errorMessage = '用户名或密码错误';
        }
        this.loading = false;
      }, 1000);
    }
  }
}
</script>

<style scoped>
.login-page {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #3498db, #8e44ad);
}

.login-card {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  padding: 30px;
  width: 350px;
}

.login-card h1 {
  text-align: center;
  margin-bottom: 20px;
  color: #2c3e50;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.login-btn {
  width: 100%;
  padding: 10px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}

.login-btn:hover {
  background-color: #2980b9;
}

.login-btn:disabled {
  background-color: #95a5a6;
}

.error-message {
  color: #e74c3c;
  margin: 10px 0;
  text-align: center;
}
</style>