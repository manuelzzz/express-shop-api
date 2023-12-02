const Order = require("../models/order");
const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

router.get("/", (req, res, next) => {
    Order.find()
        .select("product quantity _id")
        .exec()
        .then((docs) => {
            const response = {
                count: docs.length,
                orders: docs.map((doc) => {
                    return {
                        _id: doc._id,
                        product: doc.product,
                        quantity: doc.quantity,
                        requests: [
                            {
                                type: "GET",
                                description: "Get only this order",
                                url: "http://localhost:3000/orders/" + doc._id,
                            },
                            {
                                type: "GET",
                                description: "Get the product",
                                productUrl:
                                    "http://localhost:3000/products" +
                                    doc.product,
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

router.post("/", (req, res, next) => {
    const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId,
    });

    order
        .save()
        .then((result) => {
            res.status(201).json({
                createdOrder: {
                    _id: result._id,
                    product: result.product,
                    quantity: result.quantity,
                    requests: [
                        {
                            type: "GET",
                            description: "Get all orders",
                            url: "http://localhost:3000/orders",
                        },
                        {
                            type: "GET",
                            description: "Get the product",
                            url:
                                "http://localhost:3000/products" +
                                result.product,
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

router.get("/:orderId", (req, res, next) => {
    res.status(200).json({
        message: "Order details",
        orderId: req.params.orderId,
    });
});

module.exports = router;
