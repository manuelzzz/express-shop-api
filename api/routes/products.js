const Product = require("../models/product");
const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

router.get("/", (req, res, next) => {
    Product.find()
        .exec()
        .then((docs) => {
            res.status(200).json(docs);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: err });
        });
});

router.get("/:productId", (req, res, next) => {
    const id = req.params.productId;

    Product.findById(id)
        .exec()
        .then((doc) => {
            if (doc) {
                res.status(200).json(doc);
            } else {
                res.status(404).json({
                    message: "No valid entry found for provided ID",
                });
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: err });
        });
});

router.post("/", (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
    });

    product
        .save()
        .then((result) => {
            res.status(201).json({
                message: "Handling POST resquests to /products",
                createdProduct: result,
            });
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: err });
        });
});

router.patch("/:productId", (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};

    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }

    Product.updateOne({ _id: id }, { $set: updateOps })
        .exec()
        .then((result) => {
            res.status(200).json(result);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: err });
        });
});

router.delete("/:productId", (req, res, next) => {
    const id = req.params.productId;

    Product.deleteMany({ _id: id })
        .exec()
        .then((result) => {
            res.status(200).json(result);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: err });
        });
});

module.exports = router;
