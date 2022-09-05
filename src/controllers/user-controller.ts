import {user} from '../models/index-model';
import {Request,Response} from 'express';
import { sendResponse } from '../middleware/middleware';
import {sign} from 'jsonwebtoken';
import * as universalFunction from '../lib/universal-function';
import {error_messages,success_messages,boolean_messages} from '../messages/messages';
import { userI } from "../models/user-model";

async function loginUser(req:Request,res:Response):Promise<void>{
    try {
        const userDetails:user|null=await user.findOne({where:{email:req.body.email}});
        if(userDetails){
            const passwordMatching:boolean=await universalFunction.comparePassword(req.body.password,userDetails.password);
            
            if(passwordMatching){
                const jwtToken:string=sign({email:req.body.email,id:userDetails.id},"secretKeySatpreetBachhal",{expiresIn:'1d'});
            sendResponse(res,boolean_messages.true,200,{"msg":success_messages.LOGIN_SUCCESSFULLY,userDetails:userDetails,jwtToken:jwtToken});
            }else{
                sendResponse(res,boolean_messages.false,401,error_messages.INVALID_CREDENTIALS);
            }     
        }
        else{
            sendResponse(res,boolean_messages.false,402,error_messages.USER_NOT_FOUND);
            
        }
    } catch (error) {
        sendResponse(res,boolean_messages.false,500,error)
    }
}

async function registerUser(req:Request,res:Response):Promise<void>{
    try {
        req.body.password=await universalFunction.bryptPassword(req.body.password);
        const registerDetails:userI=await user.create(req.body);
        if(registerDetails){
            sendResponse(res,boolean_messages.true,200,success_messages.USER_REGISTERED_SUCCESSFULLY);    
        }
        else{
            sendResponse(res,boolean_messages.false,404,error_messages.SERVER_ERROR);    
        }
    } catch (error) {
        sendResponse(res,boolean_messages.false,404,error);
    }
}

async function updateUser(req:Request,res:Response):Promise<void>{
    try {
        const id:string|number=req.params.id;
        if(id==req.body.loggedUser.id){
        const registerDetails=await user.update(req.body,{where:{id:id}});
        if(registerDetails){
            const updatedDetails:user|null=await user.findOne({where:{id:id}});
            sendResponse(res,boolean_messages.true,200,{"msg":success_messages.USER_UPDATED_SUCCESSFULLY ,updatedDetails:updatedDetails})
        }
        else{
            sendResponse(res,boolean_messages.false,401,error_messages.SERVER_ERROR)
            
        }}
        else{
            sendResponse(res,boolean_messages.false,403,error_messages.UNAUTHORIZED_ACCESS);
        }
    } catch (error) {
        sendResponse(res,boolean_messages.false,500,error);
    }
}

async function deleteUser(req:Request,res:Response):Promise<void>{
    try {
        const id:string|number=req.params.id;
        const userDetails=await user.findOne({where:{id:id}});
        if(userDetails){
        if(id==req.body.loggedUser.id){
        const registerDetails=await user.destroy({where:{id:id}});
        if(registerDetails){
            sendResponse(res,boolean_messages.true,200,success_messages.USER_DELETED_SUCCESSFULLY)
        }
        else{
            sendResponse(res,boolean_messages.false,401,error_messages.SERVER_ERROR)
            
        }}
        else{
            sendResponse(res,boolean_messages.false,403,error_messages.INVALID_CREDENTIALS);
        }}
        else{
            sendResponse(res,boolean_messages.false,400,error_messages.USER_NOT_FOUND);
        }
    } catch (error) {
        sendResponse(res,boolean_messages.false,500,error);
    }
}

export {loginUser,registerUser,updateUser,deleteUser};