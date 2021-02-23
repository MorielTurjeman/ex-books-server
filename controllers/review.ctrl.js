const { SchemaTypes } = require("mongoose");
const Review = require("../models/review");



exports.reviewDbcontroller = {
    getReviews(req, res) {
        let filter = {};
        if ('book_id' in req.query)
            filter.book_id = req.query.book_id;
        if ('user_id' in req.query)
            filter.user_id = req.query.user_id;
        Review.find(filter)
            .then(docs => { res.json(docs) })
            .catch(err => {
                res.status(500).json(`Error getting reviews`);
                console.log(`Error getting reviews ${err}`)
            })

    },
    getReview(req, res){
        const reviewId = req.params.id;
        Review.findById(reviewId)
            .then(review=>res.json(review))
            .catch(err => {
                res.status(500).json(`Error get a review`);
                console.log(`Error get a review ${err}`)
            })

    },
    addReview(req, res) {
        const { review } = req.body;
        review.user_id = req.user._id;
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
            .catch(err => {
                res.status(500).json(`Error adding a review`);
                console.log(`Error adding a review ${err}`)
            })

    },
    updateReview(req, res) {
        const user_id = req.user._id;
        const review_id = req.params.id
        Review.findOne({_id: review_id, user_id: user_id})
            .then(async review => {
                console.log(review);
                if (!review) {
                    res.status(403).send("No permission to update review");
                }
                else {
                    review.text = req.body.text;
                    review.stars = req.body.stars;
                    review.name = req.body.name
                    await review.save();

                    res.json(review);
                }
            })
            .catch(err => {
                res.status(500).json(`Error updating review`);
                console.log(`Error updating review ${err}`)
            })
    },

    deleteReview(req, res) {
        const user_id = req.user._id;
        const review_id = req.params.id

        Review.findOne({_id: review_id, user_id: user_id})
            .then(async review => {
                if (!review) {
                    res.status(403).send("No permission to delete review");
                }
                else {

                    await review.delete();
                    res.json(review);
                }
            })
            .catch(err => {
                res.status(500).json(`Error deleting review`);
                console.log(`Error deleting review ${err}`)
            })
    }

}