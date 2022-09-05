import { Request, Response } from 'express';
import { sendResponse } from '../middleware/middleware';
import { post,friend,user } from '../models/index-model';

async function getFriendDetails(req: Request, res: Response):Promise<void> {
    const friendId: number | string = req.params.friendId;
    const friendDetails = await user.findOne({ where: { id: friendId }, include: { model: post }, attributes: { exclude: ['password', 'profession'] } })
    if (friendDetails) {
        sendResponse(res, 1, 200, friendDetails);
    } else {
        sendResponse(res, 0, 404, "User Not Found");
    }
}

// async function addFriend(req: Request<{friendId:number}>, res: Response):Promise<void> {
//     try {
//         const friendId: number = req.params.friendId;
//         const userId: number = req.body.loggedUser.id;
//         const isAccepted = '0';
//         const incomingRequest = await friend.findOne({ where: { userId: friendId, friendId: userId } });
//         const outgoingRequest = await friend.findOne({ where: { userId: userId, friendId: friendId } });
//         if (friendId != userId) {
//             if (incomingRequest) {
//                 sendResponse(res, 1, 200, "Already In Your Pending Friend Requests");
//             } else if (outgoingRequest) {
//                 sendResponse(res, 1, 200, "Already Sent Friend Request");
//             } else {
//                 const friendRequest = await friend.create({ userId: userId, friendId: friendId, isAccepted: isAccepted });
//                 if (friendRequest) {
//                     sendResponse(res, 1, 200, 'Friend Request Successfully')
//                 } else {
//                     sendResponse(res, 0, 400, "Friend Request Not Sent");
//                 }
//             }
//         } else {
//             sendResponse(res, 0, 403, "Not Possible");
//         }
//     } catch (error) {
//         sendResponse(res, 0, 500, error);
//     }
// }

async function cancelFriendRequest(req: Request, res: Response):Promise<void> {
    try {
        const friendId:number|string=req.params.friendId;
        const userId:number|string=req.body.loggedUser.id;
      if(friendId!=userId){
        const comingFriendRequest=await friend.destroy({where:{userId:friendId,friendId:userId}});
        const sentFriendRequest=await friend.destroy({where:{userId:userId,friendId: friendId}});
        if(sentFriendRequest){
            sendResponse(res,1,200,"Request Cancelled From Sender Side")
        }else if(comingFriendRequest){
            sendResponse(res,1,200,"Request Cancelled From Reciver Side")
        }else{
            sendResponse(res,0,404,"Cannot Found")
        }
        // const deleteFriend=await friend.destroy({where:{userId:friendId,friendId:userId}})
      }else{
            sendResponse(res,0,403,"Not Possible")
      }
    } catch (error) {
            sendResponse(res,0,503,error);
    }  
}
async function acceptFriendRequest(req: Request, res: Response):Promise<void> {
    try {
        const userId:number|string=req.body.loggedUser.id;
        const friendId:string=req.params.friendId;
        if(friendId!=userId){
        const friendRequest=await friend.findOne({where:{userId:friendId,friendId:userId}});
        if(friendRequest){
        const friendRequestAccept=await friend.update({isAccepted:'1'},{where:{userId:friendId,friendId:userId}});
        if(friendRequestAccept){
            sendResponse(res,1,200,"Friend Request Accepted");
        }else{
            sendResponse(res,0,404,"Cannot Sent Friend Request");
        }
        }else{
            sendResponse(res,0,400,"No Pending Request Of This Person");
        }
        }else{
            sendResponse(res,0,403,"Not Possible");
        }        
    } catch (error) {
        sendResponse(res,0,500,error);
    }
}

async function allSentRequests(req: Request, res: Response):Promise<void> {
    try {
        const userId:number=req.body.loggedUser.id;
        const allRequests=await friend.findAll({where:{userId:userId,isAccepted:'0'},include:{model:user,attributes:{exclude:['password','id']}}});
        console.log(allRequests);
        
    } catch (error) {
        sendResponse(res,0,500,error);
    }
}
export { getFriendDetails ,cancelFriendRequest,acceptFriendRequest,allSentRequests};