// 搜索
$('#form_search').submit(function () {

    var params = $(this).serializeArray();
    localStorage.setItem('search_bookName', params[0].value);
    window.open('search.html');
})

// 登录状态
function state() {
    if (localStorage.getItem('userName')) {
        $('.nav dl dt').text('Hi,' + localStorage.getItem('userName'));
        $('#login_li').css('visibility', 'hidden');
        $('.nav dl').css('visibility', 'visible');
    } else {
        $('#login_li').css('visibility', 'visible');
        $('.nav dl').css('visibility', 'hidden');
    }
}
state();
$('#signout').on('click', function () {
    confirm('确定退出登录？');
    localStorage.removeItem('userName');
    localStorage.removeItem('token');
    location.reload();
})