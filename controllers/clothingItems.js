const mongoose = require("mongoose");
const {
  BAD_REQUEST,
  NOT_FOUND,
  FORBIDDEN,
  INTERNAL_SERVER_ERROR,
} = require("../utils/errors");
const ClothingItem = require("../models/clothingItem");

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send({ data: items }))
    .catch((err) => {
      console.error("Error fetching items:", err);
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "Error retrieving items", error: err.message });
    });
};

const createItem = (req, res) => {
  console.log(req.body);

  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => res.status(201).send({ data: item }))
    .catch((e) => {
      res
        .status(BAD_REQUEST)
        .send({ message: "Error creating item", error: e.message });
    });
};

const deleteItem = (req, res) => {
  const userId = req.user._id;
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(400).send({ message: "Invalid item ID format" });
  }

  ClothingItem.findById(itemId)
    .then((item) => {
      if (!item) {
        return res.status(NOT_FOUND).send({ message: "Item not found" });
      }

      if (item.owner.toString() !== userId) {
        return res
          .status(FORBIDDEN)
          .send({ message: "You are not allowed to delete this item" });
      }

      return item.deleteOne().then(() => res.send({ message: "Item deleted" }));
    })
    .catch((err) => {
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "Error deleting item", error: err.message });
    });
};

// Like an item
const likeItem = (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.itemId)) {
    return res.status(BAD_REQUEST).send({ message: "Invalid item ID format" });
  }

  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } }, // add _id to the array if it's not there yet
    { new: true }
  )
    .then((item) => {
      if (!item) {
        return res.status(NOT_FOUND).send({ message: "Item not found" });
      }
      res.send({ data: item });
    })
    .catch((e) => {
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "Error liking item", error: e.message });
    });
};

// Dislike (unlike) an item
const dislikeItem = (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.itemId)) {
    return res.status(BAD_REQUEST).send({ message: "Invalid item ID format" });
  }

  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } }, // remove _id from the array
    { new: true }
  )
    .then((item) => {
      if (!item) {
        return res.status(NOT_FOUND).send({ message: "Item not found" });
      }
      res.send({ data: item });
    })
    .catch((e) => {
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "Error disliking item", error: e.message });
    });
};

module.exports = {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
};
