const razorpay = require('../util/payments')
const Order = require('../models/Order');


exports.premiumSubscription = (req, res) =>{
    try{
        razorpay.orders.create({
        amount : 50,
        currency : 'INR'
        }, (err, order) =>{
            if(err){
                throw new Error(err);
            }
            req.user.createOrder({
                order_id : order.id,
                status : 'PENDING'
            }).then(() => {
                return res.status(201).json({order, key_id : razorpay.key_id})
            }).catch(err => console.log(err));
        })
    }catch(err){
        console.log(err);
    }
}