const router = require('express').Router();
const { createLesson, getLesson, updateLesson, deleteLesson } = require('../controllers/lessons');
const {
    checkRequiredPermissions,
    validateAccessToken
} = require("../middlewares/auth0.middleware.js");

const EventPermissions = {
    Create: "create:events",
    Read: "read:events",
    Update: "update:events",
    Delete: "delete:events",
};

router.get("/", getLesson)
router.post("/",
    validateAccessToken,
    checkRequiredPermissions([EventPermissions.Create]),
    createLesson);
router.delete("/:id",
    validateAccessToken,
    checkRequiredPermissions([EventPermissions.Delete]),
    deleteLesson);
router.put("/:id",
    validateAccessToken,
    checkRequiredPermissions([EventPermissions.Update]),
    updateLesson);

module.exports = router;
