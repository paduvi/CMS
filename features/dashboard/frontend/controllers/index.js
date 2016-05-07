'use strict';
let Promise = require('arrowjs').Promise;

module.exports = function (controller, component, application) {

    controller.index = function (req, res) {
        let page = req.params.page || 1;
        let itemOfPage = application.getConfig("pagination").frontNumberItem | 10;
        let totalPage = 1;
        Promise.coroutine(function*() {
            let result = yield Promise.all([
                application.feature.blog.actions.findAndCountAll({
                    where: {
                        published: 1,
                        type: "post"
                    },
                    include: [
                        {
                            model: application.models.user
                        }
                    ],
                    limit: itemOfPage,
                    offset: (page - 1) * itemOfPage,
                    order: "id desc"
                }),
                application.feature.category.actions.findAll()
            ]);

            totalPage = Math.ceil(result[0].count / itemOfPage);
            res.frontend.render('index', {
                postTitle: `Welcome To ChoToXauTinh's Blog`,
                posts: result[0].rows,
                totalPage: totalPage,
                categories: result[1],
                currentPage: page
            });
        })();
    };
};