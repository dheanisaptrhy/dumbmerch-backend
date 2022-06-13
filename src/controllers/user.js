const { user } = require('../../models')

exports.getUsers = async (req,res)=>{
    try {
        const data = await user.findAll({
            attributes:{
                exclude:['password','image','createdAt','updatedAt']
            }
        })
        res.status(200).send({
            status:'success',
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