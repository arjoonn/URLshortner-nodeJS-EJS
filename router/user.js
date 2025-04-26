const express = require('express')
const router = express.Router()
const{ handleUserSignUp,handleUserLogin } = require('../controller/user')

router.post('/',handleUserSignUp)
router.post('/login',handleUserLogin)


module.exports=router;
