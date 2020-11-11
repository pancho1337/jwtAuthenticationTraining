const router = require('express').Router()
const User = require('../model/User')
const { registerValidation, loginValidation } = require('../validation')
const bcrypt = require('bcryptjs')
const { restart } = require('nodemon')
const jwt = require('jsonwebtoken')

router.post('/register', async (req, res) => {
    // const {error} = schema.validate(req.body) 
    const { error } = registerValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    const emailExist = await User.findOne({email: req.body.email})
    if(emailExist) return res.status(400).send("email already in db")

    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(req.body.password, salt)


    const user = new User({
        name: req.body.name, 
        email: req.body.email, 
        password: hashPassword
    })
    try{
        const savedUser = await user.save()
        res.send({user: savedUser._id})
    }catch(err){
        res.status(400).send(err)
    }
})


router.post('/login', async (req, res) => {
    const { error } = loginValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    const user = await User.findOne({email: req.body.email})
    if(!user) return res.status(400).send("email/pw does not exist")


    const validPass = await bcrypt.compare(req.body.password, user.password)
    if(!validPass) return res.status(400).send('email/pw does not exist')

    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET)
    res.header('auth-token', token).send(token)

})


module.exports = router; 