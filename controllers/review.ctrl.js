const { SchemaTypes, SchemaType } = require("mongoose");
const { update } = require("../models/review");
const Review = require("../models/review");
const User = require("../models/user");
const ObjectID = require('mongodb').ObjectID


exports.reviewDbcontroller = {
    getReviews(req, res) {
        let filter = {};
        if ('book_id' in req.query)
            filter.book_id = req.query.book_id;
        if ('user_id' in req.query)
            filter.user_id = req.query.user_id;
        Review.find(filter)
            .then(docs => { res.json(docs) })
            .catch(err => console.log('Error getting data from db: ${err}'));

    },
    addReview(req, res) {
        let review = req.body;
        review.user_id = req.user_id;
        const newReview = new Review(review);
        const result = newReview.save()
            .then(async result => {
                if (result) {
                    res.json(result)
                }
                else {
                    res.status(404).send("Error saving the review");

                }
            })
            .catch(err => console.log(`Error saving the data from db: ${err}`))

    },
    updateReview(req, res) {
        user_id = req.user_id;
        review_id = req.params.id

        Review.findById(review_id)
            .then(async review => {
                if (review.user_id != user_id) {
                    res.status(403).send("No permission to update review");
                }
                else {
                    review.text = req.body.text;
                    review.stars = req.body.stars;

                    await review.save();

                    res.json(review);
                }
            })
            .catch( err => console.log("Error updating review"));
    },

    deleteReview(req, res) {
        user_id = req.user_id;
        review_id = req.params.id

        Review.findById(review_id)
            .then(async review => {
                if (review.user_id != user_id) {
                    res.status(403).send("No permission to delete review");
                }
                else {

                    await review.delete();
                    res.json(review);
                }
            })
            .catch("Error updating review");
    }

}