const express = require("express");
const router = express.Router();
const multer = require("multer");
const { getRandom } = require("../helpers/random");
const ArticleController = require("../controller/Article");

const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, './images/articles/');
    },
    filename: (req, file, cb)=>{
        cb(null, "article_" + Date.now() + "_" + getRandom(100) + ".jpg")
    }
})

const upload = multer({storage: storage});

//Tests routes
router.get("/test-route", ArticleController.test);
router.get("/courses", ArticleController.courses);
router.post("/save", ArticleController.save);
router.get("/articles/:num?", ArticleController.getArticles);
router.get("/article/:id", ArticleController.getArticle);
router.delete("/article/:id", ArticleController.deleteArticle);
router.patch("/article/:id", ArticleController.updateArticle);
router.post("/upload-image/:id", [upload.single("image")], ArticleController.uploadImage);
router.get("/show-image/:file", ArticleController.showImage);
router.get("/search/:query", ArticleController.browser);

module.exports = router;