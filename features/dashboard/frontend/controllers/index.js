'use strict';

module.exports = function (controller, component, application) {

    controller.index = function (req, res) {
        let page = req.params.page || 1;
        let itemOfPage = application.getConfig("pagination").frontNumberItem | 10;
        let totalPage = 1;
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
        }).then(function (result) {
            totalPage = Math.ceil(result.count / itemOfPage);
            res.frontend.render('index', {
                postTitle: 'Welcome To TechMaster',
                posts: result.rows,
                totalPage: totalPage,
                itemOfPage: itemOfPage,
                currentPage: page
            })
        })
    };
};