const Swap = require('../models/swap');
const User = require('../models/user');

exports.swapDbcontroller = {
    getSwaps(req, res) {
        let filter = {};
        if ('swap_date' in req.query)
            filter.swap_date = req.query.swap_date;
        if ('swap_status' in req.query)
            filter.swap_status = req.query.swap_status;
        console.log(req.user)
        Swap.find({ $and: [{ $or: [{ user_id1: req.user._id }, { user_id2: req.user._id }] }, filter] })
            .populate('user_id1', "first_name email address.city")
            .populate('user_id2', "first_name email address.city")
            .then(docs => { res.json(docs) })
            .catch(err => {
                res.status(500).json(`Error getting swaps`);
                console.log(`Error getting swaps ${err}`)
            })
    },

    getSwap(req, res) {
        const swapId= req.params.id;
        Swap.findById(swapId)
            .then(swap=>res.json(swap))
            .catch(err => {
                res.status(500).json(`Error get a swap`);
                console.log(`Error get a swap ${err}`)
            })

    },

    addSwap(req, res) {
        const swap= req.body;
        console.log(swap);
        if (swap.user_id1 != req.user._id)
            res.status(400).json("No permission");
        
        const newSwap= new Swap(swap);
        const isBookId1 = User.findById(swap.user_id1).then(user => {
            console.log(user.books);
            if (user.books.includes(swap.book_id1))
                return true;
            else
                return false;
        })
        .then(bookValid => {
            if (bookValid)
            {
                return newSwap.save()        
            }
            throw new Error('Book mismatch');
        })
        .then(result => {
            if (result) {
                res.json(result)
            }
            else {
                res.status(404).send("Error saving the swap to db");
            }
        })
        .catch(err => {
            res.status(500).json(`Error adding a swap`);
            console.log(`Error adding a swap ${err}`)
        })
    },

    updateSwap(req, res){
        user_id = req.user._id;
        swap_id=req.params.id;

        Swap.findById(swap_id)
            .then(async swap=> {
                if(swap.user_id1 != user_id || swap.user_id2 !=user_id){
                    res.status(403).send("No permission to update swap");
                }
                else{
                    swap.swap_status= req.body.swap_status;
                    await swap.save();
                    res.json(swap);
                }   
            })
            .catch(err => {
                res.status(500).json(`Error updating swap status`);
                console.log(`Error updating swap status${err}`)
            })

    },

    deleteSwap(req, res){
        user_id = req.user._id;
        swap_id=req.params.id;

        Swap.findById(swap_id)
            .then(async swap=> {
                if(swap.user_id1 != user_id || swap.user_id2 !=user_id){
                    res.status(403).send("No permission to delete swap");
                }
                else{
                    await swap.delete();
                    res.json(swap);
                }   
            })
            .catch(err => {
                res.status(500).json(`Error deleting swap`);
                console.log(`Error deleting swap ${err}`)
            })
    }
}