const {
  getCart,
  createCart,
  deleteCart,
} = require("../controllers/cartControllers");
const auth = require("../middlewares/authMiddleware");
const router = require("express").Router();

router.get("/", auth, getCart);
router.post("/", auth, createCart);
router.delete("/", auth, deleteCart);

module.exports = router;
