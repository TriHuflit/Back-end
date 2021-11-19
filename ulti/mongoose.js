module.exports={
    multipleMongoosetoObject:function(MongooseArrays){
        return MongooseArrays.map(mongoose=>mongoose.toObject());
    },
    mongoosetoObject:function(Mongoose){
        return Mongoose ? Mongoose.toObject():Mongoose;
    }
}