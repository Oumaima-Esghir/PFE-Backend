const express = require('express');
const app = express();
require('dotenv').config();
const multer = require('multer'); // Import multer
const path = require('path'); // Import path

const DBCONNECT = require('./core/DB_CONNECT');
const cors = require('cors');

//DB Connection
DBCONNECT.connect();

// use middlewares
app.use(cors());
app.use(express.json());

// import and use routers
const pubrouter = require('./routers/Pub_router');
const userrouter = require('./routers/User_router');
const planrouter = require('./routers/Plan_router');
const commentrouter = require('./routers/Comment_router');
const raterouter = require('./routers/Rate_router');
const conversationrouter = require('./routers/Conversation_router');

app.use('/pubs', pubrouter);
app.use('/users', userrouter);
app.use('/plans', planrouter);
app.use('/comments', commentrouter);
app.use('/rates', raterouter);
app.use('/conversations', conversationrouter);

// upload image
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./images");
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });
  const upload = multer({ storage: storage });

  app.post("/upload", upload.single("image"), async (req, res) => {
    try {
      if (req.file) {
        const imagepath = req.file.path.replace(/\\/g, "/").replace("images", "");
        res.json({ message: "ok!", imagepath: imagepath.replace("src/", "") });
      } else {
        res.json({ message: "Image not upload" });
      }
    } catch (error) {
      res.json({ message: "error", error });
    }
  });


app.listen(process.env.PORT, () => {
    console.log(`server working on port : http://10.0.2.2:${process.env.PORT}`);
});