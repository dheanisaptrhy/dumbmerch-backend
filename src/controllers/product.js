const { products, user, category, productCategory } = require('../../models')
const cloudinary = require('../utils/cloudinary');

exports.addProduct = async (req, res) => {
    try {
        let { categoryId } = req.body
        console.log(req.body.categoryId);

        if (categoryId) {
            categoryId = categoryId.split(',')
        }

        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'dumbmerch',
            use_filename: true,
            unique_filename: false,
          });

        const data = {
            title: req.body.title,
            desc: req.body.desc,
            price: req.body.price,
            image: result.public_id,
            // image: req?.file?.filename,
            qty: req.body.qty,
            idUser: req.user.id
        }
        const createProduct = await products.create(data)

        if (categoryId) {
            const productCategoryData = categoryId.map((item) => {
                return {
                    idProduct: createProduct.id, idCategory: parseInt(item)
                }
            })
            await productCategory.bulkCreate(productCategoryData)
        }

        let productData = await products.findOne({
            where: {
                id: createProduct.id
            },
            include: [
                {
                    model: user,
                    as: 'user',
                    attributes: {
                        exclude: ["createdAt", "updatedAt", "password"]
                    }
                }, {

                    model: category,
                    as: "categories",
                    through: {
                        model: productCategory,
                        as: "bridge",
                        attributes: []
                    },
                    attributes: {
                        exclude: ["createdAt", "updatedAt"],
                    }
                }
            ], attributes: {
                exclude: ["createdAt", "updatedAt", "idUser"],
            }

        })

        productData = JSON.parse(JSON.stringify(productData))
        res.send({
            status: 'success',
            data: {
                ...productData,
                image: process.env.PATH_FILE + productData.image
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

exports.getProducts = async (req, res) => {
    try {
        let data = await products.findAll({
            include: [
                {
                    model: user,
                    as: "user",
                    attributes: {
                        exclude: ["createdAt", "updatedAt", "password"],
                    },
                },
                {
                    model: category,
                    as: "categories",
                    through: {
                        model: productCategory,
                        as: "bridge",
                        attributes: [],
                    },
                    attributes: {
                        exclude: ["createdAt", "updatedAt"],
                    },
                },
            ],
            attributes: {
                exclude: ["createdAt", "updatedAt", "idUser"],
            },
        });

        data = JSON.parse(JSON.stringify(data))

        data = data.map((item) => {
            return {
                ...item,
                image: process.env.PATH_FILE + item.image
            }
        })

        res.send({
            status: 'success',
            data
        })
    } catch (error) {
        console.log(error)
        res.status(400).send({
            status: 'failed',
            message: 'server error'
        })
    }
}

exports.getProductDetail = async (req, res) => {
    try {
        const { id } = req.params
        let data = await products.findOne({
            where: {
                id
            }, include: [
                {
                    model: user,
                    as: "user",
                    attributes: {
                        exclude: ["createdAt", "updatedAt", "password"],
                    },
                },
                {
                    model: category,
                    as: "categories",
                    through: {
                        model: productCategory,
                        as: "bridge",
                        attributes: [],
                    },
                    attributes: {
                        exclude: ["createdAt", "updatedAt"],
                    },
                },
            ],
            attributes: {
                exclude: ['idUser', 'createdAt', 'updatedAt']
            }
        })

        data = JSON.parse(JSON.stringify(data))
        data = {
            ...data,
            image: process.env.PATH_FILE + data.image
        }
        res.send({
            status: 'success',
            data
        })
    } catch (error) {

    }
}

exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params
        let { categoryId } = req.body
        categoryId = await categoryId.split(',')

        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'dumbmerch',
            use_filename: true,
            unique_filename: false,
          });

        const updates = {
            title: req?.body?.title,
            desc: req?.body?.desc,
            price: req?.body?.price,
            image: result.public_id,
            // image: req?.file?.filename,
            qty: req.body.qty,
            idUser: req.user.id
        }

        await productCategory.destroy({
            where: {
                idProduct: id
            }
        })

        let productCategoryData = []
        if (categoryId != 0 && categoryId[0] != '') {
            productCategoryData = categoryId.map((item) => {
                return { idProduct: parseInt(id), idCategory: parseInt(item) }
            })
        }

        if (productCategoryData.length != 0) {
            await productCategory.bulkCreate(productCategoryData)
        }

        await products.update(updates, {
            where: {
                id
            }
        })

        res.send({
            status: 'success',
            data: {
                id,
                data,
                productCategoryData,
                image: req?.file?.filename
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

exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params
        await products.destroy({
            where: {
                id
            }
        })

        await productCategory.destroy({
            where: {
                idProduct: id
            }
        })

        res.send({
            status: 'success',
            data: {
                id
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

exports.getProductName = async (req, res) => {
    try {
        const { title } = req.params
        const find = await products.findAll({
            where: {
                title
            }
        })
        res.send({
            status: 'success',
            data: {
                find
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