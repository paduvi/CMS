"use strict";

let _ = require('arrowjs')._;
let log = require('arrowjs').logger;
let Promise = require('arrowjs').Promise;

module.exports = {

    async: true,

    /**
     * Get sidebar by name
     *
     * @param sidebarName - Name of sidebar
     * @param callback - Content of sidebar
     */
    handler: function (sidebarName, callback) {
        let app = this;

        Promise.coroutine(function*() {
            // Find all widgets in the sidebar
            let widgets = yield app.models.widget.findAll({
                where: {
                    sidebar: sidebarName
                },
                order: ['ordering'],
                raw: true
            });

            // Check the sidebar has widget
            if (widgets && widgets.length) {
                let html = '';

                widgets.map(function (widgetData) {
                    // Get widget by type
                    let widget = app.widgetManager.getComponent(widgetData.widget_name);

                    if (widget) {
                        // Get content of each widget in the sidebar
                        yield Promise.coroutine(function*() {
                            let view = yield widget.controllers.renderWidget(widgetData);
                            html += view;
                        })().catch(function (err) {
                            log.error(err);
                        });
                    }
                });

                callback(null, html);
            } else {
                callback(null, '');
            }
        })().catch(function (err) {
            log.error(err);
        });
    }
};