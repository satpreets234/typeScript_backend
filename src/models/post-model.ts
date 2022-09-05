import {DataTypes,Model} from 'sequelize';
import {sequelize} from '../connection/connection';
import { reaction } from './reaction-model';

interface postI{
    id?:number|null,
    userId:number,
    imagePath:string,
    imageDescription:string
}

class post extends Model implements postI{
    id:number;
    userId:number;
    imagePath:string;
    imageDescription:string;
}

post.init({
    userId:{
        type:DataTypes.INTEGER,
        references:{model:'users',key:'id'},
    },
    imagePath:{
        type:DataTypes.STRING,
        allowNull:true,defaultValue:null
    },imageDescription:{
        type:DataTypes.STRING,
        allowNull:true,defaultValue:null
    }
},{sequelize,timestamps:false});

post.hasMany(reaction,{foreignKey:'postId'});
reaction.belongsTo(post,{foreignKey:'postId'});
// post.sync().then(success=>{
//     console.log(success);
// }).catch(err=>{
//     console.log(err);
// });

export {post,postI};