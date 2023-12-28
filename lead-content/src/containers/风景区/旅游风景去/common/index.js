function resetMedia () {
    var video = document.getElementById("myVideo")
    video.currentTime = 0
    video.play()
  }
  function resetmusic () {
    var audio = document.getElementById("myAudio")
    audio.currentTime = 0
    audio.play()
  }
  const form = document.getElementById("form");
  const username = document.getElementById("username");
  const email = document.getElementById("email");
  const passowrd = document.getElementById("password");
  const password2 = document.getElementById("password2");
  //提交按钮
  form.addEventListener('submit', (e) => {
      //不让他默认操作
      e.preventDefault();
      checkInputs();
  })
  function checkInputs() {
      //名字 去掉前后空格
      const usernameValue = username.value.trim();
      // 邮箱去掉前后空格
      const emailValue = email.value.trim();
      //密码去掉前后空格
      const passwordValue = passowrd.value.trim();
      //二次密码去掉前后空格
      const password2Value = password2.value.trim();
      //用户名验证去掉前后空格
      var flage = false
      if (usernameValue==="") {
          setErrorFor(username, "用户名不能为空");
          flage=false
      } else {
          setSuccessFor(username);
          flage=true
      }
      //邮箱验证
      if(emailValue===""){
          setErrorFor(email,"邮箱不能为空");
      }else if(!valiEmail(emailValue)){
          setErrorFor(email,"邮箱格式不正确，请重新输入");
          flage=false
      }else{
          setSuccessFor(email);
          flage=true
      }
      //密码验证
      if(passwordValue===""){
          setErrorFor(password,"密码不能为空");
          flage=false
      }else{
          setSuccessFor(passowrd)
          flage=true
      }
      //重复密码验证
      if(password2Value===""){
          setErrorFor(password2,"密码不能为空");
          flage=false
      }else if(passwordValue!==password2Value){
          setErrorFor(password2,"两次输入密码不一致，请再次输入")
          flage=false
      }else{
          setSuccessFor(password2)
          flage=true
      }
if(flage ==true){
alert("添加成功")
}

  }
  // 就是找到输入框  添加提醒失败的时候
  function setErrorFor(input, message) {
      const formControl = input.parentElement;
      const small = formControl.querySelector('small');
      small.textContent = message;
      formControl.classList.remove('success');
      formControl.classList.add('error');
  }
     // 就是找到输入框  添加提醒成功的时候
  function setSuccessFor(input) {
      const formControl = input.parentElement;
      formControl.classList.remove('error');
      formControl.classList.add('success');
      
  }
  function valiEmail(email){
      const regEmail = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;
      return regEmail.test(email);
  }