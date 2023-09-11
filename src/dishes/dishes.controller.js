const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass
//need create, read, update, and list dishes. No delete

function idExists(req, res, next) {//middleware to find if Id
  const dishId = req.params.dishId
  const foundId = dishes.find((dish) => dish.id === dishId)
  if (!foundId) {
    next({status: 404, message:`Dish does not exist ${dishId}.` })
  }
    next()
}

function includesName(req, res, next) {
  const { data: { id, name, description, price, image_url } = {} } = req.body;
  const newDish = {
    id: nextId,
    name,
    description, 
    price, 
    image_url,
  };
    if (!name || name === "") {
    next({status:400, message:"Dish must include a name"})
  }
  next()
}

function includesDescription(req, res, next) {
  const { data: { id, name, description, price, image_url } = {} } = req.body;
  const newDish = {
    id: nextId,
    name,
    description, 
    price, 
    image_url,
  };
  if (!description || description === "") {
    next({status:400, message:"Dish must include a description"})
  }
  next()
}

function includesPrice(req, res, next) {
  const { data: { id, name, description, price, image_url } = {} } = req.body;
  const newDish = {
    id: nextId,
    name,
    description, 
    price, 
    image_url,
  };
    if (!price) {
    next({status: 400, message:"Dish must include a price"})
  }
    if (price <= 0 || !Number.isInteger(price)) {
    next({status: 400, message:"Dish must have a price that is an integer greater than 0"})
   }
  next()
}

function includesImageUrl(req, res, next) {
  const { data: { id, name, description, price, image_url } = {} } = req.body;
  const newDish = {
    id: nextId,
    name,
    description, 
    price, 
    image_url,
  };
  if (!image_url || image_url === "") {
    next({status:400, message:"Dish must include a image_url" })
  }
  next()
}

function createDish(req, res) {
   const { data: { name, description, price, image_url } = {} } = req.body;
  const newDish = {
    id: nextId(),
    name,
    description, 
    price, 
    image_url,
  };
  dishes.push(newDish);
  res.status(201).json({ data: newDish });
}

function readDish(req, res) {
  const dishId = req.params.dishId;
  const foundDish = dishes.find((dish) => dish.id === dishId)
  res.status(200).json({ data: foundDish })
}

function updateDish(req, res) {
  const dishId = req.params.dishId;
    const findDish = dishes.find((dish) => (dish.id === dishId));
  const { data: { id, name, description, price, image_url } = {} } = req.body;
  
  if (id && id !== dishId) {
    return res.status(400).json({ error: `data.id ${id} does not match :dishId ${dishId}` })
  }
  if (!name || !description || !image_url || isNaN(price) || typeof price === "string" || price === "" || price <= 0) {
  return res.status(400).json({ error: 'Invalid input for name, description, price, or image_url' })
}
  findDish.name = name
  findDish.description = description
  findDish.price = price
  findDish.image_url = image_url
  res.json({ data: findDish })
}

function listDishes(req, res) {
  res.status(200).json({ data: dishes})
}

module.exports = {
  createDish: [includesName, includesDescription, includesPrice, includesImageUrl, createDish],
  readDish: [idExists, readDish],
  updateDish: [idExists, updateDish],
  listDishes,
}