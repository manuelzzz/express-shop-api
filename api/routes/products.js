const Product = require("../models/product");
const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

router.get("/", (req, res, next) => {
    Product.find()
        .select("name price _id")
        .exec()
        .then((docs) => {
            const response = {
                count: docs.length,
                products: docs.map((doc) => {
                    return {
                        _id: doc._id,
                        name: doc.name,
                        price: doc.price,
                        requests: [
                            {
                                type: "GET",
                                description: "Get only this product",
                                url:
                                    "http://localhost:3000/products/" + doc._id,
                            },
                        ],
                    };
                }),
            };

            res.status(200).json(response);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: err });
        });
});

router.get("/:productId", (req, res, next) => {
    const id = req.params.productId;

    Product.findById(id)
        .select("name price _id")
        .exec()
        .then((doc) => {
            if (doc) {
                res.status(200).json({
                    product: doc,
                    requests: [
                        {
                            type: "GET",
                            description: "Get all products",
                            url: "http://localhost:3000/products/",
                        },
                    ],
                });
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
                createdProduct: {
                    _id: result._id,
                    name: result.name,
                    price: result.price,
                    requests: [
                        {
                            type: "GET",
                            description: "Get the created product",
                            url: "http://localhost:3000/products/" + result._id,
                        },
                    ],
                },
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
            res.status(200).json({
                changesNum: result.modifiedCount,
                found: result.acknowledged,
                requests: [
                    {
                        type: "GET",
                        description: "Get the updated product",
                        url: "http://localhost:3000/products/" + id,
                    },
                ],
            });
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
