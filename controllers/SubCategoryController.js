const SubCategory=require('../models/SubCategorys');
const Category =require('../models/Categories');
const Brands = require('../models/Brands');
class SubCategoryController{

    //[GET] api/subcategory
    async index(req,res){
        
        const subCategory=await SubCategory.find({});
        if(!subCategory){
            return res.status(400).json({success:false,message:"SubCategory not found !"});
        }
        return res.status(200).json({success:true,subCategory});
    }
    //[GET] api/subcategory/detail/:id
    async detail(req,res){
        const subCategory =await SubCategory.findOne({slug:req.params.slug});
        if(!subCategory){
           
            return res.status(400).json({success:false,message:"Detail Subcategory not found !"});
        }
        return res.status(200).json({success:true,subCategory});
        
    }
    //[GET] api/subcategory/:id
    async getBrandByIdSub(req,res){
        const subCategory =await SubCategory.findOne({slug:req.params.slug});
        if(!subCategory){
           
            return res.status(400).json({success:false,message:"Subcategory not found !"});
        }
        const brand=await Brands.find({idSub:subCategory._id})
        return res.status(200).json({success:true,brand});
    }

     //[GET] api/subcategory/create
     async create(req,res){
        const category  = await Category.find({}).select('name');
        if(!category){
            return res.status(400).json({success:false,message:"No any Category!"});
        }
        return res.status(200).json({success:true,category});
    }
   //[POST] api/subcategory/store
    async store(req,res){
        const {name,origin,category}=req.body;
        const idCate=await Category.findOne({name:category}).select('_id');
        if(!idSub){
            return res.status(400).json({success:false,message:"Category not found !"});
        }
        try {
            const newSub = await new SubCategory({idCate,name,origin});
            if(!newSub){
                return res.status(401).json({success:false,message:"Add failed,Check and try later!"});
            }
            newBrand.save();
            return res.status(200).json({success:true,message:"Add Brand successfully"});
        } catch (error) {
            return res.status(401).json({success:false,message:"Interval server!"});
        }
       
    }

}

module.exports=new SubCategoryController();