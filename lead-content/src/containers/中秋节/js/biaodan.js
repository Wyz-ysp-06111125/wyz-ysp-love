  //用户名验证
  document.form1.username.onkeyup=function(){
    var reg=/^[a-zA-Z]{1}[A-Z|a-z|0-9]{5,29}/;
     if(reg.test(this.value)&&this.value.length>=6&&this.value.length<=30){
         document.getElementById("namemsg").innerHTML="输入正确";
     }else{
        document.getElementById("namemsg").innerHTML="<img src='../images/错误.png' width='15' height='15'>";
     }
 }

 //密码验证
 document.form1.pwd.onkeyup=function(){
    var reg1=/[A-Za-z]+[0-9]+/;
     if(reg1.test(this.value)&&this.value.length>=6&&this.value.length<=8){
         document.getElementById("pwdmsg").innerHTML="输入正确";
     }else{
         document.getElementById("pwdmsg").innerHTML="<img src='../images/错误.png' width='15' height='15'>";
     }
 }
 //确认密码
 document.form1.pwd1.onkeyup=function(){
     if(this.value==document.form1.pwd.value&&this.value!=""){
         document.getElementById("pwd1msg").innerHTML="输入正确";
     }else{
         document.getElementById("pwd1msg").innerHTML="<img src='../images/错误.png' width='15' height='15'>";
     }
 }
 //手机号验证
 document.form1.phone.onkeyup=function(){
     var reg2=/^(13|14|15|17|18)[0-9]{9}/;
     if(reg2.test(this.value)&&this.value.length==11){
         document.getElementById("iphone1").innerHTML="输入正确";
     }else{
         document.getElementById("iphone1").innerHTML="<img src='../images/错误.png' width='15' height='15'>";
     }
   }
 //座机号验证
 document.form1.phone1.onkeyup=function(){
     var reg3=/^[0-9]{3,4}(\-{1})[0-9]{7,8}/;
     if(reg3.test(this.value)&&this.value.length==13||this.value.length==12){
         document.getElementById("iphone2").innerHTML="输入正确";
     }else{
         document.getElementById("iphone2").innerHTML="<img src='../images/错误.png' width='15' height='15'>";
     }
 }
 //身份证号验证
 document.form1.sfzid.onkeyup=function(){
     var reg4=/^\d{17}[(0-9)|X|x ]{1}/;
     if(reg4.test(this.value)&&this.value.length==18){
         document.getElementById("sfzmsg").innerHTML="输入正确";
     }else{
         document.getElementById("sfzmsg").innerHTML="<img src='../images/错误.png' width='15' height='15'>";
     }
 }

 //注册按钮方法
 function test(){
     var str="输入正确"
     if(document.getElementById("namemsg").innerHTML!==str){
        document.getElementById("namemsg").innerHTML="<img src='../images/错误.png' width='15' height='15'>";
        document.form1.username.focus();
        document.form1.username.value="";
        return false;
     }
     if(document.getElementById("pwdmsg").innerHTML!==str){
        document.getElementById("pwdmsg").innerHTML="<img src='../images/错误.png' width='15' height='15'>";
        document.form1.pwd.focus();
        document.form1.pwd.value="";
        return false;
     }
     if(document.getElementById("pwd1msg").innerHTML!==str){
        document.getElementById("pwd1msg").innerHTML="<img src='../images/错误.png' width='15' height='15'>";
        document.form1.pwd1.focus();
        document.form1.pwd1.value="";
        return false;
     }
     if(document.getElementById("iphone1").innerHTML!==str){
        document.getElementById("iphone1").innerHTML="<img src='../images/错误.png' width='15' height='15'>";
        document.form1.phone.focus();
        document.form1.phone.value="";
        return false;
     }
     if(document.getElementById("iphone2").innerHTML!==str){
        document.getElementById("iphone2").innerHTML="<img src='../images/错误.png' width='15' height='15'>";
        document.form1.phone1.focus();
        document.form1.phone.value="";
        return false;
     }
 }