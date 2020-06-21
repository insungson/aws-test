const express = require('express');
const multer = require('multer');
const path = require('path');

const db = require('../models');
const { isLoggedIn } = require('./middleware');

const router = express.Router();



//구글드라이브
const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');

fs.readdir('uploads1', (error) => {
  if (error) {
    console.error('uploads1 폴더가 없어 uploads1 폴더를 생성합니다.');
    fs.mkdirSync('uploads1');
  }
});

const preStart = () => {
  fs.readFile('routes/credentials.json', (err, data) => {
    if(err) return console.log('비밀파일에 에러가 발생했습니다', err);
    start(JSON.parse(data));
  });
};

const start = (data) => {
  const {client_secret, client_id, redirect_uris} = data.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id, client_secret, redirect_uris[0]);
    checkToken(oAuth2Client);
};

let gdfileName;

const getAccessToken = (auth) => {
  const authUrl = auth.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/drive'],
  });
  console.log('방문해서 권한허가를 해주세요 :', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('방문한 페이지의 코드를 입력해주세요: ', (code) => {
    rl.close();
    auth.getToken(code, (err, token) => {
      if(err) return console.error('토큰 발급과정 중 에러발생', err);
      auth.setCredentials(token);
      fs.writeFile('routes/token.json', JSON.stringify(token), (err) => {
        if(err) return console.error(err);
        console.log('토큰이 정상적으로 발행됨');
      });
      upLoadFile(auth);
    });
  });
};

const upLoadFile = (auth) => {
  const drive = google.drive({
    version: 'v3',
    auth: auth
  });
  var fileMetadata = {
    'name': `${gdfileName}`,
    parents: ['1E5YL7GxgsUQ2IYGOXVEhXr1cMqPvfiq8']
  };
  var media = {
    mimeType: 'image/jpeg',
    body: fs.createReadStream(`../back/uploads1/${gdfileName}`)
  };
  drive.files.create({
    resource: fileMetadata,
    media: media,
    fields: 'id'
  }, function (err, file) {
    if (err) {
      // Handle error
      console.error(err);
    } else {
      console.log('File Id: ', file);
    }
  });
};

const checkToken = (auth) => {
  fs.readFile('routes/token.json', (err, token) => {
    if (err) return getAccessToken(auth);
    auth.setCredentials(JSON.parse(token));
    upLoadFile(auth);
  })
};

const upload1 = multer({
  storage: multer.diskStorage({
    destination(req,file,done){
      done(null, 'uploads1');
    },
    filename(req, file, done){
      const ext = path.extname(file.originalname);
      const basename = path.basename(file.originalname, ext);
      gdfileName = basename + new Date().valueOf() + ext
      done(null, gdfileName);
    },
  }),
  limits: {fileSize: 20*1024*1024},
});

let tempImages = [];

//구글 이미지추가작업
router.post('/googleDriveUpload', upload1.array('image1'), (req, res) => {
    preStart();
    res.json(req.files.map(v => v.filename));
});

router.delete('/TempImage', (req, res, next) => {
  try {
    fs.readdir('uploads1', (err, files) => {
      if(err) console.error(err);
      console.log('폴더내파일들!!',files);
      files.forEach(file => fs.unlink(`uploads1/${file}`, (err) => console.error(err)));
    });
    //   console.log('폴더에 파일이 있는가??', tempImages);
    // if(tempImages.length > 0) {
    //   tempImages.map(file => fs.unlink(`uploads1/${file}`, (err) => console.error(err)));
    //   //tempImages.forEach(file => fs.unlink(`uploads1/${file}`, (err) => console.error(err)) );
    //   console.log('파일삭제가 되는가?', tempImages);
    // }
    res.json([]);
  } catch (e) {
    console.error(e);
    next(e);
  }
});


module.exports = router;