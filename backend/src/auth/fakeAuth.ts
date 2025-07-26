import {Request, Response, NextFunction} from 'express';

export const fakeAuth = (req: Request, res: Response, next: NextFunction) => {
    const fakeUserId = req.headers['x-fake-user-id'];

    if (fakeUserId && typeof fakeUserId === 'string') {
        req.userId = fakeUserId;
    }

    next();
};
