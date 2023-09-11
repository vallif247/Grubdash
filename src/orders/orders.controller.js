const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /orders handlers needed to make the tests pass
function list(req, res) {
  res.status(200).json({ data: orders })
}

function validateOrder(req, res, next) {
  const {data: { deliverTo, mobileNumber, dishes, quantity } = {} } = req.body;
  if (!deliverTo || deliverTo === "") {
    next({ status: 400, message: "Order must include a deliverTo" });
  }
  if (!mobileNumber || mobileNumber === "") {
    next({ status: 400, message: "Order must include a mobileNumber" });
  }
  if (!dishes) {
    next({ status: 400, message: "Order must include a dish" });
  }
  if (!Array.isArray(dishes) || dishes.length === 0) {
    next({ status: 400, message: "Order must include at least one dish" });
  }
    for (let i = 0; i < dishes.length; i++) {
    const dish = dishes[i];
    if (!dish.quantity || !Number.isInteger(dish.quantity) || dish.quantity <= 0)
    next({ status: 400, message: `Dish ${i} must have a quantity that is an integer greater than 0`})
  }
  next()
}

function newOrder(req, res) {
  const {data: { deliverTo, mobileNumber, dishes, quantity } = {} } = req.body;
  const newOrd = {
    id: nextId(),
    deliverTo,
    mobileNumber,
    dishes,
    quantity,
  };
  orders.push(newOrd)
  res.status(201).json({ data: newOrd })
}

function idExists(req, res, next) {
  const orderId = req.params.orderId;
  const foundOrder = orders.find((order) => order.id === orderId);
  if (!foundOrder) {
    return res.status(404).json({error: `id ${orderId} not found`})
  }
  next();
}

function getOrder(req, res) {
  const orderId = req.params.orderId;
  const foundOrder = orders.find((order) => order.id === orderId);
  res.status(200).json({ data: foundOrder })
}

function update(req, res) {
  const orderId = req.params.orderId;
  const foundOrder = orders.find((order) => order.id === orderId);
  const { data: { id, deliverTo, mobileNumber, dishes, quantity, status } = {} } = req.body;
  if (!status || status === "invalid") {
    return res.status(400).json({ error: "status is missing."})
  }
  if (id && id !== orderId) {
    return res.status(400).json({ error: `id ${id} does not match :orderId ${orderId}` })
  }
  foundOrder.deliverTo = deliverTo;
  foundOrder.mobileNumber = mobileNumber;
  foundOrder.dishes = dishes;
  foundOrder.status = status;
  foundOrder.quantity = quantity;
    res.json({ data: foundOrder });
}

function remove(req, res) {
  const orderId = req.params.orderId;
  const foundOrder = orders.find((order) => order.id === orderId);
  const index = orders.findIndex((order) => order.id === orderId)
  if (!foundOrder) {
    
  }
  if (foundOrder.status !== "pending") {
    return res.status(400).json({ error: "Can't delete order unless pending."})
  }
  orders.splice(index, 1)
  res.sendStatus(204);
}

module.exports = {
  list, 
  newOrder: [validateOrder, newOrder], 
  getOrder: [idExists, getOrder], 
  update: [validateOrder, idExists, update], 
  remove: [idExists, remove], 
}