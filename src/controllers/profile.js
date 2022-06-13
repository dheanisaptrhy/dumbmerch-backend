const { user, profile } = require('../../models')
const cloudinary = require('../utils/cloudinary');

exports.getProfile = async (req, res) => {
    try {
        const { id } = req.params

        let data = await profile.findOne({
            where: {
                idUser: id
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        })

        data = JSON.parse(JSON.stringify(data))
        res.send({
            status: 'success',
            data: {
                ...data,
                image: process.env.PATH_FILE + data.image
            }
        })
    } catch (error) {
        console.log(error)
        res.status(400).send({
            status: 'failed',
            message: 'server error'
        })
    }
}

exports.updateProfile = async (req, res) => {
    try {
        const { id } = req.params

        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'dumbmerch',
            use_filename: true,
            unique_filename: false,
          });

        const update = {
            image: result.public_id,
            phone: req?.body?.phone,
            idUser: req.user.id,
            address: req?.body?.address,
            gender: req?.body?.gender
        }
        const newProfile = {
            name: req?.body?.name,
            email: req?.body?.email,
            password: req.user.password,
            status: req.user.status
        }

        await profile.update(update, {
            where: {
                idUser:req.user.id
            }
        })

        await user.update(newProfile, {
            where: {
                id: req.user.id
            }
        })

        res.send({
            status: 'success',
            data: {
                update,
                newProfile,
                image:result.public_id
            }
        })


    } catch (error) {
        console.log(error);
        res.status(400).send({
            status: 'failed',
            message: 'server error'
        })
    }
}