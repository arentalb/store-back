function sendSuccess(res, data, status = 200) {
  res.status(status).json({ status: "success", data });
}

function sendFailure(res, message, status = 400) {
  res.status(status).json({ status: "fail", message });
}

function sendError(res, message, code = 500, error = null) {
  const response = { status: "error", message };
  if (error) response.data = error;
  res.status(code).json(response);
}

// sendSuccess(res, data, 201);
// sendFailure(res, { message: "provide all inputs " }, 401);
// sendError(res, "Could not get the user form database ", 500);
export { sendSuccess, sendFailure, sendError };
