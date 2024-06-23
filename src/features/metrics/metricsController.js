import Order from "../order/Order.js";
import User from "../user/User.js";
import {sendSuccess} from "../../utils/resposeSender.js";
import catchAsync from "../../utils/catchAsync.js";

const getMetrics = catchAsync(async (req, res) => {
    const metrics = await getMetricsData();
    sendSuccess(res, metrics, 200);
});

const getMetricsData = async () => {
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

    const [totalSales, totalOrders, avgOrderValue, topSellingProducts, newUsers, salesData, ordersData, orderValueData, newUsersData] = await Promise.all([
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
            {$match: {createdAt: {$gte: startOfMonth}}},
            {$count: "newUsers"}
        ]),
        Order.aggregate([
            {$match: {isPaid: true}},
            {
                $group: {
                    _id: {$dateToString: {format: "%Y-%m-%d", date: "$createdAt"}},
                    totalSales: {$sum: "$totalPrice"}
                }
            },
            {$sort: {_id: 1}},
            {$project: {date: "$_id", totalSales: 1, _id: 0}}
        ]),
        Order.aggregate([
            {$match: {isPaid: true}},
            {
                $group: {
                    _id: {$dateToString: {format: "%Y-%m-%d", date: "$createdAt"}},
                    totalOrders: {$count: {}}
                }
            },
            {$sort: {_id: 1}},
            {$project: {date: "$_id", totalOrders: 1, _id: 0}}
        ]),
        Order.aggregate([
            {$match: {isPaid: true}},
            {
                $group: {
                    _id: {$dateToString: {format: "%Y-%m-%d", date: "$createdAt"}},
                    avgOrderValue: {$avg: "$totalPrice"}
                }
            },
            {$sort: {_id: 1}},
            {$project: {date: "$_id", avgOrderValue: 1, _id: 0}}
        ]),
        User.aggregate([
            {$match: {createdAt: {$gte: startOfMonth}}},
            {
                $group: {
                    _id: {$dateToString: {format: "%Y-%m-%d", date: "$createdAt"}},
                    newUsers: {$count: {}}
                }
            },
            {$sort: {_id: 1}},
            {$project: {date: "$_id", newUsers: 1, _id: 0}}
        ]),
    ]);

    return {
        totalSales: totalSales[0]?.totalSales || 0,
        totalOrders: totalOrders[0]?.totalOrders || 0,
        avgOrderValue: avgOrderValue[0]?.avgOrderValue || 0,
        topSellingProducts: topSellingProducts || [],
        newUsers: newUsers[0]?.newUsers || 0,
        salesData: salesData || [],
        ordersData: ordersData || [],
        orderValueData: orderValueData || [],
        newUsersData: newUsersData || []
    };
};

export default {
    getMetrics
};
