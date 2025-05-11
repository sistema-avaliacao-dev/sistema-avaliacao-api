import { Request, Response } from "express";

export const ResponseHandler = (res: Response, status: number, message: string, response?: object) => {
    if (status === 200) {
        res.status(status).json({ message, data: response || {} });
    } else {
        const errorResponse = response && typeof response === "object" ? response : {};
        res.status(status).json({
            error: message,
            ...errorResponse,
        });
    }
};
