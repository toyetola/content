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

function generateRndomString(lengthOfString){
    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let token = '';
    for (let i = 0; i < lengthOfString; i++) {
        token += characters[Math.floor(Math.random() * characters.length )];
    }
    return token
}


const getUserModel = AppDataSource.getRepository(User)


exports.startResetPassword = async (req, res)=>{
    try{
        if (req.body.email) {
            const user = await getUserModel.findOne({
                select: ['id', 'email','password', 'firstname', 'lastname', 'password_recovery_token'],
                where: { email:req.body.email }
            })
            
            if (user) {
                const token = await generateRndomString(7)
                const password_recovery_token = token
                user.password_recovery_token = token
                const result = await getUserModel.createQueryBuilder()
                .update({
                    password_recovery_token
                })
                .where({
                    email: user.email,
                })
                .returning('*') 
                .execute()
        
                return res.status(200).json({"message":"acount exists got the url with token provided in data", data: token, "visit":process.env.APP_URL+"/api/v1/resetPassword"})            
            }
            return res.status(403).json({"error":"user does not exist"})
        }
        return res.status(403).json({"error":"email is required"})
    }catch(err){
        return res.send(err)
    }
}


exports.resetPassword = async (req, res)=>{
    try{
        if(!req.body.new_password){
            return res.status(403).json({error:"new_password field is required"})
        }
        if (req.body.token) {
            const user = await getUserModel.findOne({
                select: ['email', 'password', 'password_recovery_token'],
                where: { password_recovery_token:req.body.token }
            })
            
            if (user) {
                const hashedPassword = await hashPassword(req.body.new_password)
                const result = await getUserModel.createQueryBuilder()
                .update({
                    password : hashedPassword,
                    password_recovery_token : null
                })
                .where({
                    email: user.email,
                })
                .returning('*')
                .execute()
                return res.status(200).json({"mesage":"password successfully changed"})
            }
            return res.status(403).json({"error":"user does not exist"})
        }
        return res.status(403).json({"error":"email is required"})
    }catch(err){
        return res.send(err)
    }
}



//log users out
/* exports.logout = async (req, res) => {
    const user = await getUserModel.findOneBy({
        select:['accessToken'],
        id: req.user
    })
    jwt.destroy(user.accessToken) 
    return res.status(200).json({message:"logged out"})
} */

