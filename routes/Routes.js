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
    gettask,
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
router.put("/api/task/updateaction/:taskid", auth, updateAction);
router.put("/api/task/updatetask/:taskid", auth, updatetask);
router.post("/api/task/gettask", auth, gettask);

module.exports = router;
