const { getOrders, createOrder } = require("../controllers/orderController");
const auth = require("../middlewares/authMiddleware");
const router = require("express").Router();

router.get("/", auth, getOrders);
router.post("/checkout", auth, createOrder);

module.exports = router;
