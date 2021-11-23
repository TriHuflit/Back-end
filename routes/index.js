const productRouter=require('./products');
const authRouter = require('./auth');
const cateRouter =require('./category');
const subCateRouter = require ('./subcategory');
const brandRouter =require('./brand');
function route(app){

    app.use('/api/products',productRouter);

    app.use('/api/category',cateRouter);

    app.use('/api/subcategory',subCateRouter);

    app.use('/api/brand',brandRouter);

    app.use('/api/auth',authRouter);

}

module.exports=route;