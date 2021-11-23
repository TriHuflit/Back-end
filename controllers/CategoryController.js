const Category=require('../models/Categories');
const SubCategory = require('../models/SubCategorys');
class CategoryController{

    //[GET] api/category/
    async index(req,res){
        const category=await Category.find({});
        if(!category){
            return res.status(400).json({success:false,message:"Category not found !"});
        }
        return res.status(200).json({success:true,category});
    }
       //[GET] api/category/detail/:id
    async detail(req,res){
        const category =await Category.findOne({slug:req.params.slug});
        if(!category){
           
            return res.status(400).json({success:false,message:"Detail Category not found !"});
        }
        return res.status(200).json({success:true,category});
        
    }
    //[GET] api/category/:id
    async getSubByIdCate(req,res){
        const category =await Category.findOne({slug:req.params.slug});
        if(!category){
           
            return res.status(400).json({success:false,message:"Category not found !"});
        }
        const subcategory=await SubCategory.find({idCate:category._id})
        return res.status(200).json({success:true,subcategory});
    }



}

module.exports=new CategoryController();