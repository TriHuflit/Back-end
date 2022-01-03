const express = require("express");
const router = express.Router();
const newsController = require("../controllers/NewsController");
const rateController = require('../controllers/RateController');
router.get("/news", newsController.index);

router.post("/news/store", newsController.store);

router.put("/news/update/:slug", newsController.update);

router.delete("/news/delete/:slug", newsController.delete);

router.put("/rate/update/:id", rateController.repRate);

router.post("/rate/rep/:id", rateController.repRate);

router.get("/rate", rateController.index);
module.exports = router;
