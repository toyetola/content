import { User } from "../entity/User" 
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
import { AppDataSource } from "../data-source"

async function hashPassword(password){
    return await bcrypt.hash(password, 10);
}

async function validatePassword(plainPassword, hashedPassword){
    return await bcrypt.compare(plainPassword, hashedPassword);
}


const getUserModel = AppDataSource.getRepository(User)


//login method
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await getUserModel.findOne({
            select: ['email','password'],
            where: { email }
        });
        if (!user) 
            return next(new Error('Email does not exist'));
        const validPassword = await validatePassword(password, user.password);
        if (!validPassword) 
            return next(new Error('Password is not correct'))
        const accessToken = jwt.sign({ userId: user.id, iss: process.env.APP_URL }, process.env.PUBLIC_KEY, {
            expiresIn: "1h"
        });
        await User.findByIdAndUpdate(user.id, { accessToken })
        res.status(200).json({data: { id: user.id, email: user.email, role: user.role }, accessToken})
    } catch (error) {
        next(error);
    }
}





//log users out
exports.logout = async (req, res) => {
    const user = await getUserModel.findOneBy({
        id: req.user
    })
    jwt.destroy(user.accessToken) 
    return res.status(200).json({message:"logged out"})
}


//