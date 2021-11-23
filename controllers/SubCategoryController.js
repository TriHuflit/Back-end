const SubCategory=require('../models/SubCategorys');
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
        const subCategory=await SubCategory.find({idCate:req.params.id});
        if(!subCategory){
            
            return res.status(400).json({success:false,message:"ID Category not found !"});
        }
        return res.status(200).json({success:true,subCategory});
        
    }



}

module.exports=new SubCategoryController();