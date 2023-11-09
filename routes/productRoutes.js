const getProducts = require("../controllers/productControllers");
const { verifyRole } = require("../controllers/userControllers");
const auth = require("../middlewares/authMiddleware");
const router = require("express").Router();

router.get(
  "/",
  auth,
  verifyRole(["user", "merchant", "admin","random person"]),
  getProducts
);
// router.post("/",createProduct);
// router.get("/:id",getProduct);
// router.patch("/:id",updateProduct);
// router.delete("/:id",deleteProduct);

module.exports = router;
