const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// 设置存储
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// 静态文件服务
app.use(express.static(path.join(__dirname)));

// 上传路由
app.post('/upload', upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'text', maxCount: 1 }
]), (req, res) => {
  let response = { message: '上传成功' };

  if (req.files.video) {
    response.video = req.files.video[0].filename;
  }

  if (req.files.text) {
    // 处理文本文件
    const textContent = fs.readFileSync(path.join(__dirname, 'uploads', req.files.text[0].filename), 'utf8');
    response.text = textContent;
  }

  res.json(response);
});

// 启动服务器
app.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}`);
});