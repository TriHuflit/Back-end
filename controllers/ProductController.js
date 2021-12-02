const Products = require('../models/Products');
const Brand = require('../models/Brands');
const WareHouses = require('../models/WareHouses');
const SubCategory=require('../models/SubCategorys');
const Category=require('../models/Categories');
const Describe = require('../models/DescribeProducts');
const { multipleMongoosetoObject } = require('../ultis/mongoose');
const cloudinary = require("../ultis/cloudinary");
const OrderDetails = require('../models/OrderDetails');
const { find } = require('../models/Products');
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
        const imageUpload=await cloudinary.uploader.upload(req.body.imageRepresent);
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
                        const img=await cloudinary.uploader.upload(file);
                        const describe = new Describe({
                            idProducts:product._id,
                            image:[{
                                url:img.secure_url,
                                cloud_id:img.public_id
                            }]
                        });
                        await describe.save();
                    })
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
        const product =await Products.findOne({slug:req.params.slug});

        try {
            if(req.body.imageRepresent!=null){           
              
                await cloudinary.uploader.destroy(product.imageRepresent[0].cloud_id);
                const imageUpload=await cloudinary.uploader.upload(req.body.imageRepresent);
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
                const updateProduct = await Products.findOneAndUpdate({_id:product._id}, pro, { new: true });
                if (!updateProduct) {
    
                    return res.status(404).json({ success: false, message: "Product not Found !" });
                }    
            }
            else{
                let pro = {
                    name,
                    price,
                    short_description,
                    long_description
                };
                const updateProduct = await Products.findOneAndUpdate({_id:product._id}, pro, { new: true });
                if (!updateProduct) {
    
                    return res.status(404).json({ success: false, message: "Product not Found !" });
                }
            }
            if(req.body.listImage!= null || req.body.listImage.length>0){
                console.log(product);
                console.log(req.body);
                const describes=await Describe.find({idProducts:product._id});
                describes.map(async (des)=>{
                    await cloudinary.uploader.destroy(des.image[0].cloud_id);
                    await Describe.findOneAndDelete({_id:des._id});
                })
                const files=req.body.listImage;
                files.map(async (file)=>{
                    const img=await cloudinary.uploader.upload(file);
                    const describe = new Describe({
                    idProducts:product._id,
                    image:[{
                            url:img.secure_url,
                            cloud_id:img.public_id
                         }]
                    });
                    await describe.save();
                })     
            }       
            res.status(200).json({ success: true, message: "Product updated successfully !!!" });
        } catch (error) {
            res.status(400).json({ success: false, message: error})
        }
    }
    //[DELETE] api/product/delete/:id  --- update product-----
    async delete(req, res, next) {
        const orderdetails=await OrderDetails.find({idProducts:req.params.id});
        
        if(orderdetails.length>0){
            return res.status(401).json({success:false,message:"Error Constraint!"});
        }
        try {
            const product=await Products.findOne({_id:req.params.id});
            await cloudinary.uploader.destroy(product.imageRepresent[0].cloud_id);
            const describes=await Describe.find({idProducts:product._id});
           
            describes.map(async (des)=>{    
                await cloudinary.uploader.destroy(des.image[0].cloud_id);
                await Describe.findOneAndDelete({_id:des._id});
            });
            await WareHouses.findOneAndDelete({idProduct:product._id});
            await Products.findOneAndDelete({_id:req.params.id});
            res.status(200).json({ success: true, message: "Product Deleted successfully !!!" });
        } catch (error) {
            res.status(400).json({ success: false, message: error})
        }
    }
    //[POST] api/product/store  --- create new product-----
    //Search Products
    //[GET] search by Keys

    async getProductsByKey(req, res, next) {
        if (req.query.search) {
            const regex = new RegExp(req.query.search.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), "gi");
            await Products.find({ name: regex }).then(products => res.json({ products: multipleMongoosetoObject(products) })).catch(next);
        }
    }
  
   
    //[GET] Sort Price
    async getProductsBySortPrice(req, res, next) {
        await Products.find({}).sort({ price: req.query.sort }).then(products => res.send(products)).catch(next);
    }
    //[GET] Sort Time
    async getProductsBySortTime(req, res, next) {
        await Products.find({}).sort({ createdAt: req.query.sort }).then(products => res.send(products)).catch(next);
    }
}
module.exports = new ProductsController();