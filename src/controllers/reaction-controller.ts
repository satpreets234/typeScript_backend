import { Request, Response } from 'express';
import { sendResponse } from '../middleware/middleware';
import { reaction,post } from '../models/index-model';
import {statusCodes} from "../status-codes/status-codes";
import {error_messages,success_messages,boolean_messages} from '../messages/messages';


async function getAllReactions(req: Request,res:Response):Promise<void> {
    const postId:string|number=req.params.postId;
    const allReactions:Array<reaction> = await reaction.findAll<reaction>({ where: { postId: postId } });
    if (allReactions.length==0){
        sendResponse(res,boolean_messages.false,statusCodes.NOT_FOUND,error_messages.NOT_FOUND);
    }else{
        sendResponse(res,boolean_messages.true,statusCodes.SUCCESS,allReactions);
    }
}

async function addReaction(req: Request, res: Response):Promise<void> {
    const newReaction = await reaction.create(req.body);
    if (newReaction) {
        sendResponse(res, boolean_messages.true,statusCodes.SUCCESS,newReaction);
    } else {
        sendResponse(res,boolean_messages.false,statusCodes.BAD_REQUEST,error_messages.CANNOT_CREATE);
    }
}

async function deleteReaction(req: Request, res: Response):Promise<void> {
    const reactionId = req.params.reactionId;
    const userId: number = req.body.loggedUser.id;
    const reactionData:any = await reaction.findOne({ where: { id: reactionId } });
    if(reactionData){
        const postId=reactionData.postId;
        const userPost=await post.findOne({where:{id:postId}});
        if(reactionData.userId==userId || userPost?.userId==userId ){
            const deleteReaction=await reaction.destroy({where:{id:reactionId}});
            if(deleteReaction){
                sendResponse(res, boolean_messages.true,statusCodes.SUCCESS,success_messages.DELETED_SUCCESSFULLY)}
            else {
                sendResponse(res, boolean_messages.false,statusCodes.BAD_REQUEST,error_messages.CANNOT_DELETE)}
        }
    else{
        sendResponse(res,boolean_messages.false,statusCodes.BAD_REQUEST,error_messages.UNAUTHORIZED_ACCESS)}
    }   
     else {
        sendResponse(res,boolean_messages.false,statusCodes.NOT_FOUND,error_messages.NOT_FOUND)
    }
}

export { getAllReactions, addReaction, deleteReaction };