const router = require("express").Router();
express = require("express");
const User = require("../models/User");
var bcrypt = require("bcryptjs");
require("dotenv").config();
const { authSchema } = require('../helpers/validationSchema')
const jwt = require("jsonwebtoken");


//REGISTER
router.post("/register", express.urlencoded({ extended: true }), async(req, res) => {
    const result = authSchema.validateAsync(req.body)
    if(result.error == null){

        const old = await User.findOne({ username: req.body.username });
        if(old){
            res.status(400).json("User already exists!")
            return;
        }
        const userData = new User({
            username: req.body.username,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 8),
            isAdmin: Boolean(req.body.isAdmin),
            isModerator: Boolean(req.body.isModerator)
        })

        try {
            const user = await userData.save();
            res.status(201).json(user);
        } catch (error) {
            res.status(500).json(error);
        }
    }else{
        res.status(403).json("Inputs are not allowed!");
    }
})

//LOGIN
router.post("/login", express.urlencoded({ extended: true }), async(req, res) => {
        console.log(req.body)
        const user = await User.findOne({ email: req.body.email })

        if(user){
            var passwordIsValid = bcrypt.compare(
                req.body.password,
                user.password
            );

            if (!passwordIsValid) {
                return res.status(401)
                    .send({
                        token: null,
                        message: "Invalid Password!"
                    });
            }
            const token = jwt.sign({
                userId: user._id, 
                isAdmin: user.isAdmin,
                isModerator: user.isModerator
            }, process.env.SECRET_KEY, {expiresIn: "2h" });

            res.status(200).json(`${token}`);
        }else{
            !user && res.status(401).json("User not found!");
        }
})

module.exports = router;
