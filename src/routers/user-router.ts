import { Router } from "express";
const router=Router();
import  {userController} from '../controllers/index-controller';
import * as middleware from '../middleware/middleware';

router.get('/',userController.loginUser);
router.post('/',middleware.userSchemaValidate,userController.registerUser);

router.use(middleware.verifyToken);
router.put('/:id',userController.updateUser);
router.delete('/:id',userController.deleteUser)

export {router};