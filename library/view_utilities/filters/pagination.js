/**
 * Created by phanducviet on 5/7/16.
 */
module.exports = {
    handler: function (totalPage, currentPage, link) {
        if(totalPage < 2)
            return '';
        if (link == null || link == undefined)
            link = '';
        var result =
            '<article>' +
            '<!-- Pagination Start -->' +
            '<ul class="pager">';

        if (currentPage == null)
            currentPage = 1;
        else
            currentPage = Number(currentPage);
        if (currentPage != 1)
            result += '<li class="previous"><a href="' + link + '/page/' + (currentPage - 1) + '"><i class="ico-arrow-left"></i>' +
                'Previous</a></li>';
        result += '<li style="list-style: none">';
        for (var i = 1; i <= totalPage; i++) {
            if (i == currentPage) {
                result += '<span><a style="background-color: #c5c5c5; pointer-events: none" href="' + link + '/page/' + i + '">' + i + '</a></span> ';
            } else {
                result += '<span><a href="' + link + '/page/' + i + '">' + i + '</a></span> ';
            }
        }
        result += '</li>';
        if (currentPage != totalPage)
            result += '<li class="next">' +
                '<a href="' + link + '/page/' + (currentPage + 1) + '">Next <i class="ico-arrow-right"></i></a></li>';
        result += '</ul><!-- Pagination End -->' +
            '</article><!-- Blog Article End-->';
        return result;
    }
};