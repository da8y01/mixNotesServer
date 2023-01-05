const express = require('express');
const bodyParser = require('body-parser');

const itemRouter = express.Router();

itemRouter.use(bodyParser.json());

itemRouter.route('/')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req,res,next) => {
    res.end('Will send all the items to you!');
})
.post((req, res, next) => {
    res.end('Will add the item: ' + req.body.name + ' with details: ' + req.body.description);
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /items');
})
.delete((req, res, next) => {
    res.end('Deleting all items');
});

itemRouter.route('/:itemId')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req,res,next) => {
    res.end(`Will send the item ${req.params.itemId} to you!`);
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /items/' + req.params.itemId);
})
.put((req, res, next) => {
    res.end('Will update the item: ' + req.body.name + ' with details: ' + req.body.description);
})
.delete((req, res, next) => {
    res.end('Deleting item ' + req.params.itemId);
});

module.exports = itemRouter;