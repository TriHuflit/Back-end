const Brand = require("../models/Brands");
const Subcategory = require("../models/SubCategorys");
const Product = require("../models/Products");
class BrandController {
  //[GET] api/brand/
  async index(req, res, next) {
    Brand.find({}, function (err, brands) {
      if (err) console.log(err);
      else {
        var len = brands.length;
        var curIdx = 0;
        var newBrands = [];
        brands.forEach(function (brand) {
          Subcategory.findOne({ _id: brand.idSub }, function (err, ret) {
            if (err) console.log(err);
            else {
              // combine those two objects here...
              brand.set("subCategory", ret.name, { strict: false });
              newBrands.push(brand);
              ++curIdx;
              if (curIdx == len) {
                //console.log(newUsers);
                res.json(newBrands);
              }
            }
          });
        });
      }
    });
  }
  //[GET] api/brand/:id
  async detail(req, res) {
    const brand = await Brand.findOne({ slug: req.params.slug });
    if (!brand) {
      return res
        .status(404)
        .json({ success: false, message: "Brand not found!" });
    }
    return res.status(200).json({ success: true, brand });
  }
  //[GET] api/brand/create
  async create(req, res) {
    const subCategory = await Subcategory.find({}).select("name");
    if (!subCategory) {
      return res
        .status(404)
        .json({ success: false, message: "No any Subcategory!" });
    }
    return res.status(200).json({ success: true, subCategory });
  }
  //[POST] api/brand/store
  async store(req, res) {
    const { name, origin, subCategory } = req.body;
    const idSub = await Subcategory.findOne({ name: subCategory }).select(
      "_id"
    );
    if (!idSub) {
      return res
        .status(404)
        .json({ success: false, message: "SubCategory not found !" });
    }
    try {
      const newBrand = await new Brand({ idSub, name, origin });
      if (!newBrand) {
        return res
          .status(401)
          .json({ success: false, message: "Add failed,Check and try later!" });
      }
      newBrand.save();
      return res
        .status(200)
        .json({ success: true, message: "Add Brand successfully" });
    } catch (error) {
      return res
        .status(401)
        .json({ success: false, message: "Interval server!" });
    }
  }
  //[GET] api/brand/edit/:slug
  async edit(req, res) {
    const brand = await Brand.findOne({ slug: req.params.slug });
    const subCategory = await Subcategory.findOne({ _id: brand.idSub });
    if (!brand) {
      return res
        .status(404)
        .json({ success: false, message: "Brand not found !" });
    }
    if (!subCategory) {
      return res
        .status(404)
        .json({ success: false, message: "SubCategory not found !" });
    }
    brand.set("subCategory", subCategory.name, { strict: false });
    return res.status(200).json({ success: true, brand });
  }
  //[PUT] api/brand/update
  async update(req, res) {
    const { name, origin, subCategory } = req.body;
    const idSub = await Subcategory.findOne({ name: subCategory }).select(
      "_id"
    );
    if (!idSub) {
      return res
        .status(404)
        .json({ success: false, message: "Subcategory not found!" });
    }
    try {
      const oldBrand = await Brand.updateMany(
        { _id: req.params.id },
        { name, origin, idSub }
      );
      if (!oldBrand) {
        return res
          .status(401)
          .json({ success: false, message: "Update failed!" });
      }
      return res
        .status(200)
        .json({ success: true, message: "Update Brand successfully" });
    } catch (error) {
      return res
        .status(401)
        .json({ success: false, message: "Interval server!" });
    }
  }
  //[DELETE] api/brand/detele/:id
  async detele(req, res) {
    const BrandDeleteCondition = { _id: req.params.id };
    const product = await Product.findOne({ idBrand: req.params.id });
    if (product) {
      return res
        .status(401)
        .json({ success: false, message: "Error Constraint!" });
    }
    try {
      const deleteBrand = await Brand.findOneAndDelete(BrandDeleteCondition);
      if (!deleteBrand) {
        return res
          .status(401)
          .json({ success: false, message: "Delete failed!" });
      }
      return res
        .status(200)
        .json({ success: true, message: "Delete Brand successfully" });
    } catch (error) {
      return res
        .status(401)
        .json({ success: false, message: "Interval server!" });
    }
  }
  //[GET] search by Brand
  async getProductsByBrand(req, res) {
    const brands = await Brand.findOne({ name: req.params.slug });
    const products = await Product.find({ idBrand: brands._id });
    res.status(200).json({ success: true, products });
  }
}

module.exports = new BrandController();
