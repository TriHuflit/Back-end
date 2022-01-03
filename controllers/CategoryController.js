const Brands = require("../models/Brands");
const Category = require("../models/Categories");
const Products = require("../models/Products");
const SubCategory = require("../models/SubCategorys");
class CategoryController {
  //[GET] api/category/
  async index(req, res) {
    const category = await Category.find({});
    if (!category) {
      return res
        .status(400)
        .json({ success: false, message: "Category not found !" });
    }
    return res.status(200).json({ success: true, category });
  }
  //[GET] api/category/detail/:slug
  async detail(req, res) {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) {
      return res
        .status(400)
        .json({ success: false, message: "Detail Category not found !" });
    }
    return res.status(200).json({ success: true, category });
  }
  //[GET] api/category/:slug
  async getSubBySlugCate(req, res) {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) {
      return res
        .status(400)
        .json({ success: false, message: "Category not found !" });
    }
    const subCategory = await SubCategory.find({ idCate: category._id });
    return res.status(200).json({ success: true, subCategory });
  }
  //[GET] api/category/subcategory/:id
  async getSubByIDCate(req, res) {
    const category = await Category.findOne({ _id: req.params.id });
    if (!category) {
      return res
        .status(400)
        .json({ success: false, message: "Category not found !" });
    }
    const subCategory = await SubCategory.find({ idCate: category._id });
    return res.status(200).json({ success: true, subCategory });
  }

  //[POST] api/category/store
  async store(req, res) {
    const { name } = req.body;
    if (!name) {
      return res
        .status(402)
        .json({ success: false, message: "Add failed,name is undefined!" });
    }
    try {
      const newCategory = await new Category({ name });
      if (!newCategory) {
        return res
          .status(401)
          .json({ success: false, message: "Add failed,Check and try later!" });
      }
      newCategory.save();
      return res.status(200).json({
        success: true,
        message: "Add Category successfully",
        newCategory,
      });
    } catch (error) {
      return res
        .status(401)
        .json({ success: false, message: "Interval server!" });
    }
  }
  //[GET] api/category/edit/:slug
  async edit(req, res) {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Brand not found !" });
    }
    return res.status(200).json({ success: true, category });
  }
  //[PUT] api/category/update/:id
  async update(req, res) {
    const { name } = req.body;
    try {
      const idCategory = await Category.findOne({ _id: req.params.id });
      if (!idCategory) {
        return res
          .status(404)
          .json({ success: false, message: "ID Category Not found!" });
      }
      const oldCategory = await Category.updateOne(
        { _id: req.params.id },
        { name }
      );
      if (!oldCategory) {
        return res
          .status(401)
          .json({ success: false, message: "Update failed!" });
      }
      return res
        .status(200)
        .json({ success: true, message: "Update Category successfully" });
    } catch (error) {
      return res
        .status(401)
        .json({ success: false, message: "Interval server!" });
    }
  }
  //[DELETE] api/category/detele/:id
  async detele(req, res) {
    const idSub = await SubCategory.findOne({ idCate: req.params.id });
    if (idSub) {
      return res
        .status(404)
        .json({ success: false, message: " Error Constraint !" });
    }

    try {
      const deleteCategory = await Category.findOneAndDelete({
        _id: req.params.id,
      });
      if (!deleteCategory) {
        return res
          .status(401)
          .json({ success: false, message: "Delete failed!" });
      }
      return res
        .status(200)
        .json({ success: true, message: "Delete Category successfully" });
    } catch (error) {
      return res
        .status(401)
        .json({ success: false, message: "Interval server!" });
    }
  }
  async getProductsByCate(req, res) {
    let perPage = 8;
    let page = req.query.page || 1;
    const category = await Category.findOne({ slug: req.params.slug });
    const subCategory = await SubCategory.find({ idCate: category._id });
    var newPros = [];
    var array;
    var curIdx = 0;
    var count = 0;
    for (let i = 0; i < subCategory.length; i++) {
      const brands = await Brands.find({ idSub: subCategory[i]._id });
      for (let j = 0; j < brands.length; j++) {
        array = await Products.find({ idBrand: brands[j]._id });
        for (let k = 0; k < array.length; k++) {
          newPros.push(array[k]);
        }
      }
      curIdx++;
      if (curIdx == subCategory.length) {
        console.log(newPros.length);
        return res.status(200).json({
          success: true,
          product: newPros.slice(perPage * page - perPage, perPage * page),
          current: page,
          pages: Math.ceil(count / perPage),
        });
      }
    }

  }
}

module.exports = new CategoryController();
