const productRouter=require('./products');
const authRouter = require('./auth');

function route(app){

    app.use('/api/products',productRouter);

    app.use('/api/auth',authRouter);

}

module.exports=route;