const Swap = require('../models/swap');
const User = require('../models/user');

exports.swapDbcontroller = {
    getSwaps(req, res) {
        let filter = {};
        if ('swap_date' in req.query)
            filter.swap_date = req.query.swap_date;
        if ('swap_status' in req.query)
            filter.swap_status = req.query.swap_status;
        Swap.find({ $and: [{ $or: [{ user_id1: req.user_id1 }, { user_id2: req.user_id }] }, filter] })
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
        swap.user_id1= req.user_id;
        const newSwap= new Swap(swap);
        const isBookId1 = User.findById(user_id1).then(user => {
            if (swap.book_id1 in user.books)
                return true;
            else
                return false;
        })

        const isBookId2 = User.findById(swap.user_id2).then(user => {
            if (swap.book_id2 in user.books)
                return true;
            else
                return false;
        })
        
        Promise.all([isBookId1, isBookId2])
        .then(arr => {
            if (arr[0] && arr[1])
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
        user_id = req.user_id;
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
        user_id = req.user_id;
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