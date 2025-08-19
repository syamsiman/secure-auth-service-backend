import { ErrorResponse } from "../utils/custom-response/ErrorResponse.js";

export const errorHandlerMiddleware = (err, req, res, next) => {
  if (err instanceof ErrorResponse) {
    return res.status(err.statusCode).json({
      success: false,
      status: err.status,
      message: err.message
    })
  }

  // handle unexpected errors
  console.error(err);
  return res.status(500).json({ 
    success: false, 
    status: 'error', 
    message: 'Internal Server Error' });
};