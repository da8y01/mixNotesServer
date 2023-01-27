const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

var authenticate = require('../authenticate');
const Items = require('../models/items');

const itemRouter = express.Router();

itemRouter.use(bodyParser.json());

itemRouter.route('/')
.get((req,res,next) => {
    Items.find({})
    .then((items) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(items);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser, (req, res, next) => {
    Items.create(req.body)
    .then((item) => {
        console.log('Dish Created ', item);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(item);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /items');
})
.delete(authenticate.verifyUser, (req, res, next) => {
    Items.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
});

itemRouter.route('/:itemId')
.get((req,res,next) => {
    Items.findById(req.params.itemId)
    .then((item) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(item);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /items/'+ req.params.itemId);
})
.put(authenticate.verifyUser, (req, res, next) => {
    Items.findByIdAndUpdate(req.params.itemId, {
        $set: req.body
    }, { new: true })
    .then((item) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(item);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(authenticate.verifyUser, (req, res, next) => {
    Items.findByIdAndRemove(req.params.itemId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = itemRouter;