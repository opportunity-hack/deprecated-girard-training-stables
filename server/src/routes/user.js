import { 
  getUsers,
  createUser,
  deleteUser, 
  updateUser 
} from "../controllers/user";
const router = require('express').Router();

router.route("/").get(getUsers).post(createUser)
router.route("/:id").delete(deleteUser).put(updateUser)

module.exports = router;
