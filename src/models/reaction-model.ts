import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../connection/connection';
// import { user } from './user-model';

interface reaction1 {
    id?: number | null,
    userId: number, postId: number,
    reactionType: string,
    reactionData: string,
    parentId: number
}

class reaction extends Model implements reaction1{
    id: number|null;
    userId: number;
    postId:number;
    reactionType: string;
    reactionData: string;
    parentId: number
}
reaction.init({
    userId: {
        type: DataTypes.INTEGER,
        references: { model: 'users', key: 'id' }
    },
    postId: {
        type: DataTypes.INTEGER,
        references: { model: 'posts', key: 'id' }
    },
    reactionType: { type: DataTypes.ENUM('text', 'vote', 'emoji') },
    reactionData: {
        type: DataTypes.STRING,
        allowNull: false
    },
    parentId: {
        type: DataTypes.INTEGER,
        references: { model: "reactions", key: 'id' }
    }
}, { sequelize, timestamps: false });


export{reaction};