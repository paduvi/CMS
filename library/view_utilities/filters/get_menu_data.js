'use strict';

module.exports = {
    handler: function (id, menus_data) {
        if (menus_data.length) {
            for (let v of menus_data) {
                if (id == v.detail_id) {
                    return v;
                }
            }
            return '';
        } else {
            return '';
        }
    }
};