const moment = require('moment');
const Order = require('../models/Order');
const errorHendler = require('../utils/errorHendler');


module.exports.overview = async (req, res) => {
    try {
        const allOrders = await Order.find({
            user: req.user.id
        }).sort({
            date: 1
        });
        const ordersMap = getOrdersMap(allOrders);
        const yesterdaysOrders = ordersMap[moment().add(-1, 'd').format('MM.DD.YYYY')] || [];

        // sum of all orders 
        const totalOrdersNumber = allOrders.length;

        // sum of all days
        const daysNumber = Object.keys(ordersMap).length;

        // orders per one day
        const ordersPerDay = (totalOrdersNumber / daysNumber).toFixed(0);

        // number of orders for yesterday
        const yesterdaysOrdersNumber = yesterdaysOrders.length;

        // percentage of the number of orders
        // ((yesterday's orders /  number of orders per day) - 1) * 100
        const ordersPercent = (((yesterdaysOrdersNumber / ordersPerDay) - 1) * 100).toFixed(2);

        // total Gain
        const totalGain = calculatePrice(allOrders);

        // gain per day
        const gainPerDay = totalGain / daysNumber;

        // gain per yesterday
        const yesterdayGain = calculatePrice(yesterdaysOrders);

        // gain percent
        const gainPercent = (((yesterdayGain / gainPerDay) - 1) * 100).toFixed(2);

        // comparison of gain
        const compareGain = (yesterdayGain - gainPerDay).toFixed(2);

        // comparison of numbers of orders
        const compareNumber = (yesterdaysOrdersNumber - ordersPerDay).toFixed(2);


        

        // console.log(ordersMap);
        
        // console.log(`${moment().add(-1, 'd').format('MM.DD.YYYY')}`);

        // console.log('resultoooo: =>',yesterdaysOrdersNumber , ordersPerDay);
        
        // console.log( 'gain: ', {
        //     percent: Math.abs(+gainPercent),
        //     campare: Math.abs(+compareGain),
        //     yesterday: +yesterdayGain,
        //     isHigher: +gainPercent > 0
        // },
        // "orders: ", {
        //     percent: Math.abs(+ordersPercent),
        //     campare: Math.abs(+compareNumber),
        //     yesterday: +yesterdaysOrdersNumber,
        //     isHigher: +ordersPercent > 0
        // });
        

        res.status(200).json({
            gain: {
                percent: Math.abs(+gainPercent),
                campare: Math.abs(+compareGain),
                yesterday: +yesterdayGain,
                isHigher: +gainPercent > 0
            },
            orders: {
                percent: Math.abs(+ordersPercent),
                campare: Math.abs(+compareNumber),
                yesterday: +yesterdaysOrdersNumber,
                isHigher: +ordersPercent > 0
            }
        })

    } catch (err) {
        errorHendler(res, err);
    }
}

module.exports.analytics = async (req, res) => {
console.log('constroller ++');

    try {
        const allOrders = await Order.find({
            user: req.user.id
        }).sort({
            date: 1
        });
        const ordersMap = getOrdersMap(allOrders);

        const average = +(calculatePrice(allOrders) / Object.keys(ordersMap).length).toFixed(2);

        const chart = Object.keys(ordersMap).map(label => {
            // label == 05.06.2020
            const order = ordersMap[label].length
            const gain = calculatePrice(ordersMap[label])
            return { label, order, gain };
        });
        
        res.status(200).json({ average, chart });
    } catch (err) {
        errorHendler(res, err);
    }
}


// functions helpers

function getOrdersMap(orders = []) {
    const daysOrder = {};
    console.log(orders);
    
    orders.forEach(order => {
        const date = moment(order.date).format('MM.DD.YYYY');

        if (date === moment().format('MM.DD.YYYY')) {
            return;
        }

        if (!daysOrder[date]) {
            daysOrder[date] = [];
        }

        daysOrder[date].push(order);
    });
    // console.log(daysOrder);
    
    return daysOrder;
}

function calculatePrice(orders = []) {
    return orders.reduce((total, order) => {
        const orderPrice = order.list.reduce((orderTotal, item) => {
            return orderTotal += item.cost * item.quantity;
        }, 0);
        return total += orderPrice;
    }, 0);
}