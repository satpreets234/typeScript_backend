import { Router } from "express";
const router=Router();
import * as userRouter from './user-router';
import * as postRouter from './post-router';
import * as friendRouter from './friend-router';
import * as reactionRouter from './reaction-router';

router.use('/user',userRouter.router);
router.use('/post',postRouter.router);
router.use('/friend',friendRouter.router);
router.use('/reaction',reactionRouter.router);


export {router};