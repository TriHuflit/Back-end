const SubCategory=require('../models/SubCategorys');
const Category =require('../models/Categories');
class SubCategoryController{

    //[GET] api/subcategory
    async index(req,res){
        
        const subCategory=await SubCategory.find({});
        console.log(subCategory);
        if(!subCategory){
            return res.status(400).json({success:false,message:"SubCategory not found !"});
        }
        return res.status(200).json({success:true,subCategory});
    }
    //[GET] api/subcategory/:id
    async getSubbyIdCate(req,res){
        const category=await Category.findOne({slug:req.params.slug});
        if(!category){
           
            return res.status(400).json({success:false,message:"Category not found !"});
        }
        const subCategory =await SubCategory.find({idCate:category._id});
        console.log(subCategory);
        return res.status(200).json({success:true,subCategory});
        
    }



}

module.exports=new SubCategoryController();