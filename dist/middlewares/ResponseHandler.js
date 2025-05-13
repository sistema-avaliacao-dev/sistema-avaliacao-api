"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseHandler = void 0;
const ResponseHandler = (res, status, message, response) => {
    if (status === 200) {
        res.status(status).json({ message, data: response || {} });
    }
    else {
        const errorResponse = response && typeof response === "object" ? response : {};
        res.status(status).json(Object.assign({ error: message }, errorResponse));
    }
};
exports.ResponseHandler = ResponseHandler;
//# sourceMappingURL=ResponseHandler.js.map