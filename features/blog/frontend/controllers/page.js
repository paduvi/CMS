'use strict';
let Promise = require('arrowjs').Promise;

module.exports = function (controller, component, app) {

    controller.pageIndex = function (req, res) {

        Promise.coroutine(function*() {
            let results = yield app.feature.blog.actions.find({
                include: [
                    {
                        model: app.models.user,
                        attributes: ['id', 'display_name', 'user_email', 'user_image_url']
                    }
                ],
                where: {
                    alias: req.params.alias,
                    type: 'page',
                    published: 1
                }
            });
            if (results) {
                // Render view
                res.frontend.render('page', {
                    item: results.dataValues
                });
            } else {
                // Redirect to 404 if page not exist
                res.frontend.render('_404');
            }
        })();
    }
};