'use strict';

let logger = require('arrowjs').logger;
let promise = require('arrowjs').Promise;

/**
 * Function create user admin if database does not have an user
 */
exports.createUserAdmin = function (app, callback) {
    let permissions = app.permissions;
    try {
        permissions = delete permissions.widget;
        permissions = JSON.stringify(app.permissions);
    } catch (err) {
        callback(null);
    }

    Promise.coroutine(function*() {
        let count = yield app.models.user.count();

        if (count < 1) {
            let result = yield app.models.role.findAndCountAll({
                limit: 1,
                order: 'id DESC'
            });

            if (result.count < 1) {
                let role = yield app.models.role.create({
                    name: 'Admin',
                    status: 'publish',
                    permissions: permissions
                });
                createUser(app, role.id, function (user) {
                    callback(user, role);
                });
            } else {
                createUser(app, result.rows[0].id, function (user) {
                    callback(user);
                });
            }
        } else {
            callback(null);
        }
    })().catch(function (err) {
        logger.error('Error At CreateUserAdmin in ArrowHelper function : ', err);
        callback(null);
    });
};

function createUser(app, role_id, callback) {
    if (role_id < 1)
        callback(null);
    Promise.coroutine(function*() {
        let user = yield app.models.user.create({
            user_pass: '123456',
            user_email: 'admin@example.com',
            user_url: 'https://facebook.com/...',
            user_status: 'publish',
            display_name: 'Administrator',
            image: '/img/admin.jpg',
            role_id: role_id,
            role_ids: role_id
        });
        callback(user);
    })().catch(function (err) {
        logger.error(err);
        callback(err);
    })
}
