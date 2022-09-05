import {Router} from 'express';
const router=Router();
import {friendController} from '../controllers/index-controller';
import * as middleware from '../middleware/middleware'

router.use(middleware.verifyToken);
router.get('/id/:friendId',friendController.getFriendDetails);
// router.post('/:friendId',middleware.friendSchemaValidate,friendController.addFriend);
router.delete('/:friendId',friendController.cancelFriendRequest);
router.put('/:friendId',friendController.acceptFriendRequest);
router.get('/sentrequests',friendController.allSentRequests);
export{router};