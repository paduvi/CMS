'use strict';

module.exports = function (controller, component, application) {

    controller.index = function (req, res) {
        application.feature.blog.actions.findAll({
            where: {
                published: 1,
                type: "post"
            },
            include: [
                {
                    model: application.models.user
                }
            ],
            limit: application.getConfig("pagination").frontNumberItem | 10
        }).then(function (posts) {
            res.frontend.render('index', {
                postTitle: 'Welcome To TechMaster',
                posts: posts
            })
        })
    };
};