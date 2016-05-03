'use strict';

/**
 * Module dependencies.
 */
let LocalStrategy = require('passport-local').Strategy;
let log = require('arrowjs').logger;
let Promise = require('arrowjs').Promise;

module.exports = function (passport, config, app) {
    // Use local strategy
    passport.use(new LocalStrategy(
        function (username, password, done) {
            Promise.coroutine(function*() {
                let user = yield app.models.user.find({
                    where: [
                        "lower(user_email) = ? and user_status='publish'", username.toLowerCase()
                    ],
                    include: [
                        {
                            model: app.models.role
                        }
                    ]
                });
                if (!user) {
                    let result = yield ArrowHelper.createUserAdmin(app);
                    if (!result) {
                        return done(null, false, {
                            message: 'Invalid Username ! Please login again.'
                        });
                    }
                    return done(null, false, {
                        message: 'Email default is \"admin@example.com\" <br> Password default is \"123456\" <br> Please login again!'
                    });
                }
                if (!user.authenticate(password)) {
                    return done(null, false, {
                        message: 'Invalid Password ! Please login again.'
                    });
                }
                return done(null, user);
            })().catch(function (err) {
                log.error(err);
                return done(null, false, {
                    message: 'Database error ! Please login again.'
                });
            });
        })
    );
};