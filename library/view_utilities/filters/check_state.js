"use strict";

module.exports = {
    handler: function (permissions, moduleName, action) {
        if (typeof permissions == 'object')
            if (permissions.hasOwnProperty('feature')) {
                Object.keys(permissions.feature).forEach(function(key) {
                    // key: the name of the object key
                    if(key == moduleName){
                        for (let val of permissions.feature[key]) {
                            if (val.name === action.name) {
                                return 'checked';
                            }
                        }
                    }
                });
            }
        return '';
    }
}
