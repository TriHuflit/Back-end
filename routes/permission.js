const express = require("express");
const router = express.Router();
const PermissionController = require("../controllers/PermissonController");

router.post("/store", PermissionController.store);

router.put("/update/:id", PermissionController.update);

router.delete("/delete/:id", PermissionController.delete);

router.get("/", PermissionController.index);

module.exports = router;
