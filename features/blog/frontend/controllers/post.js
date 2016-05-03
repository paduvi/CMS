'use strict';

let Promise = require('arrowjs').Promise;
let logger = require('arrowjs').logger;

module.exports = function (controller, component, app) {

    controller.allPosts = function (req, res) {
        let page = req.params.page || 1;
        let number_item = 10;
        let totalPage = 1;

        return Promise.coroutine(function*() {
            let posts = yield app.feature.blog.actions.findAndCountAll({
                include: app.models.user,
                where: {
                    type: 'post',
                    published: 1
                },
                offset: (page - 1) * number_item,
                limit: number_item,
                order: 'id DESC'
            });
            if (posts) {
                totalPage = Math.ceil(parseInt(posts.count) / number_item) || 1;
                // Render view
                res.frontend.render('posts', {
                    posts: posts.rows,
                    totalPage: totalPage,
                    currentPage: page,
                    baseURL: `/blog/posts/page-${page}`
                });
            } else {
                // Redirect to 404 if posts not exist
                res.frontend.render('_404');
            }
        })();
    };

    controller.postDetail = function (req, res) {
        let postId = req.params.postId;

        Promise.coroutine(function*() {
            let post = yield app.feature.blog.actions.find({
                where: {
                    id: postId,
                    type: 'post',
                    published: 1
                },
                raw: true
            });
            if (post) {
                // Get id of category contain post
                let ids = post.categories.split(':');
                let category_ids = [];
                if (ids.length > 0) {
                    for (let id of ids) {
                        if (Number(id)) {
                            category_ids.push(Number(id));
                        }
                    }
                }
                // Query category contain post and render
                let categories = yield app.feature.category.actions.findAll({
                    where: {
                        id: {
                            $in: category_ids
                        }
                    }
                });
                // Render view
                res.frontend.render('post', {
                    post: post,
                    categories: categories
                });
            } else {
                // Redirect to 404 if post not exist
                res.frontend.render('_404');
            }
        })();
    };

    controller.listArchive = function (req, res) {
        let month_ = req.params.month || '01';
        let year_ = req.params.year || '2000';
        let page = req.params.page || 1;

        let number_item = app.getConfig('pagination').frontNumberItem || 10;

        let sql = 'select posts.*,users.user_email,users.user_url,users.display_name,' +
            'users.user_image_url,users.user_status' +
            'from arr_post as posts left outer join arr_user as users on posts.created_by = users.id WHERE' +
            ' "posts"."type" = \'post\' AND "posts"."published" = 1 AND EXTRACT(MONTH FROM posts.created_at ) = ' + month_ + ' AND EXTRACT(YEAR FROM posts.created_at) = ' + year_ +
            ' ORDER BY posts.id ASC OFFSET ' + (page - 1) * number_item + ' LIMIT ' + number_item;

        let sqlCount = 'select count(*) ' +
            'from arr_post as posts WHERE' +
            ' "posts"."type" = \'post\' AND "posts"."published" = 1 AND EXTRACT(MONTH FROM posts.created_at ) = ' + month_ + ' AND EXTRACT(YEAR FROM posts.created_at) = ' + year_;

        Promise.coroutine(function*() {
                let result = yield app.models.rawQuery(sql);
                if (result) {
                    // Render view
                    let countPost = yield app.models.rawQuery(sqlCount);

                    let totalPage = Math.ceil(countPost[0][0].count / number_item) || 1;

                    res.frontend.render('archives', {
                        posts: result[0],
                        archives_date: `${year_} ${month_}`,
                        month: month_,
                        totalPage: totalPage,
                        currentPage: page,
                        baseURL: `/blog/posts/archives/${year_}/${month_}/page-${page}`
                    });
                } else {
                    // Redirect to 404 if post not exist
                    res.frontend.render('_404');
                }
            })()
            .catch(function (err) {
                res.send("error");
                logger.error(err.stack);
            });
    };

    controller.listByAuthor = function (req, res) {
        let page = req.params.page || 1;
        let number_item = app.getConfig('pagination').frontNumberItem || 10;
        let totalPage = 1;

        Promise.coroutine(function*() {
                // Find all post
                let results = yield app.feature.blog.actions.findAndCountAll({
                    include: [
                        {
                            model: app.models.user,
                            attributes: ['id', 'display_name', 'user_login', 'user_email', 'user_image_url']
                        }
                    ],
                    where: {
                        type: 'post',
                        created_by: req.params.author,
                        published: 1

                    },
                    offset: (page - 1) * number_item,
                    limit: number_item,
                    order: 'id DESC'
                });
                if (results) {
                    totalPage = Math.ceil(parseInt(results.count) / number_item) || 1;

                    // Render view
                    res.frontend.render('posts', {
                        posts: results.rows,
                        totalPage: totalPage,
                        currentPage: page,
                        baseURL: `/blog/posts/${req.params.author}/page-${page}`
                    });
                } else {
                    // Redirect to 404 if post not exist
                    res.frontend.render('_404');
                }
            })()
            .catch(function (err) {
                logger.error(err.stack)
            });
    };

    controller.listPostByCategory = function (req, res) {
        let page = req.params.page || 1;
        let number_item = app.getConfig('pagination').frontNumberItem || 10;
        let alias = req.params.alias || '';
        let id = req.params.id || '';

        Promise.coroutine(function*() {
                let result = yield Promise.all([
                    app.feature.blog.actions.findAndCountAll({
                        include: [
                            {
                                model: app.models.user,
                                attributes: ['id', 'display_name', 'user_login', 'user_email', 'user_image_url']
                            }
                        ],
                        where: {
                            categories: {$like: `%:${req.params.id}:%`},
                            type: 'post',
                            published: 1
                        },
                        order: 'id ASC',
                        offset: (page - 1) * number_item,
                        limit: number_item
                    }),
                    app.feature.category.actions.findAll({order: 'id asc'})
                ]);
                let totalPage = Math.ceil(result[0].count / number_item);
                if (result) {
                    // Render view
                    res.frontend.render('posts', {
                        posts: result[0].rows,
                        numberOfPost: result[0].rows.length,
                        totalPage: totalPage,
                        currentPage: page,
                        baseURL: `/blog/posts/categories/${alias}/${id}/page-${page}`,
                    });
                } else {
                    // Redirect to 404 if post not exist
                    res.frontend.render('_404');
                }
            })()
            .catch(function (err) {
                logger.error(err.stack);
                res.frontend.render('_404');
            });
    };

    controller.search = function (req, res) {
        let page = req.params.page || 1;
        let number_item = app.getConfig('pagination').frontNumberItem || 10;
        let totalPage = 1;
        let key = req.body.searchStr || req.params.searchStr || req.query.searchStr || '';

        Promise.coroutine(function*() {
                let posts = yield app.feature.blog.actions.findAndCountAll({
                    include: app.models.user,
                    where: {
                        $or: {
                            title: {
                                $ilike: `%${key}%`
                            },
                            intro_text: {
                                $ilike: `%${key}%`
                            }
                        },
                        type: 'post',
                        published: 1
                    },
                    offset: (page - 1) * number_item,
                    limit: number_item,
                    order: 'id DESC'
                });
                totalPage = Math.ceil(parseInt(posts.count) / number_item) || 1;

                res.frontend.render('posts', {
                    posts: posts.rows,
                    totalPage: totalPage,
                    currentPage: page,
                    baseURL: `/blog/posts/search/page/${page}/${key}`
                });
                // Render view
            })()
            .catch(function (err) {
                logger.error('search error : ', err);
                res.frontend.render('_404');
            });
    }
};