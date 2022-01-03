const Products = require("../models/Products");
const Brand = require("../models/Brands");
const Category = require("../models/Categories");
const SubCategorys = require('../models/SubCategorys');
const WareHouses = require("../models/WareHouses");
const Describe = require("../models/DescribeProducts");
const { multipleMongoosetoObject } = require("../ultis/mongoose");
const cloudinary = require("../ultis/cloudinary");
const OrderDetails = require("../models/OrderDetails");
class ProductsController {
  //[GET] /api/products/
  async index(req, res, next) {
    let perPage = 6;
    let page = req.query.page || 1;
    console.log(page);
    await Products.find() // find tất cả các data
      .skip(perPage * page - perPage) // Trong page đầu tiên sẽ bỏ qua giá trị là 0
      .limit(perPage)
      .exec((err, products) => {
        Products.countDocuments((err, count) => {
          if (err) return next(err);
          var len = products.length;
          var curIdx = 0;
          var newPros = [];
          products.forEach(function (pro) {
            Brand.findOne({ _id: pro.idBrand }, function (err, ret) {
              if (err) console.log(err);
              else {
                // combine those two objects here...
                pro.set("brand", ret.name, { strict: false });
                newPros.push(pro);
                ++curIdx;
                if (curIdx == len) {
                  //console.log(newUsers);
                  return res.status(200).json({
                    success: true,
                    product: newPros,
                    current: page,
                    pages: Math.ceil(count / perPage),
                  });
                }
              }
            });
          });
        });
      });
  }
  //[GET] /api/products/:slug
  async detail(req, res, next) {
    const product = await Products.findOne({ slug: req.params.slug });
    if (!product) {
      res.status(400).json({ success: false, message: "Product not found !" });
    }
    const brand = await Brand.findOne({ _id: product.idBrand }).select("name");
    const warehouses = await WareHouses.aggregate([
      { $match: { idProducts: product._id, amountStock: { $gte: 1 } } },
      { $group: { _id: "$idProducts", amountStock: { $sum: "$amountStock" } } },
    ]);
    product.set("brand", brand.name, { strict: false });
    product.set("amountStock", warehouses[0].amountStock, { strict: false });
    const listImage = await Describe.find({ idProducts: product._id }).select(
      "image"
    );
    product.set("listImage", listImage, { strict: false });

    return res.status(200).json({ success: true, product });
  }
  //[POST] api/product/store  --- create new product-----
  async store(req, res, next) {
    const brand = await Brand.findOne({ _id: req.body.idBrand });
    console.log(req.body);
    const imageUpload = await cloudinary.uploader.upload(
      req.body.imageRepresent
    );
    if (brand) {
      try {
        const { name, price, short_description, long_description } = req.body;
        const product = new Products({
          name,
          idBrand: req.body.idBrand,
          price,
          imageRepresent: [
            {
              url: imageUpload.secure_url,
              cloud_id: imageUpload.public_id,
            },
          ],
          short_description,
          long_description,
        });
        await product.save();

        if (product) {
          const files = req.body.listImage;
          files.map(async (file) => {
            const img = await cloudinary.uploader.upload(file);
            const describe = new Describe({
              idProducts: product._id,
              image: [
                {
                  url: img.secure_url,
                  cloud_id: img.public_id,
                },
              ],
            });
            await describe.save();
          });
          const { real_price, amountImport } = req.body;
          const warehouse = await new WareHouses({
            idProducts: product._id,
            amountStock: amountImport,
            real_price,
            amountImport,
          });
          await warehouse.save();

          return res
            .status(200)
            .json({ success: true, message: "Add new product succesfully !" });
        }
        return res
          .status(401)
          .json({ success: false, message: "Product not found !" });
      } catch (error) {
        res.status(400).json({ success: false, message: "lỗi" });
      }
    } else
      res.status(401).json({ success: false, message: "Brand incorrect !" });
  }

