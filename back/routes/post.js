const express = require('express');
const multer = require('multer');
const path = require('path');
const AWS = require('aws-sdk');
const multerS3 = require('multer-s3');

const db = require('../models');
const { isLoggedIn } = require('./middleware');

const router = express.Router();

AWS.config.update({
  region: 'us-east-2',
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
});
//config 옵션은 아래와 같다
//credentials : 필수요소, 서비스, 자원에 접근할 수 있는 자격들을 지정한다 
//      (credentials 은 
//      Access key ID: AKIAIOSFODNN7EXAMPLE, Secret access key: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY 
//      로 이뤄져 있다)
// 여기선 .aws 폴더를 만들고
//region : 필수요소, 서비스 요청이 이뤄지는 지역을 지정한다
//maxRetries : 선택요소, 요청의 최대횟수를 지정한다
//logger : 선택요소, 디버깅 정보가 기록되는 로깅 객체를 지정한다
//update : 선택요소, 현재 구성을 새로운 값으로 업데이트 한다

const upload = multer({
  storage: multerS3({
    s3: new AWS.S3(),
    bucket: 'travelers-places-place',//aws 버켓이름
    key(req, file, cb){
      cb(null, `original/${+new Date()}${path.basename(file.originalname)}`);
      //original 이란 폴더안에 시간 + 파일이름 으로 S3 공간에 넣어준다
      //버킷/original 폴더안에 업로드한 파일이 들어간다
    },
  }),
  limits: { fileSize: 20 * 1024 * 1024 },
});


router.post('/', isLoggedIn, upload.none(), async (req, res, next) => {
  try {
    const hashtags = req.body.content.match(/#[^\s]+/g);
    const newPost = await db.Post.create({
      content: req.body.content,
      UserId: req.user.id,
    });
    if(hashtags) {
      const result = await Promise.all(hashtags.map(tag => db.Hashtag.findOrCreate({
        where: { name: tag.slice(1).toLowerCase() },
      })));
      console.log('hashtag result', result);
      await newPost.addHashtags(result.map(r => r[0]));
    }
    if(req.body.image) {
      if(Array.isArray(req.body.image)) {
        const images = await Promise.all(req.body.image.map((image) => {
          return db.Image.create({ src: image });
        }));
        await newPost.addImages(images);
      } else {
        const image = await db.Image.create({ src: req.body.image });
        await newPost.addImage(image);
    }
  }

    const fullPost = await db.Post.findOne({
      where: { id: newPost.id },
      include: [{
        model: db.User,
        attributes: ['id', 'nickname'],
      }, {
        model: db.Image,
      }, {
        model: db.User,
        as: 'Likers',
        attributes: ['id'],
      }],
    });
    return res.json(fullPost);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.post('/images', upload.array('image'), (req, res) => {
  console.log('location 위치확인', req.files);
  res.json(req.files.map(v => v.location));
  //기존의 filename -> location 로 바꿔준다(S3에서는 location경로에 req.files가 들어있기 때문이다)
  //S3에서 실제 데이터는 location 에 있기 때문이다
});

router.get('/:id', async (req, res, next) => {
  try {
    const post = await db.Post.findOne({
      where: { id: req.params.id },
      include: [{
        model: db.User,
        attributes: ['id', 'nickname'],
      }, {
        model: db.Image,
      }],
    });
    res.json(post);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.delete('/:id', isLoggedIn, async (req, res, next) => {
  try {
    const post = await db.Post.findOne({ where: { id: req.params.id }});
    if(!post){
      return res.status(404).send('포스트가 존재하지 않습니다');
    }
    await db.Post.destroy({ where: { id: req.params.id }});
    res.send(req.params.id);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.get('/:id/comments', async (req, res, next) => {
  try {
    const post = await db.Post.findOne({ where: { id: req.params.id }});
    if(!post){
      return res.status(404).send('포스트가 존재하지 않습니다');
    }
    const comments = await db.Comment.findAll({
      where: { PostId: req.params.id, },
      order: [['createdAt', 'ASC']],
      include: [{
        model: db.User,
        attributes: ['id', 'nickname'],
      }],
    });
    res.json(comments);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.post('/:id/comment', isLoggedIn, async (req, res, next) => {
  try {
    const post = await db.Post.findOne({ where: { id: req.params.id } });
    if(!post) {
      return res.status(404).send('포스트가 존재하지 않습니다');
    }
    const newComment = await db.Comment.create({
      PostId: post.id,
      UserId: req.user.id,
      content: req.body.content,
    });
    await post.addComment(newComment.id);

    const comment = await db.Comment.findOne({
      where: { id: newComment.id, },
      include: [{
        model: db.User,
        attributes: ['id', 'nickname'],
      }],
    });
    return res.json(comment);
  } catch (e) {
    console.error(e);
    return next(e);
  }
});

router.post('/:id/like', isLoggedIn, async (req, res, next) => {
  try {
    const post = await db.Post.findOne({ where: { id: req.params.id }});
    if(!post) {
      return res.status(404).send('포스트가 존재하지 않습니다');
    }
    await post.addLiker(req.user.id);
    res.json({ userId: req.user.id }); //이렇게 객체를 보냄
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.delete('/:id/like', isLoggedIn, async (req, res, next) => {
  try {
    const post = await db.Post.findOne({ where: { id: req.params.id } });
    if(!post) {
      return res.status(404).send('포스트를 찾을 수 없습니다');
    }
    await post.removeLiker(req.user.id);
    res.json({ userId: req.user.id });
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.post('/:id/retweet', isLoggedIn, async (req, res, next) => {
  try {
    const post = await db.Post.findOne({
      where: { id: req.params.id },
      include: [{
        model: db.Post,
        as: 'Retweet',
      }],
    });
    if(!post) {
      return res.status(404).send('포스트가 존재하지 않습니다');
    }
    if(req.user.id === post.UserId || (post.Retweet && post.Retweet.UserId === req.user.id)) {
      return res.status(403).send('자신의 글은 리트윗 할 수 없습니다.');
    }

    const retweetTargetId = post.RetweetId || post.id;
    const exPost = await db.Post.findOne({
      where: {
        UserId: req.user.id,
        RetweetId: retweetTargetId,
      },
    });
    if (exPost) {
      return res.status(403).send('이미 리트윗했습니다');
    }
    const retweet = await db.Post.create({
      UserId: req.user.id,
      RetweetId: retweetTargetId,
      content: 'retweet',
    });
    const retweetWithPrevPost = await db.Post.findOne({
      where: { id: retweet.id },
      include: [{
        model: db.User,
        attributes: ['id', 'nickname'],
      }, {
        model: db.Post,
        as: 'Retweet',
        include: [{
          model: db.User,
          attributes: ['id', 'nickname'],
        }, {
          model: db.Image,
        }],
      }],
    });  

    res.json(retweetWithPrevPost);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

module.exports = router;