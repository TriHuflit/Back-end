const productRouter = require("./products");
const authRouter = require("./auth");
const cateRouter = require("./category");
const subCateRouter = require("./subcategory");
const brandRouter = require("./brand");
const accountRouter = require("./account");
const voucherRouter = require("./voucher");
const permissionRouter = require("./permission");
const mediaRouter = require("./media");
const orderRouter = require("./order");
const customerRouter = require("./customer");
const rateRouter = require("./rate");
function route(app) {

  app.use("/api/rate", rateRouter);

  app.use("/api/customer", customerRouter);

  app.use("/api/voucher", voucherRouter);

  app.use("/api/category", cateRouter);

  app.use("/api/subcategory", subCateRouter);

  app.use("/api/order", orderRouter);

  app.use("/api/permission", permissionRouter);

  app.use("/api/media", mediaRouter);

  app.use("/api/products", productRouter);

  app.use("/api/brand", brandRouter);

  app.use("/api/account", accountRouter);

  app.use("/api/auth", authRouter);
}

module.exports = route;
