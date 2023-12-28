var code;

function createCode() {
	var codeLength = 4;
	var checkCode = document.getElementById("checkCode");
	var selectChar = new Array(2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z');
	var charIndex = Math.floor(Math.random() * 32);
	code = selectChar[charIndex];
	for (var i = 1; i < codeLength; i++) {
		var charIndex = Math.floor(Math.random() * 32);
		code += selectChar[charIndex];
	}
	if (code.length != codeLength) {
		createCode();
	}
	document.getElementById("checkCode").value = code;
}

//注册按钮  
function registerValidate() {
    // 获取input内容
	var inputCode = document.getElementById("input1").value.toUpperCase();
    // 获取input内容
	var usrName = document.getElementById("usr").value;
    // 获取input内容
	var passWD = document.getElementById("pwd").value;
                var passWD_1 = document.getElementById("pwd_1").value;
                //判断了不能交 admin 输入就会给你报错
                if(usrName=="Admin"){
                                 alert("很抱歉，该用户名已注册，请更换注册用户名!");
                                 document.getElementById("usr").focus();
                                 return false;
              }
              //不能为空
                if(usrName==""){
                                 alert("很抱歉，用户名不能为空!");
                                 document.getElementById("usr").focus();
                                 return false;
              }
                //不能为空
               if(passWD==""){
                                 alert("很抱歉，密码不能为空!");
                                 document.getElementById("pwd").focus();
                                 return false;
              }
                //不能为空
              if(passWD_1==""){
                                 alert("很抱歉，请确认输入密码!");
                                 document.getElementById("pwd_1").focus();
                                 return false;
              }
                //不能为空
               if(inputCode==""){
                                 alert("请输入验证码");
                                 document.getElementById("input1") .focus();
                                 return false;
              }
                //不能为空
             if(passWD!=passWD_1){
                                 alert("输入的密码不一致，请重新输入！");
                                 document.getElementById("pwd").value="";
                                 document.getElementById("pwd_1").value="";
                                 document.getElementById("pwd").focus();
                                 return false;
              }
              if  (passWD==passWD_1) {
                if (inputCode != code) {
		alert("验证码输入错误！");
		createCode();
		document.getElementById("input1").value="";
		return false;
	}
                else {
		alert("恭喜"+usrName+"注册成功！");
		jump("index.html");
		return true;
	}
    }     
}

function jump(address) {
	if (address == null)
		window.location.href="http://www.sina.com.cn";
	else
		window.location.href=address;
}