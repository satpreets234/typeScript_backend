import { Request, Response} from 'express';
import { sendResponse } from '../middleware/middleware';
import { user,post, friend } from '../models/index-model';
import {postI } from '../models/post-model';
import {error_messages,success_messages,boolean_messages  } from "../messages/messages";
import { statusCodes } from "../status-codes/status-codes";
import { Op } from 'sequelize';
import { logger } from '../logger/logger';



async function getPost(req: Request, res: Response):Promise<void> {
    try {
        const postId:string|number = req.params.postId;
        const postDetails: post|null = await post.findOne({ where: { id: postId }, include: { model: user, attributes: { exclude: ['password', 'age', 'id'] } } });
        if (postDetails) {
            sendResponse(res, boolean_messages.true,statusCodes.SUCCESS,postDetails);
        } else {
            sendResponse(res, boolean_messages.false,statusCodes.NOT_FOUND,error_messages.NOT_FOUND);
        }
    } catch (error) {
        sendResponse(res,boolean_messages.false,statusCodes.INTERNAL_SERVER_ERROR,error);
    }
}

// async function insertMany(req:Request,res:Response):Promise<void> {    
    
//     const array=req.body;
//     array.forEach((element:any) => {
//         element.userId=req.body.loggedUser.id;
//     });
//     const data=await post.bulkCreate(array);
//     if(data){
//         sendResponse(res,1,200,data);
//     }else{
//         sendResponse(res,0,400,"cannot insertMany");
//     }
// }

async function getAllPost(req: Request, res: Response):Promise<void> {
    try {
        const userId: number = req.body.loggedUser.id;
        const userAllPosts: Array<post> = await post.findAll<post>({
            where: { userId: userId }, include: {
                model: user, attributes: {
                    exclude: [
                        'password', 'id', 'age'
                    ]
                }
            }, attributes: { exclude: ['userId'] }
        });
        if (userAllPosts.length == 0) {
            sendResponse(res, boolean_messages.false,statusCodes.NOT_FOUND,error_messages.ADD_FIRST_POST);
        } else {
            sendResponse(res, boolean_messages.true,statusCodes.SUCCESS,userAllPosts);
        }
    } catch (error) {
        sendResponse(res,boolean_messages.false,statusCodes.INTERNAL_SERVER_ERROR,error)
    }
}

async function addPost(req: Request, res: Response):Promise<void> {
    try {
        const newPost:postI = await post.create(req.body);
        if (newPost) {
            sendResponse(res, boolean_messages.true,statusCodes.SUCCESS,newPost);
        } else {
            sendResponse(res, boolean_messages.false,statusCodes.BAD_REQUEST,error_messages.CANNOT_CREATE)
        }
    } catch (error) {
        sendResponse(res,boolean_messages.false,statusCodes.INTERNAL_SERVER_ERROR,error);
    }
}

async function deletePost(req: Request, res: Response):Promise<void> {
    try {
        const postId:number|string = req.params.postId;
        const findPost:post|null = await post.findOne({ where: { id: postId } });
        const userId: number = req.body.loggedUser.id;
        if (findPost) {
            if (findPost.userId == userId) {
                const deletePost = await post.destroy({ where: { id: postId } });
                if (deletePost) {
                    sendResponse(res, boolean_messages.true,statusCodes.SUCCESS,success_messages.DELETED_SUCCESSFULLY)
                } else {
                    sendResponse(res, boolean_messages.false,statusCodes.BAD_REQUEST,error_messages.CANNOT_DELETE)
                }
            } else {
                sendResponse(res,boolean_messages.false,statusCodes.BAD_REQUEST,error_messages.UNAUTHORIZED_ACCESS);
            }
        } else {
            sendResponse(res,boolean_messages.false,statusCodes.NOT_FOUND,error_messages.NOT_FOUND);
        }
    } catch (error) {
        sendResponse(res,boolean_messages.false,statusCodes.INTERNAL_SERVER_ERROR,error);
    }
}

async function updatePost(req: Request, res: Response):Promise<void> {
    try {
        const postId = req.params.postId;
        const findPost:postI|null = await post.findOne({ where: { id: postId } });
        const userId: number = req.body.loggedUser.id;
        if (findPost) {
            if (findPost.userId == userId) {
                const updatePost = await post.update(req.body, { where: { id: postId } });
                if (updatePost) {
                    const updatedPost = await post.findOne({ where: { id: postId } })
                    sendResponse(res, boolean_messages.true,statusCodes.SUCCESS,updatedPost);
                } else {
                    sendResponse(res, boolean_messages.false,statusCodes.BAD_REQUEST,error_messages.CANNOT_UPDATE)
                }
            } else {
                sendResponse(res,boolean_messages.false,statusCodes.BAD_REQUEST,error_messages.UNAUTHORIZED_ACCESS);
            }
        } else {
            sendResponse(res, boolean_messages.false,statusCodes.NOT_FOUND,error_messages.NOT_FOUND);
        }
    } catch (error) {
        sendResponse(res,boolean_messages.false,statusCodes.INTERNAL_SERVER_ERROR,error);
    }
}

async function getFriendPosts(req:Request,res:Response):Promise<void> {
    const friendId:number|string=req.params.friendId;
    const userId:number=req.body.loggedUser.id;
    const userExist:object|null=await user.findOne({where:{id:friendId}})
    if(userExist){
        const areFriend:object|null=await friend.findOne({where:{isAccepted:'1',
        [Op.or]:[{[Op.and]:[{userId:userId},{friendId:friendId}]},
                  {[Op.and]:[{userId:friendId,friendId:userId}]  }]
    }})  
    if(areFriend){
        const allPosts:Array<post>=await post.findAll<post>({where:{userId:friendId}});
        if(allPosts.length!=0){
            sendResponse(res,boolean_messages.true,statusCodes.SUCCESS,allPosts);
        }else{
            sendResponse(res,boolean_messages.false,statusCodes.NOT_FOUND,error_messages.NOT_FOUND);
        }
    } else{
        sendResponse(res,boolean_messages.false,statusCodes.FORBIDDEN,error_messages.UNAUTHORIZED_ACCESS);
    }
    }else{
        sendResponse(res,boolean_messages.false,statusCodes.BAD_REQUEST,error_messages.USER_NOT_FOUND);
    }  
}
export { getPost, getAllPost, addPost, deletePost,updatePost,getFriendPosts };