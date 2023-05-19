const { 
  getMe,
  createMe,
  deleteMe, 
  updateMe, 
} = require("../controllers/me");
const router = require('express').Router();

router.route("/").get(getMe).post(createMe).put(updateMe).delete(deleteMe)

module.exports = router;
