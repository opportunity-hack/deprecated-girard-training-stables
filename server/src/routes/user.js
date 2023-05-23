const { 
  getUsers,
  createUser,
  deleteUserById, 
  updateUserById 
} = require("../controllers/user");
const {
    checkRequiredPermissions,
} = require("../middlewares/auth0.middleware");
const router = require('express').Router();

const UserPermissions = {
    Create: "create:users",
    Update: "update:users",
    Delete: "delete:users",
}

router.route("/").get(getUsers)

router.post("/",
    checkRequiredPermissions([UserPermissions.Create]),
    createUser);
router.delete("/:id",
    checkRequiredPermissions([UserPermissions.Delete]),
    deleteUserById)
router.patch("/:id",
    checkRequiredPermissions([UserPermissions.Update]),
    updateUserById)

module.exports = router;
