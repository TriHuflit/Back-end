const SubCategory = require("../models/SubCategorys");
const Category = require("../models/Categories");
const Brand = require("../models/Brands");
const Product = require("../models/Products");
class SubCategoryController {
  //[GET] api/subcategory
  async index(req, res) {
    const subCategory = await SubCategory.find({});
    if (!subCategory) {
      return res
        .status(400)
        .json({ success: false, message: "SubCategory not found !" });
    }
    return res.status(200).json({ success: true, subCategory });
  }
  //[GET] api/subcategory/detail/:id
  async detail(req, res) {
    const subCategory = await SubCategory.findOne({ slug: req.params.slug });
    if (!subCategory) {
      return res
        .status(400)
        .json({ success: false, message: "Detail Subcategory not found !" });
    }
    return res.status(200).json({ success: true, subCategory });
  }
  //[GET] api/subcategory/:slug
  async getBrandBySlugSub(req, res) {
    const subCategory = await SubCategory.findOne({ slug: req.params.slug });
    if (!subCategory) {
      return res
        .status(400)
        .json({ success: false, message: "Subcategory not found !" });
    }
    const brand = await Brand.find({ idSub: subCategory._id });
    return res.status(200).json({ success: true, brand });
  }
  //[GET] api/subcategory/brand/:id
  async getBrandByIDSub(req, res) {
    const subCategory = await SubCategory.findOne({ _id: req.params.id });
    if (!subCategory) {
      return res
        .status(400)
        .json({ success: false, message: "Subcategory not found !" });
    }
    const brand = await Brand.find({ idSub: subCategory._id });
    return res.status(200).json({ success: true, brand });
  }

  //[GET] api/subcategory/create
  async create(req, res) {
    const category = await Category.find({}).select("name");
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "No any Category!" });
    }
    return res.status(200).json({ success: true, category });
  }
  //[POST] api/subcategory/store
  async store(req, res) {
    const { name, category } = req.body;
    const idCate = await Category.findOne({ name: category }).select("_id");
    if (!idCate) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found !" });
    }
    try {
      const newSub = await new SubCategory({ idCate, name });
      if (!newSub) {
        return res
          .status(401)
          .json({ success: false, message: "Add failed,Check and try later!" });
      }
      newSub.save();
      return res
        .status(200)
        .json({ success: true, message: "Add SubCategory successfully" });
    } catch (error) {
      return res
        .status(401)
        .json({ success: false, message: "Interval server!" });
    }
  }
  //[GET] api/subcategory/edit/:slug
  async edit(req, res) {
    const subCategory = await SubCategory.findOne({ slug: req.params.slug });
    if (!subCategory) {
      return res
        .status(404)
        .json({ success: false, message: "SubCategory not found !" });
    }
    const category = await Category.findOne({ _id: subCategory.idCate });

    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found !" });
    }
    subCategory.set("category", category.name, { strict: false });
    return res.status(200).json({ success: true, subCategory });
  }
  //[PUT] api/subcategory/update/:id
  async update(req, res) {
    const { name, category } = req.body;
    const idCate = await Category.findOne({ name: category }).select("_id");
    const idSub = await SubCategory.findOne({ _id: req.params.id });
    if (!idCate) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found!" });
    }
    if (!idSub) {
      return res
        .status(404)
        .json({ success: false, message: "SubCategory not found!" });
    }
    try {
      const oldSub = await SubCategory.updateMany(
        { _id: req.params.id },
        { name, idCate }
      );
      if (!oldSub) {
        return res
          .status(401)
          .json({ success: false, message: "Update failed!" });
      }
      return res
        .status(200)
        .json({ success: true, message: "Update SubCategory successfully" });
    } catch (error) {
      return res
        .status(401)
        .json({ success: false, message: "Interval server!" });
    }
  }
  //[DELETE] api/subcategory/detele/:id
  async detele(req, res) {
    const brand = await Brand.findOne({ idSub: req.params.id });
    if (brand) {
      return res
        .status(400)
        .json({ success: false, message: "Error Constraint !" });
    }

    try {
      const deleteSub = await SubCategory.findOneAndDelete({
        _id: req.params.id,
      });
      if (!deleteSub) {
        return res
          .status(401)
          .json({ success: false, message: "Delete failed!" });
      }
      return res
        .status(200)
        .json({ success: true, message: "Delete SubCategory successfully" });
    } catch (error) {
      return res
        .status(401)
        .json({ success: false, message: "Interval server!" });
    }
  }

  async getProductsBySub(req, res) {

    let perPage = 8;
    let page = req.query.page || 1;
    const Sub = await SubCategory.findOne({ slug: req.params.slug });
    if (!Sub) {
      return res.status(404).json({ success: false, message: "Not Found Subcategory" })
    }
    var newPros = [];
    const brands = await Brand.find({ idSub: Sub._id });
    var curIdx = 0;
    var count = 0;
    brands.map((brand) => {
      Product.find({ idBrand: brand._id }).exec((err, products) => {
        count += products.length;
        if (err) console.log(err);
        products.forEach((pro) => {
          newPros.push(pro);
        })
        curIdx++;
        if (curIdx == brands.length) {
          return res.status(200).json({
            success: true,
            product: newPros.slice(perPage * page - perPage, perPage * page),
            current: page,
            pages: Math.ceil(count / perPage),
          });
        }
      });

    });
  }
}

module.exports = new SubCategoryController();
