const { User } = require("../src/entity/User") 
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { AppDataSource } = require("../src/data-source")

async function hashPassword(password){
    return await bcrypt.hash(password, 10);
}

async function validatePassword(plainPassword, hashedPassword){
    return await bcrypt.compare(plainPassword, hashedPassword);
}
const getUserModel = AppDataSource.getRepository(User)

const getloggedInUser = (req)=>{
    const loggedInUser = getUserModel.findOneBy({id:req.user});
    return loggedInUser
}




//sign up with email and password
exports.signup = async (req, res, next) => {
    try{

        const loggedInUser = getloggedInUser(req)

        if (req.body.role && (req.body.role == "admin") && req.user && req.user!="undefined"){
            return res.status(403).json({error:"error", message:"Only an admin user can add another admin user"})
        }
        const {email, password, role, firstname, lastname} = req.body
        const hashedPassword = await hashPassword(password)
        
        const user = await getUserModel.create({email:email, password:hashedPassword, role:role, firstname:firstname, lastname:lastname})
        const newUser = await getUserModel.save(user)

        res.json({
            message: "successfully created user",
            data: {email:newUser.email, firstname:newUser.firstname, lastname:newUser.lastname, role:newUser.role }
        });
    } catch (err){
        next(err)
    }
}


//login method
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await getUserModel.findOne({
            select: ['id', 'email','password', 'firstname', 'lastname', 'accessToken'],
            where: { email:email }
        });
        if (!user) 
            // return next(new Error('Email does not exist'));
            return res.status(401).json({"error":"Email does not exist"});
        const validPassword = await validatePassword(password, user.password);
        if (!validPassword) 
            // return next(new Error('Password is not correct'))
            return res.status(401).json({"error":"Password is not correct"});
            const accessToken = await jwt.sign({ userId: user.id, iss: process.env.APP_URL}, process.env.PUBLIC_KEY, {
                expiresIn: "1h"
            });
               
        // console.log(accessToken)
        user.accessToken = accessToken;
        const result = await getUserModel.createQueryBuilder()
        .update({
            accessToken
        })
        .where({
            email: user.email,
        })
        .returning('*') 
        .execute()
    
        return res.status(200).json({data: { id: result.raw[0].id, email: result.raw[0].email, role: result.raw[0].role }, accessToken})
    
    } catch (error) {
        return res.send(error)
    }
}

//get all users
exports.showAll = async(req, res) =>{
    try {
        const loggedInUser = await getloggedInUser(req)
        if (loggedInUser.role != "admin") {
            return res.status(403).json({"error":"only an admin user can do this"})
        }

        const users = await getUserModel.find()
        return res.status(200).json({"message":"users fetch successfully", data:users})
    } catch (err) {
        res.send(err)
    }
}


exports.showOne = async(req, res) => {
    try {
        const loggedInUser = getloggedInUser(req)
        if (loggedInUser.role != "admin") {
            const user = await getUserModel.findOneBy({
                id: req.params.userId,
            })
            return res.status(200).json({"message":"user fetch successfully", data:user})
        }else{
            const user = await getUserModel.findOneBy({
                id: req.userId,
            })
            return res.status(200).json({"message":"user fetch successfully", data:user})
        }    
    } catch (error) {
        return res.send(error)
    }
    
}

//update user
exports.update = async(req, res) =>{
    if (req.body.password){
        res.status(403).json({"error":"you cannot update password this way"})
    }

    const user = await getUserModel.findOneBy({
        id: req.userId,
    })
    await getUserModel.merge(user, req.body)
    const results = await getUserModel.save(user)
    return res.status(200).json({message:"updated successfully", data:results})
}


//delete users out
exports.deleteUser = async (req, res) => {
    try{

        const user = getloggedInUser(req)

        if(user.role == "admin" && req.user != user.id){
            const results = await getUserModel.delete(req.params.userId)
            return res.status(204).json({"message":"deleted"})
        }
        return res.status(401).json({"error":"You are not authorized to delete: Only admin user can delete"})
        
    }catch(err){
        return res.send(err)
    }
    
}


exports.logout = async (req, res) => {
    const user = await getUserModel.findOne({
        where:{id: req.user},
        select: ['accessToken', 'email']
    })
    accessToken = null
    const result = await getUserModel.createQueryBuilder()
        .update({
            accessToken
        })
        .where({
            email: user.email,
        })
        .returning('*') 
        .execute()
    
    return res.status(200).json({message:"logged out"})
}