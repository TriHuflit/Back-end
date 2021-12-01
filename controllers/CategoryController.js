const Brands = require('../models/Brands');
const Category=require('../models/Categories');
const Products = require('../models/Products');
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
       //[GET] api/category/detail/:slug
    async detail(req,res){
        const category =await Category.findOne({slug:req.params.slug});
        if(!category){
           
            return res.status(400).json({success:false,message:"Detail Category not found !"});
        }
        return res.status(200).json({success:true,category});
        
    }
    //[GET] api/category/:slug
    async getSubBySlugCate(req,res){
        const category =await Category.findOne({slug:req.params.slug});
        if(!category){
           
            return res.status(400).json({success:false,message:"Category not found !"});
        }
        const subCategory=await SubCategory.find({idCate:category._id})
        return res.status(200).json({success:true,subCategory});
    }
    //[GET] api/category/subcategory/:id
    async getSubByIDCate(req,res){
        const category =await Category.findOne({_id:req.params.id});
        if(!category){
           
            return res.status(400).json({success:false,message:"Category not found !"});
        }
        const subCategory=await SubCategory.find({idCate:category._id})
        return res.status(200).json({success:true,subCategory});
    }
    

   //[POST] api/category/store
    async store(req,res){
        const {name}=req.body;
        if(!name){
            return res.status(402).json({success:false,message:"Add failed,name is undefined!"});
        }
        try {
            const newCategory = await new Category({name});
            if(!newCategory){
                return res.status(401).json({success:false,message:"Add failed,Check and try later!"});
            }
            newCategory.save();
            return res.status(200).json({success:true,message:"Add Category successfully",newCategory});
        } catch (error) {
            return res.status(401).json({success:false,message:"Interval server!"});
        }
       
    }
     //[GET] api/category/edit/:slug
    async edit(req,res){
        const category=await Category.findOne({slug:req.params.slug});
        if(!category){
            return res.status(404).json({success:false,message:"Brand not found !"});
        }
        return res.status(200).json({success:true,category});             
    }
    //[PUT] api/category/update/:id
    async update(req,res){
        const {name}=req.body;
        try {
          const idCategory=await Category.findOne({_id:req.params.id});
          if(!idCategory){
            return res.status(404).json({success:false,message:"ID Category Not found!"});
          }
           const oldCategory=await Category.updateOne({_id:req.params.id},{name});
           if(!oldCategory){
            return res.status(401).json({success:false,message:"Update failed!"});
           }
            return res.status(200).json({success:true,message:"Update Category successfully"});
        } catch (error) {
            return res.status(401).json({success:false,message:"Interval server!"});
        }
    }
    //[DELETE] api/category/detele/:id
    async detele(req,res){
        const idSub = await SubCategory.findOne({idCate:req.params.id});
        if(idSub){
            return res.status(404).json({success:false,message:" Error Constraint !"});
        }
        
        try {
            const deleteCategory=await Category.findOneAndDelete({_id:req.params.id});
            if(!deleteCategory){
                return res.status(401).json({success:false,message:"Delete failed!"});
               }
            return res.status(200).json({success:true,message:"Delete Category successfully"});
        } catch (error) {
            return res.status(401).json({success:false,message:"Interval server!"});
        }
    }
    async getProductsByCate(req, res) {
        
        const Cate=await Category.findOne({ name: req.params.cate });
        var pros=[];
        const Subs =await SubCategory.find({idCate:Cate._id});
        for (let i = 0; i  < Subs.length; i ++) {
            const brands=await Brands.find({idSub:Subs[i]._id});
            console.log(i);
            for (let j = 0; j < brands.length; j++) {
                const products =await Products.find({idBrand:brands[j]._id});
                products.forEach(async (pro)=>{
                    pros.push(pro);       
                });
               
                if(i == Subs.length-1 && j == brands.length-1)
                    return res.status(200).json({ success: true, product:pros });
            }        
        }
    }
}

module.exports=new CategoryController();