function sendSuccess(res, data, status = 200) {
    res.status(status).json({status: "success", data});
}

export {sendSuccess};
