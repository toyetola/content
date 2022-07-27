const { Category } = require("../src/entity/Category") 
const { User } = require("../src/entity/User") 

const { AppDataSource } = require("../src/data-source")

const getloggedInUser = (req)=>{
    const loggedInUser = getUserModel.findOneBy({id:req.user});
    return loggedInUser
}

const getUserModel = AppDataSource.getRepository(User)
const getCategoryModel = AppDataSource.getRepository(Category)

exports.createCategory = async(req, res, next) => {
    try{
        if (!req.body.name){
            res.status(403).json({error:"error", message:"name is required to create category"})
        }
        const loggedInUser = await getloggedInUser(req)
        console.log(req.user)
        if(loggedInUser.role != "admin"){
            return res.status(401).json({error:"error", message:"category can only be created by admin"})
        }

        const {name} = req.body
        
        const category = await getCategoryModel.create({name:name})
        const newCategory = await getCategoryModel.save(category)

        res.json({
            message: "successfully created category",
            data: {newCategory }
        });
    } catch (err){
        next(err)
    }
}

exports.showAllCategories = async(req, res) => {
    try {
        const loggedInUser = getloggedInUser(req)
        if (loggedInUser.role != "admin") {
            const categories = await getCategoryModel.find()
            return res.status(200).json({"message":"categories fetched successfully", data:categories})
        }else{
            const categories = await getCategoryModel.find()
            return res.status(200).json({"message":"categories fetched successfully", data:categories})
        }
    } catch (err) {
        res.send(err)
    }
}

exports.showCategory = async(req, res) => {
    try {
        const loggedInUser = getloggedInUser(req)
        
        const category = await getCategoryModel.findOneBy({
            id: req.params.categoryId
        })
        if(!category){
            return res.status(401).json({"error":"category not found"})
        }
        return res.status(200).json({"message":"user fetch successfully", data:category})
         
    } catch (error) {
        return res.send(error)
    }
}

exports.updateCategory = async(req, res) => {
    try {
        const loggedInUser = await getloggedInUser(req)
        
        const category = await getCategoryModel.findOneBy({
            id: req.params.categoryId
        })
        if(!category){
            return res.status(401).json({"error":"category not found"})
        }

        if (loggedInUser.role != "admin") {
            return res.status(401).json({"error":"You cannot make any change to this: you did not create the resource"})
        }

        const {name} = req.body

        const result = await getCategoryModel.createQueryBuilder()
        .update({
            name
        })
        .where({
            id: category.id,
        })
        .returning('*')
        .execute()

        return res.status(200).json({"message":"update successfull", data:result.raw[0]})
         
    } catch (error) {
        return res.send(error)
    }
}

exports.deleteCategory = async(req, res) => {
    const loggedInUser = getloggedInUser(req)
        
    const category = await getCategoryModel.findOneBy({
        id: req.params.categoryId
    })
    if(!category){
        return res.status(401).json({"error":"category not found"})
    }

    if (category.userId != loggedInuser.id) {
        return res.status(401).json({"error":"You cannot make any change to this: you did not create the resource"})
    }

    const results = await getCategoryModel.delete(category.id)
    return res.status(204).json({"message":"deleted"})
}