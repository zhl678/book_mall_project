$(function () {
    // 1.点击上部的li，当前li 添加current类，其余兄弟移除类
    $(".tab_list li").click(function () {
        // 链式编程操作
        $(this).addClass("current").siblings().removeClass("current");
        // 2.点击的同时，得到当前li 的索引号
        var index = $(this).index();
        console.log(index);
        // 3.让下部里面相应索引号的item显示，其余的item隐藏
        $(".tab_con .item").eq(index).show().siblings().hide();
    });


    // 添加收货地址


    $.ajax({
        type: 'get',
        url: 'http://localhost:9321/mall/common/open/areaInfo',
        success: function (result) {
            console.log(result);
            $.each(result.result.page, function (i, ele) {
                var areaName = ele.areaName;
                $('#province').append('<option value="' + i + '">' + areaName + '</option>')
            })
        }


    })
    $.ajax({
        type: 'get',
        url: 'http://localhost:9321/mall/common/open/areaInfo',
        success: function (result) {
            console.log(result);
            $.each(result.result.page, function (i, ele) {
                var areaName = ele.areaName;
                $('#province2').append('<option value="' + i + '">' + areaName + '</option>')
            })
        }


    })
    $('#province').change(function () {
        $('#city .options').remove();
        var options1 = $('#province option:selected').val();
        if (options1 != "") {
            $.ajax({
                type: 'get',
                url: 'http://localhost:9321/mall/common/open/areaInfo',
                success: function (result) {
                    $.each(result.result.page[options1].childArea, function (i, ele) {
                        $('#city').append('<option value="' + i + '" class="options">' + ele.areaName + '</option>')
                    })
                }


            })
        }
    })
    $('#province2').change(function () {
        $('#city2 .options').remove();
        var options1 = $('#province2 option:selected').val();
        if (options1 != "") {
            $.ajax({
                type: 'get',
                url: 'http://localhost:9321/mall/common/open/areaInfo',
                success: function (result) {
                    $.each(result.result.page[options1].childArea, function (i, ele) {
                        $('#city2').append('<option value="' + i + '" class="options">' + ele.areaName + '</option>')
                    })
                }


            })
        }
    })
    $('#city').change(function () {
        $('#district .options').remove();
        var options1 = $('#province option:selected').val();
        var options2 = $('#city option:selected').val();
        if (options2 != "") {
            $.ajax({
                type: 'get',
                url: 'http://localhost:9321/mall/common/open/areaInfo',
                success: function (result) {
                    $.each(result.result.page[options1].childArea[options2].childArea, function (i, ele) {
                        $('#district').append('<option value="' + i + '" class="options">' + ele.areaName + '</option>')
                    })
                }


            })
        }
    })
    $('#city2').change(function () {
        $('#district2 .options').remove();
        var options1 = $('#province2 option:selected').val();
        var options2 = $('#city2 option:selected').val();
        if (options2 != "") {
            $.ajax({
                type: 'get',
                url: 'http://localhost:9321/mall/common/open/areaInfo',
                success: function (result) {
                    $.each(result.result.page[options1].childArea[options2].childArea, function (i, ele) {
                        $('#district2').append('<option value="' + i + '" class="options">' + ele.areaName + '</option>')
                    })
                }


            })
        }
    })
    $('#add_adress').click(function () {
        $.ajax({
            headers: { token: localStorage.getItem('token') },
            type: 'get',
            url: 'http://localhost:9321/mall/user/addressList',
            data: { pageNum: '1', pageSize: '8' },
            success: function (res) {
                if (res.result.page.total == '8') {
                    $('.addressList').after('<i style="color:red;">您的收货地址已满8个，无法添加</i>');
                } else { $('#myModal').modal('show') }
            }
        })

    })
    $('#adressAdd').click(function () {
        $.ajax({
            type: 'get',
            url: 'http://localhost:9321/mall/common/open/areaInfo',
            success: function (result) {
                var index1 = $('#province').val();
                var index2 = $('#city').val();
                var index3 = $('#district').val();
                var provinceId = result.result.page[index1].areaId;
                var cityId = result.result.page[index1].childArea[index2].areaId;
                var countyId = result.result.page[index1].childArea[index2].childArea[index3].areaId;
                var receiver = $('#receiver').val();
                var connectMobile = $('#connectMobile').val();
                var address = $('#address').val();
                var defaultFlag = $('#defaultFlag').prop('checked').toString();
                $.ajax({
                    headers: { token: localStorage.getItem('token') },
                    type: 'post',
                    url: 'http://localhost:9321/mall/user/addAddress',
                    data: {
                        receiver: receiver, connectMobile: connectMobile, defaultFlag: defaultFlag, address: address, provinceId: provinceId, cityId: cityId, countyId: countyId
                    },
                    success: function (res) {
                        addressList();
                    }

                })
            }
        })



    })
    // 地址列表
    function addressList() {
        $.ajax({
            headers: { token: localStorage.getItem('token') },
            type: 'get',
            url: 'http://localhost:9321/mall/user/addressList',
            data: { pageNum: '1', pageSize: '8' },
            success: function (res) {
                $('.addressList tbody').empty();
                $.each(res.result.page.list, function (i, ele) {
                    if (ele.defaultFlag == true) {
                        $('.addressList tbody').append('<tr id="' + ele.addressId + '"><td id="receiverTd">' + ele.receiver + '</td><td id="connectMobileTd">' + ele.connectMobil + '</td><td>' + ele.provinceName + ele.cityName + ele.countyName + '</td><td id="addressTd">' + ele.address + '</td><td><a class="editAddress">编辑</a></td><td>默认地址</td></tr>')
                    } else { $('.addressList tbody').append('<tr id="' + ele.addressId + '"><td id="receiverTd">' + ele.receiver + '</td><td id="connectMobileTd">' + ele.connectMobil + '</td><td>' + ele.provinceName + ele.cityName + ele.countyName + '</td><td id="addressTd">' + ele.address + '</td><td><a class="editAddress">编辑</a></td><td></td></tr>') }
                })
            }
        })
    }
    addressList();

    $('.addressList tbody').on('click', '.editAddress', function () {
        var a = '1+2+3';
        console.log(a.split('+'));
        $('#receiver2').val($(this).parent().siblings('#receiverTd').text());
        $('#connectMobile2').val($(this).parent().siblings('#connectMobileTd').text());
        $('#address2').val($(this).parent().siblings('#addressTd').text());
        addressId = $(this).parent().parent().attr('id');
        console.log(addressId);
        $('#myModal2').modal('show');
    })
    $('#edit-address').click(function () {
        $.ajax({
            headers: { token: localStorage.getItem('token') },
            type: 'get',
            url: 'http://localhost:9321/mall/common/open/areaInfo',
            success: function (result) {
                var index1 = $('#province2').val();
                var index2 = $('#city2').val();
                var index3 = $('#district2').val();
                var provinceId = result.result.page[index1].areaId;
                var cityId = result.result.page[index1].childArea[index2].areaId;
                var countyId = result.result.page[index1].childArea[index2].childArea[index3].areaId;
                var receiver = $('#receiver2').val();
                var connectMobile = $('#connectMobile2').val();
                var address = $('#address2').val();
                var defaultFlag = $('#defaultFlag2').prop('checked').toString();
                console.log(defaultFlag);
                $.ajax({
                    headers: { token: localStorage.getItem('token') },
                    type: 'post',
                    url: 'http://localhost:9321/mall/user/editAddress',
                    data: {
                        receiver: receiver, connectMobile: connectMobile, defaultFlag: defaultFlag, address: address, provinceId: provinceId, cityId: cityId, countyId: countyId, addressId: addressId
                    },
                    success: function (res) {
                        addressList();
                    }

                })
            }
        })

    })
    $.ajax({
        headers: { token: localStorage.getItem('token') },
        type: 'get',
        url: 'http://localhost:9321/mall/order/orderList',
        data: { pageNum: '1', pageSize: '10' },
        success: function (res) {
            $.each(res.result.page.list, function (i, ele) {
                $('.order-list tbody').append('<tr><td>' + ele.orderNo + '</td><td>' + ele.bookName + '</td><td>' + ele.orderNum + '</td><td>' + ele.orderPrice + '</td><td>' + ele.payAmount + '</td><td>' + ele.receiver + '</td><td>' + ele.recdiptAddress + '</td><td>' + ele.connectMobile + '</td><td>待发货</td></tr>')
            })
        }
    })
})