$('.nav ul dl').on('mouseover', function () {
    $(this).children('dd').css('visibility', 'visible');
})
$('.nav ul dl').on('mouseout', function () {
    $(this).children('dd').css('visibility', 'hidden');
})
