const razorpay = require('../util/payments')
const User = require('../models/User');
const Order = require('../models/Order');


exports.premiumSubscription = (req, res) =>{
    try{
        razorpay.orders.create({
        amount : 5000,
        currency : 'INR'
        }, (err, order) =>{
            if(err){
                throw new Error(err);
            }
            const newOrder = new Order({
                order_id : order.id,
                status : 'PENDING',
                user: req.user._id
            })
            newOrder.save();
            return res.status(201).json({order, key_id : razorpay.key_id})
        })
    }catch(err){
        console.log(err);
        res.status(403).json({ message: 'Sometghing went wrong', error: err});
    }
}

exports.updateTransactionStatus = async (req, res ) => {
    try {
        const {payment_id, order_id, status} = req.body;
        const order  = await Order.findOne({order_id : order_id});
        const promise1 =  order.update({ payment_id: payment_id, status: status})
        if(req.body.status == 'SUCCESSFUL'){
            const promise2 = User.findByIdAndUpdate(req.user._id, {
                isPremium : true
            })
            Promise.all([promise1, promise2]).then(()=> {
                return res.status(202).json({sucess: true, message: "Transaction Successful"});
            }).catch((error ) => {
                throw new Error(error)
            })      
        }else{
            promise1.then(()=> {
                return res.status(202).json({sucess: true, message: "Transaction Unsuccessful"});
            }).catch((error ) => {
                throw new Error(error)
            })      
        }    
    } catch (err) {
        console.log(err);
        res.status(403).json({ errpr: err, message: 'Sometghing went wrong' });
    }
}