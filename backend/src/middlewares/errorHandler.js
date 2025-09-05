import { ErrorResponse } from "../utils/custom-response/ErrorResponse.js";

export const errorHandlerMiddleware = (err, req, res, next) => {
  if (err instanceof ErrorResponse) {
    return res.status(err.statusCode).json({
      status: "fail",
      status: err.status,
      message: err.message
    })
  }

  // handle unexpected errors
  console.error(err);
  res.status(500).json({ 
    status: "fail", 
    status: 'error', 
    message: 'Internal Server Error' 
  });
};