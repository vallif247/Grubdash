const router = require("express").Router();
const controller = require("./orders.controller")

// TODO: Implement the /orders routes needed to make the tests pass
router
  .route("/")
  .get(controller.list)
  .post(controller.newOrder)

router
  .route("/:orderId")
  .get(controller.getOrder)
  .put(controller.update)
  .delete(controller.remove)

module.exports = router;
