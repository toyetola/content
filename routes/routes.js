const express = require("express");
const router = express.Router();
const {signup, login, update, showAll, showOne, deleteUser, logout} = require("../controllers/userController")
const {createPost , showAllPosts, showPost, updatePost,  deletePost} = require("../controllers/postController")
const {createCategory , showAllCategories, showCategory, updateCategory,  deleteCategory} = require("../controllers/categoryController")
const verifyToken = require("../middlewares/authMiddleware");


const version = "v1"


//API Welcome
router.get("/", (req, res)=>{
    return res.send("Welcome to Content APIs")
})

// Authentication routes
router.post("/api/"+version+"/signup", signup)
router.post("/api/"+version+"/login", login)

router.use(verifyToken)

router.post("/api/"+version+"/logout", logout)

// Post API routes
/* 
    gets all posts
    @return Array
*/
router.get("/api/"+version+"/posts", showAllPosts) 

/* 
    get a single posts
    @return Object
*/
router.get("/api/"+version+"/post/:postId", showPost) 

/* 
    create a post
    @return Object
*/
router.post("/api/"+version+"/posts/", createPost) 

/* 
    update a post
    @return Object
*/
router.put("/api/"+version+"/post/:postId", updatePost)

/* 
    delete a post
    @return No content
*/
router.delete("/api/"+version+"/post/:postId", deletePost) 


// Category API routes
router.get("/api/"+version+"/categories", showAllCategories) 
router.get("/api/"+version+"/category/:categoryId", showCategory) 
router.post("/api/"+version+"/categories", createCategory) 
router.put("/api/"+version+"/category/:postId", updateCategory)
router.delete("/api/"+version+"/category/:postId", deleteCategory) 


// User APIs
router.get("/api/"+version+"/users", showAll)  
router.get("/api/"+version+"/user/:userId", showOne) 
router.patch("/api/"+version+"/user/:userId", update)
router.delete("/api/"+version+"/user/:userId", deleteUser)

module.exports = router