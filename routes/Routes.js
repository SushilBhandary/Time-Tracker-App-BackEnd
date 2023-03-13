const express = require("express");
const router = express.Router();
const {auth} = require("../middlewares/auth.middlewares")
const  {
    signUp,
    login,
    logout
} = require('../controllers/auth.controllers')

router.get("/", (req, res) => {
    res.send("Hello auth system")
})
router.post("/api/auth/signup",signUp);
router.post("/api/auth/login", login);
router.post("/api/auth/logout", auth, logout);

module.exports = router;
