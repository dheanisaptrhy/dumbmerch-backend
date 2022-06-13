const { category } = require('../../models')


exports.addCategory = async (req, res) => {
    try {
        const data = req.body
        const createCategory = await category.create({
            name: data.name
        })

        res.status(200).send({
            status: 'success',
            data: {
                createCategory
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

exports.getCategories = async (req, res) => {
    try {
        const data = await category.findAll({
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        })
        res.status(200).send({
            status: 'success',
            data
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            status: 'failed',
            message: 'Server error'
        })
    }
}

exports.getCategory = async (req, res) => {
    try {
        const { id } = req.params
        const data = await category.findOne({
            where: {
                id
            }
        })
        res.status(200).send({
            status: 'success',
            data
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            status: 'failed',
            message: 'Server error'
        })
    }
}

exports.updateCategory = async (req, res) => {
    try {
        const data = req.body
        const { id } = req.params
        await category.update(data, {
            where: {
                id
            }
        })

        const updated = await category.findOne({
            where: {
                id
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        })

        res.send({
            status: 'success',
            data: {
                updated
            }
        })
    } catch (error) {
        console.log(error)
        res.send({
            status: 'failed',
            message: 'Server Error'
        })
    }
}

exports.deleteCategory = async (req, res) => {
    try {
        const {id}= req.params
        await category.destroy({
            where:{
                id
            }
        })
        res.status(200).send({
            status:'success',
            data:{
                id
            }
        })
    } catch (error) {
        console.log(error)
        res.send({
            status: 'failed',
            message: 'Server Error'
        })
    }
}