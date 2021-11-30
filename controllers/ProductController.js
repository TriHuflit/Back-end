const Products = require('../models/Products');
const Brand = require('../models/Brands');
const WareHouses = require('../models/WareHouses');
const Feature = require('../models/FeatureProducts');
const Describe = require('../models/DescribeProducts');
const { multipleMongoosetoObject } = require('../ultis/mongoose');
const cloudinary = require("../ultis/cloudinary");
const OrderDetails = require('../models/OrderDetails');
class ProductsController {
    //[GET] /api/products/
    async index(req, res, next) {
        Products.find({}, function(err, pros){
            if (err)
                console.log(err);
            else {
                var len = pros.length;
                var curIdx = 0;
                var newPros=[];
                pros.forEach(function(pro) {
                    Brand.findOne({_id:pro.idBrand}, function(err, ret) {
                        if (err)
                            console.log(err);
                        else{
                            // combine those two objects here...
                            pro.set('brand', ret.name, {strict: false})
                            newPros.push(pro);
                            ++curIdx;
                            if (curIdx == len) {
                                //console.log(newUsers);
                                return res.status(200).json({success:true,product:newPros});
                            }
                        }
                    });
                });
        
            }
        })
    }
    //[GET] /api/products/:slug
    async detail(req,res,next){
        const product =await Products.findOne({slug:req.params.slug});
        if(!product){
            res.status(400).json({success:false,message:"Product not found !"});
        }
        const brand =await Brand.findOne({_id:product.idBrand}).select('name');
        product.set('brand', brand, {strict: false})
        const listImage= await Describe.find({idProducts:product._id}).select('image');
        product.set('listImage', listImage, {strict: false})

        return res.status(200).json({success:true,product});
    }
    //[POST] api/product/store  --- create new product-----
    async store(req, res, next) {
        const brand = await Brand.findOne({ _id:req.body.idBrand });
        console.log(req.body);
        const imageUpload=await cloudinary.uploader.upload(req.body.imageRepresent,{folder:'Product_Image/'+req.body.name + "/ imageRepresent"});
        if (brand) {
            try {    
                const { name,price,short_description,long_description} = req.body;
                const product = new Products({
                    name,
                    idBrand: req.body.idBrand,
                    price,
                    imageRepresent:[{
                        url:imageUpload.secure_url,
                        cloud_id:imageUpload.public_id
                    }],
                    short_description,
                    long_description
                });
                await product.save();
              
                if (product) {
                    const files=req.body.listImage;
                    files.map(async (file)=>{
                        const img=await cloudinary.uploader.upload(file,{folder:'Product_Image/'+req.body.name+'Detail'});
                        const describe = new Describe({
                            idProducts:product._id,
                            image:[{
                                url:img.secure_url,
                                cloud_id:img.public_id
                            }]
                        });
                        await describe.save();
                    })
                    // const feature = new Feature({
                    //     idProducts:product._id,
                    //     title: titleFeature,
                    //     content: contentFeature
                    // });
                    // await feature.save();
                    const {real_price,amountImport}=req.body;
                    const warehouse =await new WareHouses({
                        idProducts: product._id,
                        amountStock:amountImport,
                        real_price,
                        amountImport
                    });
                    await warehouse.save();
                    
                    return res.status(200).json({ success: true, message: "Add new product succesfully !"});
                }
                return res.status(401).json({ success: false, message: "Product not found !" });
            } catch (error) {
                res.status(400).json({ success: false, message: "lỗi"})
            }
        }
        else res.status(401).json({ success: false, message: "Brand incorrect !" })

    }
    
    //[PUT] api/product/:slug  --- update product-----
    async update(req, res, next) {
        const { name, price,short_description,long_description } = req.body;
        const productUpdateCondition = { slug: req.params.slug };
        try {
            if(req.body.imageRepresent){
                const product =await Products.findOne({slug:req.params.slug});
                await cloudinary.uploader.destroy(product.cloud_id);
                const imageUpload=await cloudinary.uploader.upload(req.body.imageRepresent,{folder:'Product_Image/'+req.body.name + "/ imageRepresent"});
                let pro = {
                    name,
                    price,
                    imageRepresent:[{
                        url:imageUpload.secure_url,
                        cloud_id:imageUpload.public_id
                    }],
                    short_description,
                    long_description
                };
                const updateProduct = await Products.findOneAndUpdate(productUpdateCondition, pro, { new: true });
                if (!updateProduct) {
    
                    return res.status(404).json({ success: false, message: "Product not Found !" });
                }      
                const describes=await Describe.find({idProducts:updateProduct._id});
                describes.map(async (des)=>{
                    await cloudinary.uploader.destroy(des.cloud_id);
                    des.delete();
                })
                const files=req.body.listImage;
                files.map(async (file)=>{
                    const img=await cloudinary.uploader.upload(file,{folder:'Product_Image/'+req.body.name+' Detail'});
                    const describe = new Describe({
                    idProducts:product._id,
                    image:[{
                            url:img.secure_url,
                            cloud_id:img.public_id
                         }]
                    });
                    await describe.save();
                })
                res.status(200).json({ success: true, message: "Product updated successfully !!!" });
            }
            else{
                let pro = {
                    name,
                    price,
                    short_description,
                    long_description
                };
                const updateProduct = await Products.findOneAndUpdate(productUpdateCondition, pro, { new: true });
                if (!updateProduct) {
    
                    return res.status(404).json({ success: false, message: "Product not Found !" });
                }
                res.status(200).json({ success: true, message: "Product updated successfully !!!" });
            }
        } catch (error) {

        }
    }
    //[DELETE] api/product/:id  --- update product-----
    async delete(req, res, next) {
        const product= await Products.findOne({_id:req.params.id});
        if(!product){
            res.status(404).json({ success: false, message: "Product Not Found"})
        }
        const oderdetails=await OrderDetails.find({idProducts:product._id});
        await cloudinary.uploader.destroy(product.cloud_id);
        const describes=await Describe.find({idProduct:product._id});
        describes.map(async (des)=>{
            await cloudinary.uploader.destroy(des.cloud_id);
            des.delete();
        })
        
    }
    //[POST] api/product/store  --- create new product-----
    //Search Products
    //[GET] search by Keys

    getProductsByKey(req, res, next) {
        if (req.query.search) {
            const regex = new RegExp(req.query.search.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), "gi");
            Products.find({ name: regex }).then(products => res.json({ products: multipleMongoosetoObject(products) })).catch(next);
        }
    }
    //[GET] search by Brand
    getProductsByBrand(req, res) {
        if (req.params.brand) {
            console.log(req.params.brand);
            Brand.findOne({ name: req.params.brand }, (err, brands, next) => {
                if (!err) {
                    console.log(brands._id);
                    Products.find({ idBrand: brands._id }).then(products => res.json(products)).catch(next);
                }
                else next(err);
            })
        }
    }
    //[GET] Sort Price
    getProductsBySortPrice(req, res, next) {
        Products.find({}).sort({ price: req.query.sort }).then(products => res.send(products)).catch(next);
    }
    //[GET] Sort Time
    getProductsBySortTime(req, res, next) {
        Products.find({}).sort({ createdAt: req.query.sort }).then(products => res.send(products)).catch(next);
    }
}
module.exports = new ProductsController();