window.onload = function(){
    document.getElementById("form").onsubmit = function(){
        return checkUsername() && checkPassword();
    };
    document.getElementById("username").onblur = checkUsername;
    document.getElementById("password").onblur = checkPassword;
};

function checkUsername(){
    var username = document.getElementById("username").value;
    // js 正则表达式 要求密码的格式为6-12位，只能是字母、数字和下划线
    var reg_username = /^\w{6,12}$/;
    var flag = reg_username.test(username);
    var s_username = document.getElementById("s_username");
    if(flag){
        s_username.innerHTML = "<img width='35' height='25' src='img/gou.png'/>";
    }else{
        s_username.innerHTML = "用户名格式有误";
    }
    return flag;
}

function checkPassword(){
    var password = document.getElementById("password").value;
    //js 正则表达式 要求密码的格式为6-12位，只能是字母、数字和下划线
    var reg_password = /^\w{6,12}$/;
    var flag = reg_password.test(password);
    var s_password = document.getElementById("s_password");
    if(flag){
        s_password.innerHTML = "正确";
    }else{
        s_password.innerHTML = "密码格式有误";
    }
    return flag;
}
