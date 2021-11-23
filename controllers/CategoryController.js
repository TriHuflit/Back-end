const Category=require('../models/Categories');
class CategoryController{

    //[GET] api/category/
    async index(req,res){
        const category=await Category.find({});
        if(!category){
            return res.status(400).json({success:false,message:"Category not found !"});
        }
        return res.status(200).json({success:true,category});
    }




}

module.exports=new CategoryController();