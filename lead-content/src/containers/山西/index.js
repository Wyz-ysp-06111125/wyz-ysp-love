function goto() {
  window.location.href = "./data.html";
}
function gotodata() {
  //获取名字
  const name = document.getElementById("name").value;
  //   获取手机号
  const phone = document.getElementById("phone").value;
  //   获取邮箱
  const email = document.getElementById("email").value;
  //   获取留言
  const content = document.getElementById("content").value;
  var reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
  if (
    name &&
    phone &&
    (email != document.getElementById("email").value.search(reg)) != -1 &&
    content
  ) {
    alert(`名字:${name}手机号:${phone} 邮箱:${email}留言:${content}`);
    alert("留言成功");
  } else {
    alert("请完善页面中未填写的信息");
  }
}
