const razorpay = require('../util/payments')
const User = require('../models/User');
const Order = require('../models/Order');


exports.premiumSubscription = (req, res) =>{
    try{
        razorpay.orders.create({
        amount : 5000,
        currency : 'INR'
        }, (err, order) =>{
            console.log('----------');
            console.log(razorpay.payment_id)
            console.log(order);
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
        res.status(403).json({ message: 'Sometghing went wrong', error: err});
    }
}

exports.updateTransactionStatus = async (req, res ) => {
    try {
        const { payment_id, order_id, status} = req.body;
        const order  = await Order.findOne({where : {order_id : order_id}})
        const promise1 =  order.update({ paymentid: payment_id, status: status})
        if(req.body.status == 'SUCCESSFUL'){
            const promise2 =  req.user.update({ isPremium: true })
            Promise.all([promise1, promise2]).then(()=> {
                return res.status(202).json({sucess: true, message: "Transaction Successful"});
            }).catch((error ) => {
                throw new Error(error)
            })      
        }else{
            promise1.then(()=> {
                return res.status(202).json({sucess: true, message: "Transaction Successful"});
            }).catch((error ) => {
                throw new Error(error)
            })      
        }    
    } catch (err) {
        console.log(err);
        res.status(403).json({ errpr: err, message: 'Sometghing went wrong' });
    }
}