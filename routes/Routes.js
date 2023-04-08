const express = require("express");
const router = express.Router();
const {auth} = require("../middlewares/auth.middlewares")
const  {
    signUp,
    login,
    logout
} = require('../controllers/auth.controllers')
const {
    createTask,
    addAction,
    updateAction,
    updatetask
} =require('../controllers/task.controllers')

router.get("/", (req, res) => {
    res.send("Hello auth system")
})
router.post("/api/auth/signup",signUp);
router.post("/api/auth/login", login);
router.post("/api/auth/logout", auth, logout);
router.post("/api/createTask", auth, createTask);
router.post("/api/addAction", auth, addAction);
router.put("/api/updateAction/:taskid", auth, updateAction);
router.put("/api/updatetask/:taskid", auth, updatetask);

module.exports = router;
