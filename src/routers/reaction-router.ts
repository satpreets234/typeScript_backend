import { Router } from "express";
const router=Router();
import  {reactionController} from '../controllers/index-controller';
import * as middleware from '../middleware/middleware';

router.use(middleware.verifyToken);
router.get('/:postId',reactionController.getAllReactions);
router.post('/:postId',middleware.reactionSchemaValidate,reactionController.addReaction);
router.delete('/:reactionId',reactionController.deleteReaction);

export {router};