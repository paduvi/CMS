"use strict"
/**
 * Created by thanhnv on 2/28/15.
 */

module.exports =  {
    //Lay du lieu theo mang
    handler :  function (arr_value, source, key_compare, key_value) {
        let arr = [];
        for (let elem of arr_value) {
            for (let v of source) {
                if (elem == v[key_compare]) {
                    arr.push(v[key_value]);
                    break;
                }
            }
        }
        return arr.join(', ');
    }
}
