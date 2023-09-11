const router = require("express").Router();
const controller = require("./dishes.controller")
const methodNotAllowed = require("../errors/methodNotAllowed")

// TODO: Implement the /dishes routes needed to make the tests pass
router
  .route("/")
  .post(controller.createDish)
  .get(controller.listDishes)
  
router
  .route("/:dishId")
  .get(controller.readDish)
  .put(controller.updateDish)
  .delete(methodNotAllowed)


module.exports = router;
