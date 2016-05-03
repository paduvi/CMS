'use strict';

let _ = require('arrowjs')._;
let Promise = require('arrowjs').Promise;
let fs = require('fs');
let log = require('arrowjs').logger;

module.exports = function (controller, component, application) {

    let pluginModel = application.models.plugin;

    controller.index = function (req, res) {
        Promise.map(Object.keys(application.plugin), function (pluginName) {
            return Promise.coroutine(function*() {
                let result = yield pluginModel.find({
                    where: {
                        plugin_name: pluginName
                    }
                });
                if (result) {
                    application.plugin[pluginName].active = result.active || false;
                    return null;
                } else {
                    application.plugin[pluginName].active = false;
                    return null;
                }
            })();
        }).then(function () {
            res.render("index", {plugins: application.plugin});
        });
    };

    controller.viewPlugin = function (req, res) {
        let pluginName = req.params.pluginName;

        Promise.coroutine(function*() {
            let result = yield pluginModel.find({
                where: {
                    plugin_name: pluginName
                }
            });
            if (application.plugin[pluginName]) {
                if (result.dataValues && result.dataValues.data) {
                    result.dataValues.data = JSON.parse(result.dataValues.data)
                }
                _.assign(application.plugin[pluginName], result.dataValues.data);
            }
            res.render("setting", {plugin: application.plugin[pluginName]});
        })();
    };

    controller.updatePlugin = function (req, res) {
        let pluginName = req.params.pluginName;
        Promise.coroutine(function*() {
                let result = yield pluginModel.find({
                    where: {
                        plugin_name: pluginName
                    }
                });
                let plugin = yield Promise.coroutine(function*() {
                    if (result) {
                        if (req.body) {
                            return result.updateAttributes({data: JSON.stringify(req.body)});
                        }
                        return result;
                    }
                    if (application.plugin[pluginName]) {
                        let plugin = yield pluginModel.create({plugin_name: pluginName});

                        return plugin.updateAttributes({data: JSON.stringify(req.body)});
                    }
                    return {};
                })();
                if (application.plugin[pluginName]) {
                    if (plugin.dataValues && plugin.dataValues.data) {
                        plugin.dataValues.data = JSON.parse(plugin.dataValues.data)
                    }
                    _.assign(application.plugin[pluginName], plugin.dataValues.data);
                }
                req.flash.success("Update successfully");
                res.render("setting", {plugin: application.plugin[pluginName]});
            })()
            .catch(function (err) {
                req.flash.error("Cant update setting : " + err.stack);
                res.render("setting", {plugin: application.plugin[pluginName]});
            });
    };

    controller.activePlugin = function (req, res) {
        let pluginName = req.params.pluginName;
        Promise.coroutine(function*() {
                let result = yield pluginModel.find({
                    where: {
                        plugin_name: pluginName
                    }
                });
                result = yield Promise.coroutine(function*() {
                    if (result) {
                        if (result.active) {
                            return result.updateAttributes({active: false});
                        }
                        return result.updateAttributes({active: true});
                    }
                    if (application.plugin[pluginName]) {
                        return yield pluginModel.create({plugin_name: pluginName, active: true});
                    }
                    return null;
                })();

                if (result) {
                    req.flash.success("Update successfully");
                } else {
                    req.flash.error("Cant update plugin state");
                }

                res.redirect("/admin/plugins");
            })()
            .catch(function (err) {
                req.flash.error(err.stack);
                res.redirect("/admin/plugins");
            });
    }
};