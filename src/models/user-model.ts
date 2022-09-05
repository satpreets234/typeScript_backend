import Sequelize,{Model} from 'sequelize';
import {sequelize} from '../connection/connection';
import bcrypt from 'bcrypt';

import { post } from './post-model';
interface userI{
    id?:number;
    username:string;
    age:number;
    profession:string;
    email:string,
    password:string
}

class user extends Model implements userI{
    id?:number;
    username:string;
    age:number;
    profession:string;
    email:string;
    password:string
}

user.init({
    username:{type:Sequelize.STRING,allowNull:false},
    email:{type:Sequelize.STRING,allowNull:false,validate:{isEmail:true}},
    password:{type:Sequelize.STRING,allowNull:false,set(value:string){
        const newPassword=bcrypt.hashSync(value,10);
        this.setDataValue('password',newPassword)
    }},
    age:{type:Sequelize.INTEGER,allowNull:false,validate:{min:15,max:130}},
    profession:{type:Sequelize.STRING,allowNull:false}
},{sequelize,timestamps:false,hooks:{
    
}})

user.hasMany(post,{foreignKey:'userId'})
post.belongsTo(user,{foreignKey:'userId'});


export {user,userI};