module.exports = {
  devServer: {
    port: 8081, // 修改为其他未被占用的端口
    open: true
  },
  // 添加以下配置以减少构建体积
  productionSourceMap: false,
  // 简化CSS处理
  css: {
    sourceMap: false,
    extract: process.env.NODE_ENV === 'production'
  },
  // 优化构建性能
  configureWebpack: {
    performance: {
      hints: false
    }
  }
}