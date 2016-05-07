/**
 * Created by phanducviet on 5/7/16.
 */
module.exports = {
    handler: function (input, categories) {
        "use strict";
        var result = '';
        input = input.replace(/^:|:$/g, '');
        var tags = input.split(':');
        for (let tag of tags) {
            if (tag.length == 0)
                break;
            for (let category of categories) {
                if (category.id == tag) {
                    if (result.length > 0)
                        result += ', ';
                    result += `<a href="/blog/posts/categories/${category.alias}/${category.id}">${category.name}</a>`;
                    break;
                }
            }
        }
        return result;
    }
};
