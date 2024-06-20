import {sendSuccess} from "../../utils/resposeSender.js";
import catchAsync from "../../utils/catchAsync.js";
import Order from "../order/Order.js";
import User from "../user/User.js";

// Get metrics data
const getMetrics = catchAsync(async (req, res) => {
    const metrics = await getMetricsData();
    sendSuccess(res, metrics, 200);
});

const getMetricsData = async () => {
    const [totalSales, totalOrders, avgOrderValue, topSellingProducts, newUsers] = await Promise.all([
        Order.aggregate([
            {$match: {isPaid: true}},
            {$group: {_id: null, totalSales: {$sum: "$totalPrice"}}},
            {$project: {_id: 0, totalSales: 1}}
        ]),
        Order.aggregate([
            {$match: {isPaid: true}},
            {$count: "totalOrders"}
        ]),
        Order.aggregate([
            {$match: {isPaid: true}},
            {$group: {_id: null, avgOrderValue: {$avg: "$totalPrice"}}},
            {$project: {_id: 0, avgOrderValue: 1}}
        ]),
        Order.aggregate([
            {$unwind: "$items"},
            {$group: {_id: "$items.product", totalSold: {$sum: "$items.quantity"}}},
            {$sort: {totalSold: -1}},
            {$limit: 5},
            {$lookup: {from: "products", localField: "_id", foreignField: "_id", as: "product"}},
            {$unwind: "$product"},
            {$project: {_id: 0, productId: "$_id", name: "$product.name", totalSold: 1}}
        ]),
        User.aggregate([
            {$match: {createdAt: {$gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)}}},
            {$count: "newUsers"}
        ])
    ]);

    return {
        totalSales: totalSales[0]?.totalSales || 0,
        totalOrders: totalOrders[0]?.totalOrders || 0,
        avgOrderValue: avgOrderValue[0]?.avgOrderValue || 0,
        topSellingProducts: topSellingProducts || [],
        newUsers: newUsers[0]?.newUsers || 0
    };
};

export default {
    getMetrics
};
