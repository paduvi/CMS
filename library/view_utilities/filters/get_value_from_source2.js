"use strict"
/**
 * Created by thanhnv on 2/28/15.
 */

module.exports =  {
    //Lay du lieu theo mang
    handler: function (value, source, key_compare, key_value) {
        if (typeof(source) == "string") {
            source = JSON.parse(source);
        }
        for (let v of source) {
            if (value == v[key_compare]) {
                return v[key_value];
            }
        }
        return "";
    }
}
