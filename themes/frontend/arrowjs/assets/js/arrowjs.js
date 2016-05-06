$(function () {
    // Set menu navigation
    $('.navbar-nav > li > a').each(function () {
        var path = window.location.pathname;
        var href = $(this).attr('href');
        if (path == "/") {
            $('.navbar-nav > li:first-child').addClass('active');
        } else if (href) {
            if (path == href) {
                $(this).parent('li').addClass('active');
            }
        }
    });
    $('.navbar-nav > li > ul > li > a').each(function () {
        var path = window.location.pathname;
        var href = $(this).attr('href');
        if (path == "/") {
            $('.navbar-nav > li:first-child').addClass('active');
        } else if (href) {
            if (path == href) {
                $(this).parent('li').addClass('active');
                $(this).parent('li').parent('ul').parent('li').addClass('active');
            }
        }
    });

    // Init highlight js
    $('pre code').each(function(i, block) {
        hljs.highlightBlock(block);
    });

    // Balance fieldset height
    balanceFieldsetHeight();

    // Balance fieldset height when window resize
    $(window).resize(function(){
        balanceFieldsetHeight();
    });

    /* Add back to top button when window have scroll bar */
    var btn_go_top = '<div id="back-to-top" style="display:none;">' +
        '<div><i class="fa fa-chevron-up"></i></div><div>TOP</div></div>';
    $(btn_go_top).appendTo($('.footer'));

    $(window).scroll(function() {
        if($(this).scrollTop() != 0) {
            $('#back-to-top').fadeIn();
        } else {
            $('#back-to-top').fadeOut();
        }
    });

    $('#back-to-top').click(function() {
        $('body,html').animate({scrollTop:0},600);
    });
    /* End back to top function */
});

function balanceFieldsetHeight(){
    var fieldSet = $('.arr-bottom-container fieldset');
    var minHeight = 0;
    fieldSet.each(function(){
        if(minHeight < $(this).height()){
            minHeight = $(this).height();
        }
    });
    fieldSet.height(minHeight);
}