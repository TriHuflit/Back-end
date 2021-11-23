const Products = require('../models/Products');
const Brand = require('../models/Brands');
const WareHouses = require('../models/WareHouses');
const Feature = require('../models/FeatureProducts');
const Describe = require('../models/DescribeProducts');
const { multipleMongoosetoObject } = require('../ulti/mongoose');
const fs=require('fs');
class ProductsController {
    //[GET] /api/products/
    async index(req, res, next) {
        Products.find({}).then(products => res.json({ products: multipleMongoosetoObject(products) })).catch(next);
    }
    //[GET] /api/products/:slug
    async detail(req,res,next){
        const product =await Products.findOne({slug:req.params.slug}).then().catch(next);
        if(!product){
            res.status(400).json({success:false,message:"Product not found !"});
        }
        
        const describe= await Describe.find({idProducts:product._id});
        const feature =await Feature.find({idProducts:product._id});
        const warehouses=await WareHouses.find({idProducts:product._id});
        return res.status(200).json({success:false,product,describe,feature,warehouses});
    }
    //[POST] api/product/store  --- create new product-----
    async store(req, res, next) {
        const brand = await Brand.findOne({ name: req.body.brand }).select("idBrand");
        if (brand) {
            try {    
                const { name,
                    price,
                    titleFeature, contentFeature,
                    titleDescribe, contentDescribe
                } = req.body;
                const imageRepresent=req.file.path;
              
                const product = new Products({
                    name,
                    idBrand: brand,
                    price,
                    imageRepresent
                });
                await product.save();
              
                if (product) {
                    const feature = new Feature({
                        idProducts:product._id,
                        title: titleFeature,
                        content: contentFeature
                    });
                    await feature.save();
                    const describe = new Describe({
                        idProducts:product._id,
                        title: titleDescribe,
                        content: contentDescribe
                    });
                    await describe.save();
                    const { warehouses } = req.body;
                    warehouses.forEach(async warehouse => {    
                       
                        warehouse = new WareHouses({
                            idProducts: product._id,
                            idCustomer: req.CustomerId,
                            color: warehouse.color,
                            amoutStock: warehouse.amoutImport,
                            priceImport:warehouse.priceImport,
                            amoutImport: warehouse.amoutImport
                        });
                        await warehouse.save();
                    });
                    return res.status(200).json({ success: true, message: "Add new product succesfully !",warehouse });
                }
                return res.status(401).json({ success: false, message: "Product not found !" });
            } catch (error) {
                res.status(400).json({ success: false, message: error })
            }
        }
        else res.status(401).json({ success: false, message: "Brand incorrect !" })

    }
    //[PUT] api/product/:slug  --- update product-----
    async update(req, res, next) {
        const brand = await Brand.findOne({ name: req.body.brand }).select("idBrand");
        const { name, price,
            imageRepresent, titleFeature,
            contentFeature, titleDescribe,
            contentDescribe } = req.body;
        try {

            let product = {
                name,
                idBrand: brand,
                price,
                imageRepresent
            };
            const productUpdateCondition = { slug: req.params.slug };

            const updateProduct = await Products.findOneAndUpdate(productUpdateCondition, product, { new: true });

            if (!updateProduct) {

                return res.status(400).json({ success: false, message: "Product not Found !" })
            }
            res.status(200).json({ success: true, message: "Product updated successfully !!!" })
        } catch (error) {

        }
    }
    //[DELETE] api/product/:id  --- update product-----
    async delete(req, res, next) {

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