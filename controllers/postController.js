const { Post } = require("../src/entity/Post") 
const { User } = require("../src/entity/User") 

const { AppDataSource } = require("../src/data-source")

const getloggedInUser = (req)=>{
    const loggedInUser = getUserModel.findOneBy({id:req.user});
    return loggedInUser
}

const getUserModel = AppDataSource.getRepository(User)
const getPostModel = AppDataSource.getRepository(Post)

exports.createPost = async(req, res, next) => {
    try{
        if (!req.body.title || !req.body.content || !req.body.categoryId){
            res.status(403).json({error:"error", message:"title, content and categoryId are required to create post"})
        }
        const loggedInUser = await getloggedInUser(req)
        const {title, content, categoryId} = req.body
        
        const post = await getPostModel.create({title:title, content:content, userId:loggedInUser.id, categoryId:categoryId})
        const newPost = await getPostModel.save(post)

        res.json({
            message: "successfully created post",
            data: {newPost }
        });
    } catch (err){
        next(err)
    }
}

exports.showAllPosts = async(req, res) => {
    try {
        const loggedInUser = getloggedInUser(req)
        if (loggedInUser.role != "admin") {
            const posts = await getPostModel.find()
            return res.status(200).json({"message":"posts fetched successfully", data:posts})
        }else{
            const posts = await getPostModel.find({ where: {userId: loggedInUser.id}})
            return res.status(200).json({"message":"posts fetched successfully", data:posts})
        }
    } catch (err) {
        res.send(err)
    }
}

exports.showPost = async(req, res) => {
    try {
        const loggedInUser = getloggedInUser(req)
        
        const post = await getPostModel.findOneBy({
            id: req.params.postId
        })
        if(!post){
            return res.status(401).json({"error":"Post not found"})
        }
        return res.status(200).json({"message":"user fetch successfully", data:post})
         
    } catch (error) {
        return res.send(error)
    }
}

exports.updatePost = async(req, res) => {
    try {
        const loggedInUser = getloggedInUser(req)
        
        const post = await getPostModel.findOneBy({
            id: req.params.postId
        })
        if(!post){
            return res.status(401).json({"error":"Post not found"})
        }

        if (post.userId != loggedInuser.id) {
            return res.status(401).json({"error":"You cannot make any change to this: you did not create the resource"})
        }

        const {title, content, categoryId} = req.body

        const result = await getPostModel.createQueryBuilder()
        .update({
            title,
            content,
            categoryId
        })
        .where({
            id: post.id,
        })
        .returning('*')
        .execute()

        return res.status(200).json({"message":"user fetch successfully", data:result.raw[0]})
         
    } catch (error) {
        return res.send(error)
    }
}

exports.deletePost = async(req, res) => {
    const loggedInUser = getloggedInUser(req)
        
    const post = await getPostModel.findOneBy({
        id: req.params.postId
    })
    if(!post){
        return res.status(401).json({"error":"Post not found"})
    }

    if (post.userId != loggedInUser.id) {
        return res.status(401).json({"error":"You cannot make any change to this: you did not create the resource"})
    }

    const results = await getPostModel.delete(req.params.userId)
    return res.status(204).json({"message":"deleted"})
}