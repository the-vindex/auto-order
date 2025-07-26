import {Request, Response, NextFunction} from 'express';

declare global {
    namespace Express {
        interface Request {
            userId?: string;
        }
    }
}


export const fakeAuth = (req: Request, res: Response, next: NextFunction) => {
    const fakeUserId = req.headers['x-fake-user-id'];

    if (fakeUserId && typeof fakeUserId === 'string') {
        req.userId = fakeUserId;
    }

    next();
};
