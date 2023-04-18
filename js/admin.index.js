$(function () {

    $(".nav li").click(function () {
        // 链式编程操作
        $(this).addClass("active").siblings().removeClass("active");
        // 2.点击的同时，得到当前li 的索引号
        var index = $(this).index();
        console.log(index);
        // 3.让下部里面相应索引号的item显示，其余的item隐藏
        $(".item").eq(index).show().siblings().hide();
    });

    // 轮播图
    bannerList();
    function bannerList() {
        $.ajax({
            headers: { token: localStorage.getItem('admin_token') },
            type: 'get',
            url: 'http://localhost:9331/backmgr/banner/bannerList',
            success: function (res) {
                $.each(res.result.page, function (i, ele) {
                    $('.banner-list tbody').prepend('<tr><td id="bannerId">' + ele.bannerId + '</td><td id="iconUrl">' + ele.iconUrl + '</td><td id="jumpLinks">' + ele.jumpLinks + '</td><td id="bannerStatus">' + ele.bannerStatusName + '</td><td><button type="button" class="btn btn-info banner-btn2" data-toggle="modal" data-target="#myModal">编辑</button></td></tr>')
                })
                $('.banner-list tbody tr').each(function (i, ele) {
                    var bannerStatus = $(ele).children('#bannerStatus').text();
                    if (bannerStatus == '下架') {
                        $(ele).children('td:last-child').append('<button type="button" class="btn btn-danger banner-btn1">删除</button>')
                    }
                })
            }


        })

    }

    $('.banner-list').on('click', '.banner-btn1', function () {
        var bannerId = $(this).parent().siblings('#bannerId').text();
        console.log(bannerId);

        $.ajax({
            headers: { token: localStorage.getItem('admin_token') },
            type: 'post',
            url: 'http://localhost:9331/backmgr/banner/delBanner',
            data: { bannerId: bannerId },
            success: function () {
                $('tbody').empty();
                bannerList();
            }

        })


    })
    $('.banner-list tbody').on('click', '.banner-btn2', function () {
        bannerId = $(this).parent().siblings('#bannerId').text();
        $('input[name="iconUrl"]').attr('value', $(this).parent().siblings('#iconUrl').text());
        $('input[name="jumpLinks"]').attr('value', $(this).parent().siblings('#jumpLinks').text());

    })
    $('.editBanner').click(function () {
        var data = $('#banner-form1').serializeArray();
        $.ajax({
            headers: { token: localStorage.getItem('admin_token') },
            type: 'post',
            url: 'http://localhost:9331/backmgr/banner/editBanner',
            data: {
                iconUrl: data[0].value, jumpLinks: data[1].value, bannerStatus: data[2].value, bannerSort: '0', bannerId: bannerId
            },
            success: function (result) {

                if (result.code == '200') {
                    $('tbody').empty();
                    bannerList();
                }


            }


        })
    })
    $('.banner-add').click(function () {
        var data = $('#banner-form2').serializeArray();
        $.ajax({
            headers: { token: localStorage.getItem('admin_token') },
            type: 'post',
            url: 'http://localhost:9331/backmgr/banner/addBanner',
            data: {
                iconUrl: data[0].value, jumpLinks: data[1].value, bannerStatus: data[2].value, bannerSort: '0'
            },
            success: function (result) {

                if (result.code == '200') {
                    $('tbody').empty();
                    bannerList();
                }


            }


        })
    })

    // 类别管理
    $.ajax({
        headers: { token: localStorage.getItem('admin_token') },
        type: 'get',
        url: 'http://localhost:9331/backmgr/category/categoryList',
        data: {
            pageNum: '1', pageSize: '8'
        },
        success: function (result) {
            var categoryStatus;
            $.each(result.result.page.list, function (i, ele) {
                if (ele.categoryStatus == true) {
                    categoryStatus = '上架';
                } else { categoryStatus = '下架'; }
                $('.categoryList tbody').append('<tr><td id="categoryId">' + ele.categoryId + '</td><td id="categoryName">' + ele.categoryName + '</td><td id="categoryLevel">' + ele.categoryLevel + '</td><td>' + ele.parentCategoryName + '</td><td id="parentCategoryId">' + ele.parentCategoryId + '</td><td id="categoryStatus">' + categoryStatus + '</td><td>' + ele.createTime + '</td><td><button type="button" class="btn btn-info category-btn1">编辑</button></td></tr>')
            })
            $('.categoryList tbody tr').each(function (i, ele) {
                var categoryStatusText = $(ele).children('#categoryStatus').text();
                if (categoryStatusText == '下架') {
                    $(ele).children('td:last-child').append('<button type="button" class="btn btn-danger category-btn2">删除</button>')
                }
            })
        }
    })

    $.ajax({
        headers: { token: localStorage.getItem('admin_token') },
        type: 'get',
        url: 'http://localhost:9331/backmgr/category/categoryList',
        data: {
            pageNum: '1', pageSize: '8'
        },
        success: function (result) {
            var totalPage = result.result.page.pages;
            $(".page3").pagination({
                currentPage: 1,
                totalPage: totalPage,
                callback: function (current) {
                    curPage3 = current.toString();
                    $.ajax({
                        headers: { token: localStorage.getItem('admin_token') },
                        type: 'get',
                        url: 'http://localhost:9331/backmgr/category/categoryList',
                        data: {
                            pageNum: curPage3, pageSize: '8'
                        },
                        success: function (result) {
                            var categoryStatus;
                            $('.categoryList tbody').empty();
                            $.each(result.result.page.list, function (i, ele) {
                                if (ele.categoryStatus == true) {
                                    categoryStatus = '上架';
                                } else { categoryStatus = '下架'; }
                                $('.categoryList tbody').append('<tr><td id="categoryId">' + ele.categoryId + '</td><td id="categoryName">' + ele.categoryName + '</td><td id="categoryLevel">' + ele.categoryLevel + '</td><td>' + ele.parentCategoryName + '</td><td id="parentCategoryId">' + ele.parentCategoryId + '</td><td id="categoryStatus">' + categoryStatus + '</td><td>' + ele.createTime + '</td><td id="operation"><button type="button" class="btn btn-info category-btn1">编辑</button></td></tr>')
                            })
                            $('.categoryList tbody tr').each(function (i, ele) {
                                var categoryStatusText = $(ele).children('#categoryStatus').text();
                                if (categoryStatusText == '下架') {
                                    $(ele).children('td:last-child').append('<button type="button" class="btn btn-danger category-btn2">删除</button>')
                                }
                            })
                        }
                    })

                }
            })

        }
    })






    $('.categoryList tbody').on('click', '.category-btn1', function () {

        categoryId = $(this).parent().siblings('#categoryId').text();
        console.log(categoryId);
        $('input[name="categoryName"]').val($(this).parent().siblings('#categoryName').text());
        $('input[name="categoryLevel"]').val($(this).parent().siblings('#categoryLevel').text());
        $('input[name="parentCategoryId"]').val($(this).parent().siblings('#parentCategoryId').text());
        $('#myModal7').modal('show');


    })
    $('.editCategory').click(function () {
        var data = $('#category-form1').serializeArray();
        console.log(data);
        $.ajax({
            headers: { token: localStorage.getItem('admin_token') },
            type: 'post',
            url: 'http://localhost:9331/backmgr/category/editCategory',
            data: {
                categoryId: categoryId, categoryName: data[0].value, categoryLevel: data[1].value, categoryStatus: data[3].value, parentCategoryId: data[2].value
            },
            success: function (result) {
                $('.categoryList tbody').empty();
                $.ajax({
                    headers: { token: localStorage.getItem('admin_token') },
                    type: 'get',
                    url: 'http://localhost:9331/backmgr/category/categoryList',
                    data: {
                        pageNum: curPage3, pageSize: '8'
                    },
                    success: function (result) {
                        var categoryStatus;
                        $.each(result.result.page.list, function (i, ele) {
                            if (ele.categoryStatus == true) {
                                categoryStatus = '上架';
                            } else { categoryStatus = '下架'; }
                            $('.categoryList tbody').append('<tr><td id="categoryId">' + ele.categoryId + '</td><td id="categoryName">' + ele.categoryName + '</td><td id="categoryLevel">' + ele.categoryLevel + '</td><td>' + ele.parentCategoryName + '</td><td id="parentCategoryId">' + ele.parentCategoryId + '</td><td id="categoryStatus">' + categoryStatus + '</td><td>' + ele.createTime + '</td><td><button type="button" class="btn btn-info category-btn1">编辑</button></td></tr>')
                        })
                        $('.categoryList tbody tr').each(function (i, ele) {
                            var categoryStatusText = $(ele).children('#categoryStatus').text();
                            if (categoryStatusText == '下架') {
                                $(ele).children('td:last-child').append('<button type="button" class="btn btn-danger category-btn2">删除</button>')
                            }
                        })
                    }
                })
            }

        })

    })
    $('input[name="categoryLevel3"]').blur(function () {
        if ($('input[name="categoryLevel3"]').val() == '1') {
            $('.parentCategoryId3').hide();
        } else {
            $('.parentCategoryId3').show();
        }
        console.log($('input[name="categoryLevel3"]').val());
    })



    // 书籍管理
    bookList();
    function bookList() {
        $.ajax({
            headers: { token: localStorage.getItem('admin_token') },
            type: 'get',
            url: 'http://localhost:9331/backmgr/book/bookList',
            data: {
                pageNum: '1', pageSize: '6'
            },
            success: function (result) {

                var bookStatus;
                $.each(result.result.page.list, function (i, ele) {
                    if (ele.bookStatus == true) {
                        bookStatus = '上架';
                    } else { bookStatus = '下架'; }
                    $('.bookList tbody').append('<tr><td class="bookId">' + ele.bookId + '</td><td id="bookName">' + ele.bookName + '</td><td>' + ele.categoryName + '</td><td id="categoryId">' + ele.categoryId + '</td><td id="remainStock">' + ele.remainStock + '</td><td id="totalStock">' + ele.totalStock + '</td><td id="currPrice">' + ele.currPrice + '</td><td id="press">' + ele.press + '</td><td id="author">' + ele.author + '</td><td>' + bookStatus + '</td><td id="bookNo">' + ele.bookNo + '</td><td id="publishTime">' + ele.publishTime + '</td><td>' + ele.createTime + '</td><td><button type="button" class="btn btn-info editBook">编辑</button></td></tr>')
                })
            }
        })
        $.ajax({
            headers: { token: localStorage.getItem('admin_token') },
            type: 'get',
            url: 'http://localhost:9331/backmgr/book/bookList',
            data: {
                pageNum: '1', pageSize: '6'
            },
            success: function (result) {
                var totalPage = result.result.page.pages;
                $(".page2").pagination({
                    currentPage: 1,
                    totalPage: totalPage,
                    callback: function (current) {
                        $('.bookList tbody').empty();
                        cur2 = current.toString();
                        $.ajax({
                            headers: { token: localStorage.getItem('admin_token') },
                            type: 'get',
                            url: 'http://localhost:9331/backmgr/book/bookList',
                            data: {
                                pageNum: cur2, pageSize: '6'
                            },
                            success: function (result) {
                                var bookStatus;
                                $.each(result.result.page.list, function (i, ele) {
                                    if (ele.bookStatus == true) {
                                        bookStatus = '上架';
                                    } else { bookStatus = '下架'; }
                                    $('.bookList tbody').append('<tr><td class="bookId">' + ele.bookId + '</td><td id="bookName">' + ele.bookName + '</td><td>' + ele.categoryName + '</td><td id="categoryId">' + ele.categoryId + '</td><td id="remainStock">' + ele.remainStock + '</td><td id="totalStock">' + ele.totalStock + '</td><td id="currPrice">' + ele.currPrice + '</td><td id="press">' + ele.press + '</td><td id="author">' + ele.author + '</td><td>' + bookStatus + '</td><td id="bookNo">' + ele.bookNo + '</td><td id="publishTime">' + ele.publishTime + '</td><td>' + ele.createTime + '</td><td><button type="button" class="btn btn-info editBook">编辑</button></td></tr>')
                                })
                            }
                        })
                    }
                })

            }
        })
    }



    $('.find1').click(function () {
        $('.bookList caption').text('查找结果');
        $('.resReturn').css('display', 'block');

        var bookName = $('#bookNameFind').val();
        $.ajax({
            headers: { token: localStorage.getItem('admin_token') },
            type: 'get',
            url: 'http://localhost:9331/backmgr/book/bookList',
            data: {
                bookName: bookName, pageNum: '1', pageSize: '6'
            },
            success: function (res) {
                $('.page2').hide();
                $('.bookList tbody').empty();
                $.each(res.result.page.list, function (i, ele) {
                    if (ele.bookStatus == true) {
                        bookStatus = '上架';
                    } else { bookStatus = '下架'; }
                    $('.bookList tbody').append('<tr><td class="bookId">' + ele.bookId + '</td><td id="bookName">' + ele.bookName + '</td><td>' + ele.categoryName + '</td><td id="categoryId">' + ele.categoryId + '</td><td id="remainStock">' + ele.remainStock + '</td><td id="totalStock">' + ele.totalStock + '</td><td id="currPrice">' + ele.currPrice + '</td><td id="press">' + ele.press + '</td><td id="author">' + ele.author + '</td><td>' + bookStatus + '</td><td id="bookNo">' + ele.bookNo + '</td><td id="publishTime">' + ele.publishTime + '</td><td>' + ele.createTime + '</td><td><button type="button" class="btn btn-info editBook">编辑</button></td></tr>')
                })

            }
        })
    })
    $('.bookList tbody').on('click', '.editBook', function () {
        $('#myModal5').modal('show');


    })

    $('.resReturn').click(function () {
        $(this).hide();
        $('.bookList caption').text('书籍列表');
        $('.bookList tbody').empty();
        bookList();
        $('.page2').show();
    })

    $.ajax({
        headers: { token: localStorage.getItem('admin_token') },
        type: 'get',
        url: 'http://localhost:9331/backmgr/category/levelSelect',
        data: {
            level: '1'
        },
        success: function (res) {
            $.each(res.result, function (i, ele) {
                $('#category1').append('<option value="' + ele.categoryId + '">' + ele.categoryName + '</option>')
            })
        }
    })
    $('#category1').change(function () {
        $('#category2 .options').remove();
        if ($('#category1').val() != '') {
            var parentCategoryId = $('#category1').val();
            $.ajax({
                headers: { token: localStorage.getItem('admin_token') },
                type: 'get',
                url: 'http://localhost:9331/backmgr/category/categoryList',
                data: {
                    parentCategoryId: parentCategoryId, pageNum: '1', pageSize: '20'
                },
                success: function (res) {
                    $.each(res.result.page.list, function (i, ele) {
                        $('#category2').append('<option class="options" value="' + ele.categoryId + '">' + ele.categoryName + '</option>')
                    })

                }
            })
        }
    })

    $('.find2').click(function () {
        $('.bookList caption').text('查找结果');
        $('.resReturn').css('display', 'block');
        var parentCategoryId = $('#category1').val();
        var categoryId = $('#category2').val();
        var bookStatus = $('#status').val();
        var beginTime = $('#beginTime').val().replace('T', ' ');
        var endTime = $('#endTime').val().replace('T', ' ');
        console.log(beginTime);
        $.ajax({
            headers: { token: localStorage.getItem('admin_token') },
            type: 'get',
            url: 'http://localhost:9331/backmgr/book/bookList',
            data: {
                parentCategoryId: parentCategoryId, categoryId: categoryId, beginTime: beginTime, endTime: endTime, pageNum: '1', pageSize: '6'
            },
            success: function (res) {
                $('.bookList tbody').empty();
                $.each(res.result.page.list, function (i, ele) {
                    var bookStatus;
                    if (ele.bookStatus == true) {
                        bookStatus = '上架';
                    } else { bookStatus = '下架'; }
                    $('.bookList tbody').append('<tr><td class="bookId">' + ele.bookId + '</td><td id="bookName">' + ele.bookName + '</td><td>' + ele.categoryName + '</td><td id="categoryId">' + ele.categoryId + '</td><td id="remainStock">' + ele.remainStock + '</td><td id="totalStock">' + ele.totalStock + '</td><td id="currPrice">' + ele.currPrice + '</td><td id="press">' + ele.press + '</td><td id="author">' + ele.author + '</td><td>' + bookStatus + '</td><td id="bookNo">' + ele.bookNo + '</td><td id="publishTime">' + ele.publishTime + '</td><td>' + ele.createTime + '</td><td><button type="button" class="btn btn-info editBook">编辑</button></td></tr>')
                })
                $(".page2").pagination({
                    currentPage: 1,
                    totalPage: res.result.page.pages,
                    callback: function (current) {
                        $('.bookList tbody').empty();
                        var cur = current.toString();
                        $.ajax({
                            headers: { token: localStorage.getItem('admin_token') },
                            type: 'get',
                            url: 'http://localhost:9331/backmgr/book/bookList',
                            data: {
                                parentCategoryId: parentCategoryId, categoryId: categoryId, beginTime: beginTime, endTime: endTime, pageNum: cur, pageSize: '6'
                            },
                            success: function (result) {
                                var bookStatus;
                                $.each(result.result.page.list, function (i, ele) {
                                    if (ele.bookStatus == true) {
                                        bookStatus = '上架';
                                    } else { bookStatus = '下架'; }
                                    $('.bookList tbody').append('<tr><td class="bookId">' + ele.bookId + '</td><td id="bookName">' + ele.bookName + '</td><td>' + ele.categoryName + '</td><td id="categoryId">' + ele.categoryId + '</td><td id="remainStock">' + ele.remainStock + '</td><td id="totalStock">' + ele.totalStock + '</td><td id="currPrice">' + ele.currPrice + '</td><td id="press">' + ele.press + '</td><td id="author">' + ele.author + '</td><td>' + bookStatus + '</td><td id="bookNo">' + ele.bookNo + '</td><td id="publishTime">' + ele.publishTime + '</td><td>' + ele.createTime + '</td><td><button type="button" class="btn btn-info editBook">编辑</button></td></tr>')
                                })
                            }
                        })
                    }
                })

            }
        })
    })



    $('.bookList tbody').on('click', '.editBook', function () {
        bookId = $(this).parent().siblings('.bookId').text();
        $.ajax({
            type: 'get',
            url: 'http://localhost:9321/mall/book/open/bookDetail',
            data: {
                bookId: bookId
            },
            success: function (res) {
                var bookDetailImg = res.result.bookDetailImg;
                var bookIconUrl = res.result.bookIconUrl;
                $('textarea[name="bookDetailImg1"]').val(bookDetailImg);
                $('input[name="bookIconUrl1"]').val(bookIconUrl);

            }
        })

        $('input[name="bookName1"]').val($(this).parent().siblings('#bookName').text());
        $('input[name="categoryId1"]').val($(this).parent().siblings('#categoryId').text());
        $('input[name="publishTime1"]').val($(this).parent().siblings('#publishTime').text());
        $('input[name="press1"]').val($(this).parent().siblings('#press').text());
        $('input[name="author1"]').val($(this).parent().siblings('#author').text());
        $('input[name="bookNo1"]').val($(this).parent().siblings('#bookNo').text());
        $('input[name="currPrice1"]').val($(this).parent().siblings('#currPrice').text());
        $('input[name="totalStock1"]').val($(this).parent().siblings('#totalStock').text());
        $('input[name="remainStock1"]').val($(this).parent().siblings('#remainStock').text());

    })
    // 编辑图书
    $('.edit-book').click(function () {
        var data = $('#bookList-form1').serializeArray();
        console.log(data);
        if (data[11].value == 'true') {
            var bookStatus1 = true;
        } else {
            var bookStatus1 = false;
        }
        $.ajax({
            headers: { token: localStorage.getItem('admin_token') },
            type: 'post',
            url: 'http://localhost:9331/backmgr/book/editBook',
            data: {
                categoryId: data[0].value, bookName: data[1].value, bookIconUrl: data[2].value, publishTime: data[3].value, press: data[4].value, author: data[5].value, bookDetailImg: data[10].value, bookStatus: bookStatus1, bookId: bookId, translator: '1', bookNo: data[6].value
            },
            success: function (res) {

            }
        })
        $.ajax({
            headers: { token: localStorage.getItem('admin_token') },
            type: 'get',
            url: 'http://localhost:9331/backmgr/bookPrice/priceList',
            data: {
                bookName: data[1].value
            },
            success: function (res) {
                var bookPriceId = res.result.page.list[0].bookPriceId.toString();
                $.ajax({
                    headers: { token: localStorage.getItem('admin_token') },
                    type: 'post',
                    url: 'http://localhost:9331/backmgr/bookPrice/editPrice',
                    data: {
                        bookPriceId: bookPriceId, originalPrice: data[7].value, currPrice: data[7].value, bookId: bookId
                    },
                    success: function (res) {

                    }
                })
            }
        })
        $.ajax({
            headers: { token: localStorage.getItem('admin_token') },
            type: 'get',
            url: 'http://localhost:9331/backmgr/bookStock/stockList',
            data: {
                bookName: data[1].value
            },
            success: function (res) {
                var bookStockId = res.result.page.list[0].bookStockId.toString();
                $.ajax({
                    headers: { token: localStorage.getItem('admin_token') },
                    type: 'post',
                    url: 'http://localhost:9331/backmgr/bookStock/editStock',
                    data: {
                        bookId: bookId, totalStock: data[8].value, remainStock: data[9].value, bookStockId: bookStockId
                    },
                    success: function (res) {
                        var cur = $('.page2').pagination("getPage").current.toString();
                        var parentCategoryId = $('#category1').val();
                        var categoryId = $('#category2').val();
                        var bookStatus = $('#status').val();
                        var beginTime = $('#beginTime').val().replace('T', ' ');
                        var endTime = $('#endTime').val().replace('T', ' ');
                        if (parentCategoryId != "" && categoryId != "" && bookStatus != "" && beginTime != "") {
                            $('.bookList caption').text('查找结果');
                            $('.resReturn').css('display', 'block');
                        }
                        $.ajax({
                            headers: { token: localStorage.getItem('admin_token') },
                            type: 'get',
                            url: 'http://localhost:9331/backmgr/book/bookList',
                            data: {
                                parentCategoryId: parentCategoryId, categoryId: categoryId, beginTime: beginTime, endTime: endTime, pageNum: cur, pageSize: '6', bookStatus: bookStatus
                            },
                            success: function (res) {
                                $('.bookList tbody').empty();
                                $.each(res.result.page.list, function (i, ele) {
                                    var bookStatus;
                                    if (ele.bookStatus == true) {
                                        bookStatus = '上架';
                                    } else { bookStatus = '下架'; }
                                    $('.bookList tbody').append('<tr><td class="bookId">' + ele.bookId + '</td><td id="bookName">' + ele.bookName + '</td><td>' + ele.categoryName + '</td><td id="categoryId">' + ele.categoryId + '</td><td id="remainStock">' + ele.remainStock + '</td><td id="totalStock">' + ele.totalStock + '</td><td id="currPrice">' + ele.currPrice + '</td><td id="press">' + ele.press + '</td><td id="author">' + ele.author + '</td><td>' + bookStatus + '</td><td id="bookNo">' + ele.bookNo + '</td><td id="publishTime">' + ele.publishTime + '</td><td>' + ele.createTime + '</td><td><button type="button" class="btn btn-info editBook">编辑</button></td></tr>')
                                })
                            }
                        })
                    }
                })
            }
        })
    })
    // 添加书籍
    $('.book-add').click(function () {
        var data = $('#bookList-form2').serializeArray();
        console.log(data);
        if (data[11].value == 'true') {
            var bookStatus2 = true;
        } else {
            var bookStatus2 = false;
        }
        $.ajax({
            headers: { token: localStorage.getItem('admin_token') },
            type: 'post',
            url: 'http://localhost:9331/backmgr/book/addBook',
            data: {
                categoryId: data[0].value, bookName: data[1].value, bookIconUrl: data[2].value, publishTime: data[3].value, press: data[4].value, author: data[5].value, bookDetailImg: data[10].value, bookStatus: bookStatus2, translator: '1', bookNo: data[6].value
            },
            success: function (res) {
                $.ajax({
                    headers: { token: localStorage.getItem('admin_token') },
                    type: 'get',
                    url: 'http://localhost:9331/backmgr/book/bookList',
                    data: {
                        bookName: data[1].value
                    },
                    success: function (res) {
                        var bookId = res.result.page.list[0].bookId.toString();
                        $.ajax({
                            headers: { token: localStorage.getItem('admin_token') },
                            type: 'post',
                            url: 'http://localhost:9331/backmgr/bookPrice/addPrice',
                            data: {
                                bookId: bookId, originalPrice: data[7].value, currPrice: data[7].value
                            },
                            success: function (res) {

                            }
                        })
                        $.ajax({
                            headers: { token: localStorage.getItem('admin_token') },
                            type: 'post',
                            url: 'http://localhost:9331/backmgr/bookStock/editStock',
                            data: {
                                bookId: bookId, totalStock: data[8].value, remainStock: data[9].value
                            },
                            success: function (res) {


                            }
                        })
                    }
                })


            }
        })
    })

    // 订单管理
    orderList();
    function orderList() {
        $.ajax({
            headers: { token: localStorage.getItem('admin_token') },
            type: 'get',
            url: 'http://localhost:9331/backmgr/book/orderList',
            data: {
                pageNum: '1', pageSize: '7'
            },
            success: function (res) {
                $('.orderList tbody').empty();
                $.each(res.result.page.list, function (i, ele) {

                    if (ele.orderStatus == 1) {
                        $('.orderList tbody').append('<tr id="' + ele.orderId + '"><td>' + ele.orderNo + '</td><td>' + ele.receiver + '</td><td>' + ele.recdiptAddress + '</td><td>' + ele.connectMobile + '</td><td>' + ele.bookName + '</td><td>' + ele.bookId + '</td><td>' + ele.orderPrice + '</td><td>' + ele.orderNum + '</td><td>' + ele.payAmount + '</td><td>' + ele.creaetTime + '</td><td><button type="button" class="btn btn-danger deliver">发货</button></td></tr>')
                    }
                    if (ele.orderStatus == 3) {
                        $('.orderList tbody').append('<tr id="' + ele.orderId + '"><td>' + ele.orderNo + '</td><td>' + ele.receiver + '</td><td>' + ele.recdiptAddress + '</td><td>' + ele.connectMobile + '</td><td>' + ele.bookName + '</td><td>' + ele.bookId + '</td><td>' + ele.orderPrice + '</td><td>' + ele.orderNum + '</td><td>' + ele.payAmount + '</td><td>' + ele.creaetTime + '</td><td>已收货</td></tr>')
                    }
                    if (ele.orderStatus == 2) {
                        $('.orderList tbody').append('<tr id="' + ele.orderId + '"><td>' + ele.orderNo + '</td><td>' + ele.receiver + '</td><td>' + ele.recdiptAddress + '</td><td>' + ele.connectMobile + '</td><td>' + ele.bookName + '</td><td>' + ele.bookId + '</td><td>' + ele.orderPrice + '</td><td>' + ele.orderNum + '</td><td>' + ele.payAmount + '</td><td>' + ele.creaetTime + '</td><td>已发货</td></tr>')
                    }
                })
                $(".page4").pagination({
                    currentPage: 1,
                    totalPage: res.result.page.pages,
                    callback: function (current) {
                        $('.orderList tbody').empty();
                        var cur4 = current.toString();
                        $.ajax({
                            headers: { token: localStorage.getItem('admin_token') },
                            type: 'get',
                            url: 'http://localhost:9331/backmgr/book/orderList',
                            data: {
                                pageNum: cur4, pageSize: '7'
                            },
                            success: function (res) {
                                $.each(res.result.page.list, function (i, ele) {
                                    if (ele.orderStatus == 1) {
                                        $('.orderList tbody').append('<tr id="' + ele.orderId + '"><td>' + ele.orderNo + '</td><td>' + ele.receiver + '</td><td>' + ele.recdiptAddress + '</td><td>' + ele.connectMobile + '</td><td>' + ele.bookName + '</td><td>' + ele.bookId + '</td><td>' + ele.orderPrice + '</td><td>' + ele.orderNum + '</td><td>' + ele.payAmount + '</td><td>' + ele.creaetTime + '</td><td><button type="button" class="btn btn-danger deliver">发货</button></td></tr>')
                                    }
                                    if (ele.orderStatus == 3) {
                                        $('.orderList tbody').append('<tr id="' + ele.orderId + '"><td>' + ele.orderNo + '</td><td>' + ele.receiver + '</td><td>' + ele.recdiptAddress + '</td><td>' + ele.connectMobile + '</td><td>' + ele.bookName + '</td><td>' + ele.bookId + '</td><td>' + ele.orderPrice + '</td><td>' + ele.orderNum + '</td><td>' + ele.payAmount + '</td><td>' + ele.creaetTime + '</td><td>已收货</td></tr>')
                                    }
                                    if (ele.orderStatus == 2) {
                                        $('.orderList tbody').append('<tr id="' + ele.orderId + '"><td>' + ele.orderNo + '</td><td>' + ele.receiver + '</td><td>' + ele.recdiptAddress + '</td><td>' + ele.connectMobile + '</td><td>' + ele.bookName + '</td><td>' + ele.bookId + '</td><td>' + ele.orderPrice + '</td><td>' + ele.orderNum + '</td><td>' + ele.payAmount + '</td><td>' + ele.creaetTime + '</td><td>已发货</td></tr>')
                                    }
                                })

                            }
                        })
                    }
                })

            }
        })
    }

    $('.orderList tbody').on('click', '.deliver', function () {
        var orderId = $(this).parent().parent().attr('id');
        $.ajax({
            headers: { token: localStorage.getItem('admin_token') },
            type: 'post',
            url: 'http://localhost:9331/backmgr/book/editOrderStatus',
            data: {
                orderId: orderId, orderStatus: 2
            },
            success: function () {
                var count = $('#accountFind').val();
                var orderNo = $('#orderNoFind').val();
                var beginTime = $('#orderBeginTime').val();
                var endTime = $('#orderEndTime').val();
                if (count != "" && orderNo != "" && beginTime != "" && endTime != "") {
                    $('.orderList caption').text('查找结果');
                    $('.resReturn2').css('display', 'block');
                }
                $('.orderList tbody').empty();
                var cur5 = $('.page4').pagination("getPage").current.toString();
                $.ajax({
                    headers: { token: localStorage.getItem('admin_token') },
                    type: 'get',
                    url: 'http://localhost:9331/backmgr/book/orderList',
                    data: {
                        pageNum: cur5, pageSize: '7', account: count, orderNo: orderNo, beginTime: beginTime, endTime: endTime
                    },
                    success: function (res) {
                        $.each(res.result.page.list, function (i, ele) {
                            if (ele.orderStatus == 1) {
                                $('.orderList tbody').append('<tr id="' + ele.orderId + '"><td>' + ele.orderNo + '</td><td>' + ele.receiver + '</td><td>' + ele.recdiptAddress + '</td><td>' + ele.connectMobile + '</td><td>' + ele.bookName + '</td><td>' + ele.bookId + '</td><td>' + ele.orderPrice + '</td><td>' + ele.orderNum + '</td><td>' + ele.payAmount + '</td><td>' + ele.creaetTime + '</td><td><button type="button" class="btn btn-danger deliver">发货</button></td></tr>')
                            }
                            if (ele.orderStatus == 3) {
                                $('.orderList tbody').append('<tr id="' + ele.orderId + '"><td>' + ele.orderNo + '</td><td>' + ele.receiver + '</td><td>' + ele.recdiptAddress + '</td><td>' + ele.connectMobile + '</td><td>' + ele.bookName + '</td><td>' + ele.bookId + '</td><td>' + ele.orderPrice + '</td><td>' + ele.orderNum + '</td><td>' + ele.payAmount + '</td><td>' + ele.creaetTime + '</td><td>已收货</td></tr>')
                            }
                            if (ele.orderStatus == 2) {
                                $('.orderList tbody').append('<tr id="' + ele.orderId + '"><td>' + ele.orderNo + '</td><td>' + ele.receiver + '</td><td>' + ele.recdiptAddress + '</td><td>' + ele.connectMobile + '</td><td>' + ele.bookName + '</td><td>' + ele.bookId + '</td><td>' + ele.orderPrice + '</td><td>' + ele.orderNum + '</td><td>' + ele.payAmount + '</td><td>' + ele.creaetTime + '</td><td>已发货</td></tr>')
                            }
                        })

                    }
                })

            }
        })
    })
    $('.orderFind').click(function () {
        $('.orderList caption').text('查找结果');
        $('.resReturn2').css('display', 'block');
        var count = $('#accountFind').val();
        var orderNo = $('#orderNoFind').val();
        var beginTime = $('#orderBeginTime').val();
        var endTime = $('#orderEndTime').val();
        $.ajax({
            headers: { token: localStorage.getItem('admin_token') },
            type: 'get',
            url: 'http://localhost:9331/backmgr/book/orderList',
            data: {
                pageNum: '1', pageSize: '7', account: count, orderNo: orderNo, beginTime: beginTime, endTime: endTime
            },
            success: function (res) {
                $('.orderList tbody').empty();
                if (res.result.page.list.length == 0) {
                    $('.orderList').after('<h2 style="color:gray;" class="col-md-offset-4">查找结果为无</h2>');
                }
                $.each(res.result.page.list, function (i, ele) {
                    if (ele.orderStatus == 1) {
                        $('.orderList tbody').append('<tr id="' + ele.orderId + '"><td>' + ele.orderNo + '</td><td>' + ele.receiver + '</td><td>' + ele.recdiptAddress + '</td><td>' + ele.connectMobile + '</td><td>' + ele.bookName + '</td><td>' + ele.bookId + '</td><td>' + ele.orderPrice + '</td><td>' + ele.orderNum + '</td><td>' + ele.payAmount + '</td><td>' + ele.creaetTime + '</td><td><button type="button" class="btn btn-danger deliver">发货</button></td></tr>')
                    }
                    if (ele.orderStatus == 3) {
                        $('.orderList tbody').append('<tr id="' + ele.orderId + '"><td>' + ele.orderNo + '</td><td>' + ele.receiver + '</td><td>' + ele.recdiptAddress + '</td><td>' + ele.connectMobile + '</td><td>' + ele.bookName + '</td><td>' + ele.bookId + '</td><td>' + ele.orderPrice + '</td><td>' + ele.orderNum + '</td><td>' + ele.payAmount + '</td><td>' + ele.creaetTime + '</td><td>已收货</td></tr>')
                    }
                    if (ele.orderStatus == 2) {
                        $('.orderList tbody').append('<tr id="' + ele.orderId + '"><td>' + ele.orderNo + '</td><td>' + ele.receiver + '</td><td>' + ele.recdiptAddress + '</td><td>' + ele.connectMobile + '</td><td>' + ele.bookName + '</td><td>' + ele.bookId + '</td><td>' + ele.orderPrice + '</td><td>' + ele.orderNum + '</td><td>' + ele.payAmount + '</td><td>' + ele.creaetTime + '</td><td>已发货</td></tr>')
                    }
                })
                $(".page4").pagination({
                    currentPage: 1,
                    totalPage: res.result.page.pages,
                    callback: function (current) {
                        $('.orderList tbody').empty();
                        var cur4 = current.toString();
                        $.ajax({
                            headers: { token: localStorage.getItem('admin_token') },
                            type: 'get',
                            url: 'http://localhost:9331/backmgr/book/orderList',
                            data: {
                                pageNum: cur4, pageSize: '7', account: count, orderNo: orderNo, beginTime: beginTime, endTime: endTime
                            },
                            success: function (res) {
                                $.each(res.result.page.list, function (i, ele) {
                                    if (ele.orderStatus == 1) {
                                        $('.orderList tbody').append('<tr id="' + ele.orderId + '"><td>' + ele.orderNo + '</td><td>' + ele.receiver + '</td><td>' + ele.recdiptAddress + '</td><td>' + ele.connectMobile + '</td><td>' + ele.bookName + '</td><td>' + ele.bookId + '</td><td>' + ele.orderPrice + '</td><td>' + ele.orderNum + '</td><td>' + ele.payAmount + '</td><td>' + ele.creaetTime + '</td><td><button type="button" class="btn btn-danger deliver">发货</button></td></tr>')
                                    }
                                    if (ele.orderStatus == 3) {
                                        $('.orderList tbody').append('<tr id="' + ele.orderId + '"><td>' + ele.orderNo + '</td><td>' + ele.receiver + '</td><td>' + ele.recdiptAddress + '</td><td>' + ele.connectMobile + '</td><td>' + ele.bookName + '</td><td>' + ele.bookId + '</td><td>' + ele.orderPrice + '</td><td>' + ele.orderNum + '</td><td>' + ele.payAmount + '</td><td>' + ele.creaetTime + '</td><td>已收货</td></tr>')
                                    }
                                    if (ele.orderStatus == 2) {
                                        $('.orderList tbody').append('<tr id="' + ele.orderId + '"><td>' + ele.orderNo + '</td><td>' + ele.receiver + '</td><td>' + ele.recdiptAddress + '</td><td>' + ele.connectMobile + '</td><td>' + ele.bookName + '</td><td>' + ele.bookId + '</td><td>' + ele.orderPrice + '</td><td>' + ele.orderNum + '</td><td>' + ele.payAmount + '</td><td>' + ele.creaetTime + '</td><td>已发货</td></tr>')
                                    }
                                })

                            }
                        })
                    }
                })
            }
        })
    })
    $('.resReturn2').click(function () {
        $('.orderList caption').text('订单列表');
        orderList();
        $(this).hide();
        $('h2').remove();
    })


    // 区域管理
    function proList() {
        $.ajax({
            headers: { token: localStorage.getItem('admin_token') },
            type: 'get',
            url: 'http://localhost:9331/backmgr/area/areaList',
            data: {
                areaLevel: '1', pageNum: '1', pageSize: '8'
            },
            success: function (res) {
                $('#province-list tbody').empty();
                console.log(res);
                $.each(res.result.page.list, function (i, ele) {
                    $('#province-list tbody').append('<tr><td id="' + ele.areaId + '" class="provinceId areaId">' + ele.areaName + '</td><td>' + ele.areaId + '</td><td><a class="del">删除</a>&nbsp;|&nbsp;<a class="lookCity">查看地级市</a></td></tr>')
                })
            }
        })
    }
    proList();
    $('#province-list tbody').on('click', '.lookCity', function () {
        $('#city-list tbody').empty();
        $('#province-list').hide();
        $('.areaReturn').show();
        $('#city-list caption').text($(this).parent().siblings('.provinceId').text())
        parentAreaId1 = $(this).parent().siblings('.provinceId').attr('id');
        $.ajax({
            headers: { token: localStorage.getItem('admin_token') },
            type: 'get',
            url: 'http://localhost:9331/backmgr/area/areaList',
            data: {
                parentAreaId: parentAreaId1, pageNum: '1', pageSize: '8'
            },
            success: function (res) {

                $.each(res.result.page.list, function (i, ele) {
                    $('#city-list tbody').append('<tr><td id="' + ele.areaId + '" class="cityId areaId">' + ele.areaName + '</td><td>' + ele.areaId + '</td><td><a class="del">删除</a>&nbsp;|&nbsp;<a class="lookCounty">查看县、区</a></td></tr>')
                })
                $('#city-list').show();
            }
        })
    })
    $('#city-list tbody').on('click', '.lookCounty', function () {
        $('#county-list tbody').empty();
        $('#city-list').hide();
        $('.areaReturn').show();
        $('#county-list caption').text($(this).parent().siblings('.cityId').text())
        parentAreaId2 = $(this).parent().siblings('.cityId').attr('id');
        $.ajax({
            headers: { token: localStorage.getItem('admin_token') },
            type: 'get',
            url: 'http://localhost:9331/backmgr/area/areaList',
            data: {
                parentAreaId: parentAreaId2, pageNum: '1', pageSize: '8'
            },
            success: function (res) {

                $.each(res.result.page.list, function (i, ele) {
                    $('#county-list tbody').append('<tr><td id="' + ele.areaId + '" class="countyId areaId">' + ele.areaName + '</td><td>' + ele.areaId + '</td><td><a class="del">删除</a></td></tr>')
                })
                $('#county-list').show();
            }
        })
    })
    $('.areaReturn').click(function () {
        if ($('#city-list').css('display') == 'none' && $('#province-list').css('display') == 'none') {
            $('#county-list').hide();
            $('#city-list').show();
        } else {
            $('#province-list').show();
            $('#city-list').hide();
            $('.areaReturn').hide();
        }
    })
    $('#areaList-form1 input[type="radio"]').click(function () {
        if ($('#areaList-form1 input[type="radio"]:checked').val() != 1) {
            $('#parentArea').show();
        } else {
            $('#parentArea').hide();
        }
    })
    $('.addAddress').click(function () {
        var data = $('#areaList-form1').serializeArray();
        $.ajax({
            headers: { token: localStorage.getItem('admin_token') },
            type: 'post',
            url: 'http://localhost:9331/backmgr/area/addArea',
            data: {
                areaName: data[0].value, areaLevel: data[1].value, parentAreaId: data[2].value, areaSort: '1'
            },
            success: function (res) {
                proList();
            }



        })

    })
    $('.areaItem').on('click', '.del', function () {
        var areaId = $(this).parent().siblings('.areaId').attr('id');
        $.ajax({
            headers: { token: localStorage.getItem('admin_token') },
            type: 'post',
            url: 'http://localhost:9331/backmgr/area/delArea',
            data: {
                areaId: areaId
            },
            success: function (res) {
                if ($('#city-list').css('display') == 'none' && $('#province-list').css('display') == 'none') {
                    proList();
                } else if ($('#city-list').css('display') == 'none') {
                    $.ajax({
                        headers: { token: localStorage.getItem('admin_token') },
                        type: 'get',
                        url: 'http://localhost:9331/backmgr/area/areaList',
                        data: {
                            parentAreaId: parentAreaId2, pageNum: '1', pageSize: '8'
                        },
                        success: function (res) {
                            $('#county-list tbody').empty();
                            $.each(res.result.page.list, function (i, ele) {
                                $('#county-list tbody').append('<tr><td id="' + ele.areaId + '" class="countyId areaId">' + ele.areaName + '</td><td>' + ele.areaId + '</td><td><a class="del">删除</a></td></tr>')
                            })
                        }
                    })
                } else {
                    $.ajax({
                        headers: { token: localStorage.getItem('admin_token') },
                        type: 'get',
                        url: 'http://localhost:9331/backmgr/area/areaList',
                        data: {
                            parentAreaId: parentAreaId1, pageNum: '1', pageSize: '8'
                        },
                        success: function (res) {
                            $('#city-list tbody').empty();
                            $.each(res.result.page.list, function (i, ele) {
                                $('#city-list tbody').append('<tr><td id="' + ele.areaId + '" class="cityId areaId">' + ele.areaName + '</td><td>' + ele.areaId + '</td><td><a class="del">删除</a>&nbsp;|&nbsp;<a class="lookCounty">查看县、区</a></td></tr>')
                            })
                        }
                    })
                }
            }



        })
    })

})







