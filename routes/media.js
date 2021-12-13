const express = require("express");
const router = express.Router();
const newsController = require("../controllers/NewsController");

router.get("/news", newsController.index);

router.post("/news/store", newsController.store);

router.delete("news/delete/:id", newsController.delete);

module.exports = router;
