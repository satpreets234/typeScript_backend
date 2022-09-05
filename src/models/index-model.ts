import {friend} from './friend-model';
import {user} from './user-model';
import {reaction} from './reaction-model';
import {post} from './post-model';


const array=[user,post,friend,reaction];
function tableSync(){
array.forEach((tableName)=>{
    tableName.sync({alter:true}).then((success:any)=>{
        console.log(success);
    }).catch((error:any)=>{
        console.log(error);
        
    })
})
}


export {friend,user,reaction,post,tableSync};