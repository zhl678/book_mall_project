$(function () {
    $('#car').on('click', function () {
        if (localStorage.getItem('token')) {
            window.open('car.html');
        } else {
            window.location.href = 'login.html';
        }
    })
    carList();
    function carList() {
        $.ajax({
            headers: { token: localStorage.getItem('token') },
            type: 'get',
            url: 'http://localhost:9321/mall/shoppingCart/bookList',
            data: {
                pageNum: '1', pageSize: '10'
            }, success: function (res) {
                console.log(res);
                $.each(res.result.page.list, function (i, ele) {
                    var bookIconUrl = ele.bookIconUrl;
                    var bookName = ele.bookName;
                    var currPrice = ele.currPrice;
                    var bookNum = ele.bookNum;
                    var shoppingCartId = ele.shoppingCartId;
                    var bookId = ele.bookId;
                    $('.cart-item-list').append('<div class="cart-item" id="' + shoppingCartId + '"><div class="p-checkbox"><input type="checkbox" name="" id="" class="j-checkbox"></div><div class="p-goods" id="' + bookId + '"><div class="p-img"><img src="' + bookIconUrl + '" alt=""></div><div class="p-msg">' + bookName + '</div></div><div class="p-price">' + '￥' + currPrice + '</div><div class="p-num"><div class="quantity-form"><a href="javascript:;" class="decrement">-</a><input type="text" class="itxt" value="' + bookNum + '"><a href="javascript:;" class="increment">+</a></div></div><div class="p-sum">￥12.60</div><div class="p-action"><a href="javascript:;">删除</a></div></div>')
                })
                getSum();
                $('.itxt').each(function () {
                    n = $(this).val();
                    var p = $(this).parents(".p-num").siblings(".p-price").html();
                    p = p.substr(1);
                    var price = (p * n).toFixed(2);
                    // 小计模块 
                    // toFixed(2) 可以让我们保留2位小数
                    $(this).parents(".p-num").siblings(".p-sum").html("￥" + price);
                })

            }

        })
    }






    // 1. 全选 全不选功能模块
    // 就是把全选按钮（checkall）的状态赋值给 三个小的按钮（j-checkbox）就可以了
    // 事件可以使用change
    $(".checkall").change(function () {
        // console.log($(this).prop("checked"));
        $(".j-checkbox, .checkall").prop("checked", $(this).prop("checked"));
        if ($(this).prop("checked")) {
            // 让所有的商品添加 check-cart-item 类名
            $(".cart-item").addClass("check-cart-item");
        } else {
            // check-cart-item 移除
            $(".cart-item").removeClass("check-cart-item");
        }
        getSum();
    });
    // 2. 如果小复选框被选中的个数等于3 就应该把全选按钮选上，否则全选按钮不选。
    $(".cart-item-list").on('change', '.j-checkbox', function () {
        // if(被选中的小的复选框的个数 === 3) {
        //     就要选中全选按钮
        // } else {
        //     不要选中全选按钮
        // }
        // console.log($(".j-checkbox:checked").length);
        // $(".j-checkbox").length 这个是所有的小复选框的个数
        if ($(".j-checkbox:checked").length === $(".j-checkbox").length) {
            $(".checkall").prop("checked", true);
        } else {
            $(".checkall").prop("checked", false);
        }
        if ($(this).prop("checked")) {
            // 让当前的商品添加 check-cart-item 类名
            $(this).parents(".cart-item").addClass("check-cart-item");
        } else {
            // check-cart-item 移除
            $(this).parents(".cart-item").removeClass("check-cart-item");
        }
        getSum();
    });





    // 3. 增减商品数量模块 首先声明一个变量，当我们点击+号（increment），就让这个值++，然后赋值给文本框。
    $(".cart-item-list").on('click', '.increment', function () {
        // 得到当前兄弟文本框的值
        var n = $(this).siblings(".itxt").val();
        // console.log(n);
        n++;
        $(this).siblings(".itxt").val(n);
        // 3. 计算小计模块 根据文本框的值 乘以 当前商品的价格  就是 商品的小计
        // 当前商品的价格 p  
        var p = $(this).parents(".p-num").siblings(".p-price").html();
        // console.log(p);
        p = p.substr(1);
        console.log(p);
        var price = (p * n).toFixed(2);
        // 小计模块 
        // toFixed(2) 可以让我们保留2位小数
        $(this).parents(".p-num").siblings(".p-sum").html("￥" + price);
        getSum();
    })
    $(".cart-item-list").on('click', '.decrement', function () {
        // 得到当前兄弟文本框的值
        var n = $(this).siblings(".itxt").val();
        if (n == 1) {
            return false;
        }
        // console.log(n);
        n--;
        $(this).siblings(".itxt").val(n);
        // var p = $(this).parent().parent().siblings(".p-price").html();
        // parents(".p-num") 返回指定的祖先元素
        var p = $(this).parents(".p-num").siblings(".p-price").html();
        // console.log(p);
        p = p.substr(1);
        console.log(p);
        // 小计模块 
        $(this).parents(".p-num").siblings(".p-sum").html("￥" + (p * n).toFixed(2));
        getSum();
    })
    //  4. 用户修改文本框的值 计算 小计模块  
    $(".cart-item-list").on('change', '.itxt', function () {
        // 先得到文本框的里面的值 乘以 当前商品的单价 
        var n = $(this).val();
        // 当前商品的单价
        var p = $(this).parents(".p-num").siblings(".p-price").html();
        // console.log(p);
        p = p.substr(1);
        $(this).parents(".p-num").siblings(".p-sum").html("￥" + (p * n).toFixed(2));
        getSum();
    });
    // 5. 计算总计和总额模块
    getSum();

    function getSum() {
        var count = 0; // 计算总件数 
        var money = 0; // 计算总价钱
        $(".j-checkbox:checked").parents('.cart-item').find('.itxt').each(function (i, ele) {
            count += parseInt($(ele).val());
        });
        $(".amount-sum em").text(count);
        $(".j-checkbox:checked").parents('.cart-item').find('.p-sum').each(function (i, ele) {
            money += parseFloat($(ele).text().substr(1));
        });
        $(".price-sum em").text("￥" + money.toFixed(2));
    }
    // 6. 删除商品模块
    // (1) 商品后面的删除按钮
    $(".cart-item-list").on('click', '.p-action a', function () {
        // 删除的是当前的商品 
        var shoppingCartId = $(this).parents(".cart-item").attr('id');
        $.ajax({
            headers: { token: localStorage.getItem('token') },
            type: 'post',
            url: 'http://localhost:9321/mall/shoppingCart/cancel',
            data: { shoppingCartId: shoppingCartId },
            success: function () {
                $('.cart-item-list').empty();
                carList();

            }
        })

    });
    // (2) 删除选中的商品
    $(".remove-batch").click(function () {
        var eachcount = 0;
        // 删除的是小的复选框选中的商品
        $('.j-checkbox:checked').each(function () {

            var shoppingCartId = $(this).parents('.cart-item').attr('id');
            $.ajax({
                headers: { token: localStorage.getItem('token') },
                type: 'post',
                url: 'http://localhost:9321/mall/shoppingCart/cancel',
                data: { shoppingCartId: shoppingCartId },
                success: function () {
                    console.log('ok');
                    eachcount++;
                    if (eachcount >= $('.j-checkbox:checked').length) {
                        location.reload();
                    }
                }
            })
        })


    });



    // (3) 清空购物车 删除全部商品
    $(".clear-all").click(function () {
        $(".cart-item").remove();
        getSum();
    })

    $('.btn-area').click(function () {
        $('.j-checkbox:checked').each(function () {

            var bookId = $(this).parents('.cart-item').attr('id');

        })
    })

    $('.btn-area').click(function () {
        $('.goods-list').remove();
        $('.modal-body .radio').remove();
        $.each($(".j-checkbox:checked").parents('.cart-item'), function (i, ele) {
            var src = $(ele).find('img').attr('src');
            var bookName = $(ele).find('.p-msg').text();
            var pn1 = $(ele).find('.p-price').text();
            var pn2 = $(ele).find('.itxt').val();
            var ps2 = $(ele).find('.p-sum').text();
            var priceSum = $('.price-sum em').text();
            $('#myModal .modal-body').prepend('<div class="clearfix goods-list"><div><div class="bookImg"><img src="' + src + '"></div><div class="bookName">' + bookName + '</div></div><div class="pn"><span class="pn1">' + pn1 + '</span><span class="pn2">&nbsp;x&nbsp;' + pn2 + '</span></div><div class="ps"><span class="ps1">小计</span><span class="ps2">&nbsp;' + ps2 + '</span></div></div>')
        })
        $('#priceSum em').empty();
        $('#priceSum em').text($('.price-sum em').text());
        $.ajax({
            headers: { token: localStorage.getItem('token') },
            type: 'get',
            url: 'http://localhost:9321/mall/user/addressList',
            data: { pageNum: '1', pageSize: '8' },
            success: function (res) {
                $.each(res.result.page.list, function (i, ele) {
                    if (ele.defaultFlag) {
                        $('#priceSum').before(' <div class="radio"><label><input type="radio" name="address" id="' + ele.addressId + '" value="option2" checked>' + ele.receiver + ' ' + ele.connectMobil + ' ' + ele.provinceName + ele.cityName + ele.countyName + ele.address + '</label></div>')
                    } else {
                        $('#priceSum').before(' <div class="radio"><label><input type="radio" name="address" id="' + ele.addressId + '" value="option2">' + ele.receiver + ' ' + ele.connectMobil + ' ' + ele.provinceName + ele.cityName + ele.countyName + ele.address + '</label></div>')
                    }

                })
            }
        })
    })
    $('.pay').click(function () {
        $.each($(".j-checkbox:checked").parents('.cart-item'), function (i, ele) {
            var bookId = $(ele).find('.p-goods').attr('id');
            var orderNum = $(ele).find('.itxt').val();
            var receiptAddressId = $('input[name="address"]:checked').attr('id');
            $.ajax({
                headers: { token: localStorage.getItem('token') },
                type: 'post',
                url: 'http://localhost:9321/mall/order/placeOrder',
                data: { bookId: bookId, orderNum: orderNum, receiptAddressId: receiptAddressId },
                success: function (res) {

                }
            })
        })
    })

})