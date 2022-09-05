import {Router } from "express";
const router=Router();
import {postController} from '../controllers/index-controller';
import * as middleware from '../middleware/middleware';

router.use(middleware.verifyToken);
router.get('/:postId',postController.getPost);
// router.post('/many',postController.insertMany);
router.get('/',postController.getAllPost);
router.post('/',middleware.postSchemaValidate,postController.addPost);
router.delete('/:postId',postController.deletePost);
router.put('/:postId',postController.updatePost);
router.get('/friendpost/:friendId',postController.getFriendPosts)

export{router};

