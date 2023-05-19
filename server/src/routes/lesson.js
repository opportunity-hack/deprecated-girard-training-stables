const router = require('express').Router();
const { createLesson, getLesson, updateLesson, deleteLesson } = require('../controllers/lessons');
const {
    checkRequiredPermissions,
} = require("../middlewares/auth0.middleware.js");

const EventPermissions = {
    Create: "create:events",
    Read: "read:events",
    Update: "update:events",
    Delete: "delete:events",
};

router.get("/", getLesson)
router.post("/",
    checkRequiredPermissions([EventPermissions.Create]),
    createLesson);
router.delete("/:id",
    checkRequiredPermissions([EventPermissions.Delete]),
    deleteLesson);
router.put("/:id",
    checkRequiredPermissions([EventPermissions.Update]),
    updateLesson);

module.exports = router;