  //[PUT] api/product/:slug  --- update product-----
  async update(req, res, next) {
    const { name, price, short_description, long_description } = req.body;
    const product = await Products.findOne({ slug: req.params.slug });

    try {
      if (req.body.imageRepresent != null) {
        await cloudinary.uploader.destroy(product.imageRepresent[0].cloud_id);
        const imageUpload = await cloudinary.uploader.upload(
          req.body.imageRepresent
        );
        let pro = {
          name,
          price,
          imageRepresent: [
            {
              url: imageUpload.secure_url,
              cloud_id: imageUpload.public_id,
            },
          ],
          short_description,
          long_description,
        };
        const updateProduct = await Products.findOneAndUpdate(
          { _id: product._id },
          pro,
          { new: true }
        );
        if (!updateProduct) {
          return res
            .status(404)
            .json({ success: false, message: "Product not Found !" });
        }
      } else {
        let pro = {
          name,
          price,
          short_description,
          long_description,
        };
        const updateProduct = await Products.findOneAndUpdate(
          { _id: product._id },
          pro,
          { new: true }
        );
        if (!updateProduct) {
          return res
            .status(404)
            .json({ success: false, message: "Product not Found !" });
        }
      }
      if (req.body.listImage.length > 0) {
        const describes = await Describe.find({ idProducts: product._id });
        describes.map(async (des) => {
          await cloudinary.uploader.destroy(des.image[0].cloud_id);
          await Describe.findOneAndDelete({ _id: des._id });
        });
        const files = req.body.listImage;
        files.map(async (file) => {
          const img = await cloudinary.uploader.upload(file);
          const describe = new Describe({
            idProducts: product._id,
            image: [
              {
                url: img.secure_url,
                cloud_id: img.public_id,
              },
            ],
          });
          await describe.save();
        });
      }
      res
        .status(200)
        .json({ success: true, message: "Product updated successfully !!!" });
    } catch (error) {
      res.status(400).json({ success: false, message: error });
    }
  }
  //[DELETE] api/product/delete/:id  --- update product-----
  async delete(req, res, next) {
    const orderdetails = await OrderDetails.find({ idProducts: req.params.id });

    if (orderdetails.length > 0) {
      return res
        .status(401)
        .json({ success: false, message: "Error Constraint!" });
    }
    try {
      const product = await Products.findOne({ _id: req.params.id });
      await cloudinary.uploader.destroy(product.imageRepresent[0].cloud_id);
      const describes = await Describe.find({ idProducts: product._id });

      describes.map(async (des) => {
        await cloudinary.uploader.destroy(des.image[0].cloud_id);
        await Describe.findOneAndDelete({ _id: des._id });
      });
      await WareHouses.findOneAndDelete({ idProduct: product._id });
      await Products.findOneAndDelete({ _id: req.params.id });
      res
        .status(200)
        .json({ success: true, message: "Product Deleted successfully !!!" });
    } catch (error) {
      res.status(400).json({ success: false, message: error });
    }
  }
  //[POST] api/product/store  --- create new product-----
  //Search Products
  //[GET] search by Keys

  async getProductsByKey(req, res, next) {
    if (req.query.keys) {
      const regex = new RegExp(
        req.query.keys.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"),
        "gi"
      );
      await Products.find({ name: regex })
        .then((products) =>
          res.json({ products: multipleMongoosetoObject(products) })
        )
        .catch(next);
    }
  }

  //[GET] Sort Price
  async getProductsBySortPrice(req, res) {
    let perPage = 8;
    let page = req.query.page || 1;
    const category = await Category.findOne({ slug: req.params.slug });
    const subCategory = await SubCategorys.find({ idCate: category._id });
    var newPros = [];
    var len = subCategory.length;
    var curIdx = 0;
    var minus = 0;
    for (let j = 0; j < subCategory.length; j++) {
      const brands = await Brand.find({ idSub: subCategory[j]._id });
      brands.map((brand) => {
        Products.find({ idBrand: brand._id }).exec((err, products) => {
          Products.countDocuments((err, count) => {
            if (products.length == 0) {
              minus++;
            }
            if (err) console.log(err);
            products.forEach((pro) => {
              newPros.push(pro);
              newPros.sort(function (a, b) {
                return parseFloat(a.price) - parseFloat(b.price);
              });
              curIdx++;
              count = count - minus;
              if (curIdx == count) {
                var countPros
                if (page == 1) { countPros = 0 }
                else countPros = perPage * page - perPage - 1;
                return res.status(200).json({
                  success: true,
                  product: newPros.slice(countPros, perPage * page),
                  current: page,
                  pages: Math.ceil(count / perPage),
                });
              }
            })
          })
        });
      });
    }
  }
  //[GET] Sort Time
  async getProductsBySortTime(req, res, next) {
    await Products.find({})
      .sort({ createdAt: req.query.sort })
      .then((products) => res.send(products))
      .catch(next);
  }
  //[GET] Cat Foods
  async getCatFoods(req, res) {
    const idSub = await SubCategorys.findOne({ name: "Thức ăn cho mèo" });
    const slug = await Category.findOne({ _id: idSub.idCate }).select("-_id slug");
    if (!idSub) {
      return res.status(404).json("Subcategory Not Found")
    }
    try {
      const brands = await Brand.find({ idSub: idSub._id });
      var CatFoods = [];
      let length = brands.length;
      let temp = -1;
      brands.map(async (brand) => {
        const CatFood = await Products.aggregate([
          { $match: { idBrand: brand._id } },
          { $sample: { size: 2 } }
        ])
        CatFood.forEach(async (cat) => {
          CatFoods.push(cat);
        })
        temp++;
        if (temp == length - 1)
          return res.status(200).json({ success: true, CatFoods, slug });
      })
    } catch (error) {
      return res.status(400).json("Interval Server Error");
    }
  }
  //[GET] Cat Foods
  async getDogFoods(req, res) {
    const idSub = await SubCategorys.findOne({ name: "Thức ăn cho chó" });
    const slug = await Category.findOne({ _id: idSub.idCate }).select("-_id slug");
    if (!idSub) {
      return res.status(404).json("Subcategory Not Found")
    }
    try {
      const brands = await Brand.find({ idSub: idSub._id });
      var DogFoods = [];
      let length = brands.length;
      let temp = -1;
      brands.map(async (brand) => {
        const DogFood = await Products.aggregate([
          { $match: { idBrand: brand._id } },
          { $sample: { size: 2 } }
        ])
        DogFood.forEach(async (cat) => {
          DogFoods.push(cat);
        })
        temp++;
        if (temp == length - 1)
          return res.status(200).json({ success: true, DogFoods, slug });
      })
    } catch (error) {
      return res.status(400).json("Interval Server Error");
    }
  }

}
module.exports = new ProductsController();
