'use strict';

let Promise = require('arrowjs').Promise;

module.exports = function (controller, component, application) {

    controller.settingWidget = function (widget) {
        // Get all widget layouts
        let layouts = component.getLayouts(widget.widget_name);

        // Create setting form
        let form = new ArrowHelper.WidgetForm(widget);
        form.addText('title', 'Title');
        form.addText('number_of_recent_posts', 'Number of Recent Posts');
        form.addSelect('layout', 'Layout', layouts);

        return new Promise(function (fullfill, reject) {
            fullfill(form.render());
        })
    };

    controller.renderWidget = function (widget) {
        // Get layouts
        let layout;
        try {
            layout = JSON.parse(widget.data).layout;
        } catch (err) {
            layout = component.getLayouts(widget.widget_name)[0];
        }

        // Get recent posts
        return Promise.coroutine(function*() {
            let result = yield Promise.all([
                application.models.post.findAll({
                    order: 'published_at desc',
                    limit: JSON.parse(widget.data).number_of_recent_posts,
                    where: {
                        published: 1,
                        type: 'post'
                    },
                    raw: true
                }),
                application.models.category.findAll()
            ]);
            let posts = result[0];
            let categories = result[1];
            // Render view with layout
            return component.render(layout, {
                widget: JSON.parse(widget.data),
                categories: categories,
                posts: posts
            })
        });
    };
};

