const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { Post, User, Hashtag } = require('../models');

const router = express.Router();
router.use((req, res, next) => {
    // res.locals.user = null;
    res.locals.user = req.user;
    // res.locals.followerCount = 0;
    // res.locals.followingCount = 0;
    // res.locals.followerIdList  = [];
    res.locals.followerCount = req.user ? req.user.Followers.length : 0;
    res.locals.follwingCount = req.user ? req.user.Followings.length : 0;
    res.locals.followerIdList = req.user ? req.user.Followings.map(f => f.id) : [];
    next();
});

router.get('/profile', isLoggedIn, (req, res) => {
    // 1번 직접 렌더링
    res.render('profile', {title: '내 정보 - NodeBird' });

    // 2번 프론트에게 데이터만 전달
    // res.send({title: '데이터를 전달했음ㅋ' });
});

router.get('/join', isNotLoggedIn, (req, res) => {
    res.render('join', {title: '회원가입 - NodeBird' });
})

router.get('/', (req, res, next) => {
    const twits = [];
    res.render('main', {
        title: 'NordBird',
        twits,
    });
});

router.get('/', async (req, res, next) => {
    try {
        const posts = await Post.findAll({
            include: {
                model: User,
                attributes: ['id', 'nick'],
            },
            order: [['createdAt', 'DESC']],
        });
        res.render('main', {
            title: 'NodeBird',
            twits: posts,
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.get('/hashtag', async (req, res, next) => {
    const query = req.query.hashtag;
    if(!query) {
        return res.redirect('/');
    }
    try {
        const hashtag = await Hashtag.findOne({
            where: {title: query}
        });
        let posts = [];
        if(hashtag) {
            posts = await hashtag.getPosts({
                include : [{ model: User }]
            });
        }
        return res.render('main', {title: `${query} | NodeBird`, twits: posts,});
    } catch(err) {
        console.error(err);
        return next(err);
    }
});

module.exports = router;