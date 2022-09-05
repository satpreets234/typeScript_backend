import {Request,Response,NextFunction} from 'express';
import {user} from '../models/user-model';
import {verify} from 'jsonwebtoken';
import {userSchema,postSchema,friendSchema,reactionSchema} from '../validations/validations'
import {statusCodes} from '../status-codes/status-codes';
import {error_messages,boolean_messages} from "../messages/messages";


async function verifyToken(req:Request,res:Response,next:NextFunction) {
    const bearerToken:string|undefined= req.header('Authorization');
    const token:string|undefined=bearerToken?.split(' ')[1];
    if(token){
        try {
        const verifyAuth:any= verify(token,'secretKeySatpreetBachhal');
        
        if(verifyAuth){
            const userDetails:object|null=await user.findOne({where:{email:verifyAuth.email}});
            req.body.loggedUser=userDetails;
            next();}
        else{
            sendResponse(res,boolean_messages.false,statusCodes.BAD_REQUEST,error_messages.UNAUTHORIZED_ACCESS)    
        }    
        } catch (error) {
            sendResponse(res,boolean_messages.false,statusCodes.BAD_REQUEST,error)    
        }}
    else{
    sendResponse(res,boolean_messages.false,statusCodes.BAD_REQUEST,error_messages.PLEASE_LOGIN);
} }

const sendResponse=(res:Response,success:number,statusCode:number,msg:string|object|unknown)=>{
    res.status(statusCode).json({success:success,msg:msg});
}

const userSchemaValidate=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const {error}= userSchema.validate(req.body);
        if(!error){
            next();
        }
        else{
            sendResponse(res,boolean_messages.false,statusCodes.BAD_REQUEST,error);
        }
    } catch (error) {
        sendResponse(res,boolean_messages.false,statusCodes.INTERNAL_SERVER_ERROR,error);
    }
}

const postSchemaValidate=async (req:Request,res:Response,next:NextFunction)=> {
    try {
        req.body.userId=req.body.loggedUser.id;
        req.body.loggedUser='';
        const  {error}= postSchema.validate(req.body);
        if(!error){
            next();
        }
        else{
            sendResponse(res,boolean_messages.false,statusCodes.BAD_REQUEST,error);
        }
    } catch (error) {
        sendResponse(res,boolean_messages.false,statusCodes.INTERNAL_SERVER_ERROR,error);
        
    }
}
   
const friendSchemaValidate=async (req:Request<{ friendId: string}>,res:Response,next:NextFunction)=> {
    try {
        const userId:number=req.body.loggedUser.id;
        const friendId:string=req.params.friendId;
        const  {error}=friendSchema.validate({userId:userId,friendId:friendId});
        if(!error){
            next()
        }else{
            sendResponse(res,boolean_messages.false,statusCodes.BAD_REQUEST,error);

        }
    } catch (error) {
        sendResponse(res,boolean_messages.false,statusCodes.INTERNAL_SERVER_ERROR,error);
    }
}

const reactionSchemaValidate=async (req:Request<{postId:string}>,res:Response,next:NextFunction)=> {
    try {
        const userId:number=req.body.loggedUser.id;
        const postId:string=req.params.postId;
        const parentId:number|null=req.body.parentId||null;
        const {reactionData,reactionType}=req.body
        const  {error}=reactionSchema.validate({userId:userId,postId:postId,reactionData:reactionData,
            reactionType:reactionType,parentId:parentId});
        if(!error){
            req.body.userId=userId;
            req.body.postId=postId;req.body.parentId=parentId;
            next()
        }else{
            sendResponse(res,boolean_messages.false,statusCodes.BAD_REQUEST,error);
        }
    } catch (error) {
        sendResponse(res,boolean_messages.false,statusCodes.INTERNAL_SERVER_ERROR,error);
    }
}

export{verifyToken,sendResponse,userSchemaValidate,postSchemaValidate,friendSchemaValidate,reactionSchemaValidate};