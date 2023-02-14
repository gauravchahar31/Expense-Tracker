const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    order_id: {
        type: String,
        required: true
    },
    payment_id: {
        type: String,
    },
    status: {
        type: String,
        required: true
    },
    user :{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
});

const Order = new mongoose.model("Order", orderSchema)

module.exports = Order;