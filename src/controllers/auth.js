const { user, profile } = require('../../models')

const Joi = require('joi')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.register = async (req, res) => {
    const data = req.body

    // blueprint
    const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().min(5).required(),
        password: Joi.string().min(5).required()
    })

    // cek data
    const { error } = schema.validate(data)
    if (error) {
        return res.status(400).send({
            status: 'Error',
            message: error.details[0].message
        })
    }

    // email sudah digunakan
    const userExist = await user.findOne({
        where: {
            email: data.email
        },
        attributes: {
            exclude: ['password', 'createdAt', 'updatedAt']
        }
    })
    if (userExist) {
        return res.status(400).send({
            status: 'failed',
            message: 'Email has already taken'
        })
    }

    // entering data
    try {
        // bcrypt password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(data.password, salt)

        // masukin data
        const newUser = await user.create({
            name: data.name,
            email: data.email,
            password: hashedPassword,
            status: 'customer',
        })

        const newProfile = await profile.create({
            phone:'-',
            gender:'-',
            address:'-',
            image:'blankprofile_rja5lb.webp',
            idUser:newUser.id
        })
        // generate token
        const dataToken = {
            id: user.id
        }

        const SECRET_KEY = process.env.TOKEN_KEY
        const token = jwt.sign(dataToken, SECRET_KEY)

        // response
        res.status(201).send({
            status: 'success',
            data: {
                name: newUser.name,
                email: newUser.email,
                token
            }
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: 'failed',
            message: 'server error'
        })
    }
}

exports.login = async (req, res) => {
    const data = req.body
    const schema = Joi.object({
        email: Joi.string().email().min(5).required(),
        password: Joi.string().min(5).required()
    })

    // error
    const { error } = schema.validate(data)
    if (error) {
        return res.status(400).send({
            error: {
                message: error.details[0].message
            }
        })
    }

    // eksekusi
    try {
        // ada ato ga
        const userExist = await user.findOne({
            where: {
                email: data.email
            },
            attributes:{
                exclude:['createdAt','updatedAt']
            }
        })
        if(!userExist){
            return res.status(400).send({
                status:'failed',
                message:'Data not found'
            })
        }

        // cek password
        const passValid = await bcrypt.compare(data.password, userExist.password)
        if(!passValid){
            return res.status(400).send({
                status:'failed',
                message:'Email or Password doesn\'t match'
            })
        }

        // token
        const dataToken = {
            id: userExist.id
        }
        const SECRET_KEY = process.env.TOKEN_KEY
        const token = jwt.sign(dataToken, SECRET_KEY)

        // pengiriman
        res.status(200).send({
            status:'success',
            data:{
                name:userExist.name,
                email:userExist.email,
                status:userExist.status,
                token
            }
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status:'failed',
            message:'server error'
        })
    }

}

exports.checkAuth = async (req, res) =>{
    try {
        const id = req.user.id;

        const dataUser = await user.findOne({
            where:{
                id
            },
            attributes:{
                exclude:['createdAt','updatedAt','password']
            }
        })

        if(!dataUser){
            return res.status(404).send({
                status:'failed'
            })
        }

        res.send({
            status:'success',
            data:{
                user:{
                    id: dataUser.id,
                    name: dataUser.name,
                    email: dataUser.email,
                    status: dataUser.status,
                }
            }
        })
    } catch (error) {
        console.log(error);
        res.status({
            status:"failed",
            message:'server error'
        })
    }
}