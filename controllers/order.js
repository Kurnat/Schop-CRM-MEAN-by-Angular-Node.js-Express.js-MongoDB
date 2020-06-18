const Order = require('../models/Order');
const errorHendler = require('../utils/errorHendler');

// (get) localhost:5000?api/order?offset=2&limit=5
module.exports.getAll = async (req, res) => {
    const query = {
        user : req.user.id
    };

    // Date of start
    if (req.query.start) {
        query.date = {
            // greater than or equal to
            $gte: req.query.start
        }
    }

    // Date of end
    if (req.query.end) {
        if (!query.date) {
            query.date = {}
        }

        // less than or equal to
        query.date['$lte'] = req.query.end;
    }

    if (req.quert.order) {
        query.order = +req.query.order;
    }

    try{
        const orders = await Order
            .find(query)
            .sort({date: -1})
            .skip(+req.query.offset)
            .limit(+req.query.limit);

        res.status(200).json(orders);
    } catch (err) {
        errorHendler(res, err);
    }
};

module.exports.create = async (req, res) => {
    try{
        // Find all orders which made the user
        // and sort data from last to first by date and take first
        const lastOrder = await Order
            .findOne({user: req.user.id})
            .sort({date: -1});

        //  if lastOrder order not found maxOrder (count) will be 0;
        const maxOrder = lastOrder ? lastOrder.order : 0;

        // last order + 1 it's count of the order
        const order = await new Order({
            list: req.bodylist,
            user: req.user.id,
            order: maxOrder + 1
        }).save();
        res.status(201).json(order);
    } catch (err) {
        errorHendler(res, err);
    }
};