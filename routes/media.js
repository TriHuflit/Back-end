const express = require("express");
const router = express.Router();
const newsController = require("../controllers/NewsController");

router.get("/", newsController.index);

router.post("/news/store", newsController.store);

router.delete("/delete/:id", newsController.delete);

module.exports = router;
