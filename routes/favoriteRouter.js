const express = require('express');
const bodyParser = require('body-parser');
const cors = require('./cors');
var authenticate = require('../authenticate');
const Favorite = require('../models/favorite');

const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, authenticate.verifyUser, (req,res,next) => {
    Favorite.findOne({user: req.user.id})
    .populate('user items')
    .then((favorite) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorite);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({user: req.user.id})
    .then((favorite) => {
        if (!favorite) {
            Favorite.create({user: req.user.id, items: req.body}).then(favorite => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            }).catch(err => next(err));
        }
        else {
            req.body.map(e => {
                if (favorite.items.indexOf(e) < 0) favorite.items.push(e)
            });
            favorite.save().then(favorite => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            }).catch(err => next(err));
        }
    }, err => next(err))
    .catch(err => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOneAndRemove({user: req.user.id})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
});

favoriteRouter.route('/:favoriteId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({user: req.user.id})
    .then((favorite) => {
        if (!favorite) {
            Favorite.create({user: req.user.id, items: [req.params.favoriteId]}).then(favorite => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            }).catch(err => next(err));
        }
        else {
            favorite.items.push(req.params.favoriteId);
            favorite.save().then(favorite => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            }).catch(err => next(err));
        }
    }, err => next(err))
    .catch(err => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({user: req.user.id})
    .then((favorite) => {
        if (favorite) {
            favorite.update({items: favorite.items.filter(item => item != req.params.favoriteId)}).then(updated => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(updated);
            }).catch(err => next(err));
        }
        else {
            res.statusCode = 404;
            res.end('DELETE failed, favorite not found.');
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = favoriteRouter;