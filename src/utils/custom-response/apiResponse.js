export class ApiResponse extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : `${statusCode}`.startsWith('2') ? 'success' : 'error';

        Error.captureStackTrace(this, this.constructor);
    }
}