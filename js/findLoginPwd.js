
var curCount1;
var InterValObj1;
function sendMessage1() {
    curCount1 = 60;
    //设置button效果，开始计时
    $("#verifyCode").attr("disabled", "true");
    $("#verifyCode").val(+ curCount1 + "秒再获取");
    InterValObj1 = window.setInterval(SetRemainTime1, 1000); //启动计时器，1秒执行一次
    //向后台发送处理数据

}
function SetRemainTime1() {
    if (curCount1 == 0) {
        window.clearInterval(InterValObj1);//停止计时器
        $("#verifyCode").removeAttr("disabled");//启用按钮
        $("#verifyCode").text("重新发送");
    }
    else {
        curCount1--;
        $("#verifyCode").text(+ curCount1 + "秒再获取");
    }
}
$('#verifyCode').click(function () {
    sendMessage1();
    $.ajax({
        type: 'post',
        url: 'http://localhost:9321/mall//verify/open/sendVerifyCode',
        data: { verifyType: 'FIND_LOGIN_PWD', account: $('#phone').val() },
        success: function (res) {
            console.log(res);
        }
    })
})
$('form').submit(function () {
    var data = $(this).serializeArray();
    console.log(data);
    var pwd_data = $.md5(data[1].value);
    console.log(pwd_data);
    $.ajax({
        type: 'post',
        url: 'http://localhost:9321/mall/user/open/forgetLoginPwd',
        data: { bindMobile: data[0].value, newLoginPwd: pwd_data, verifyCode: data[2].value },
        success: function (res) {
            console.log(res);
            confirm('修改密码成功！');
        }
    })
})
