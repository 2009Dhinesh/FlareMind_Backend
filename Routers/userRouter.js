const express = require('express');
const router = express.Router();
const {Register, Login, logout, updateMe, getAllUsers, getOtherUsers} = require('../Controllers/UserControllers');
const  userMiddleware  = require('../Middleware/userMiddleware')

router.post('/signup' , Register );
router.post('/signin' , Login );
router.post("/logout", logout);
router.put("/me", userMiddleware, updateMe);
router.get("/all", userMiddleware, getAllUsers);
router.get("/others", userMiddleware, getOtherUsers);


module.exports = router;

