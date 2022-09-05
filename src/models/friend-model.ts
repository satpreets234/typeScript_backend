import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../connection/connection';
import { user } from './user-model';

interface friend1 {
    id?: number | null;
    userId: number;
    friendId: number;
    isAccepted: string
}

class friend extends Model implements friend1{
    userId: number;
    friendId: number;
    isAccepted: string
}

friend.init({
    userId: {
        type: DataTypes.INTEGER,
        references: { model: "users", key: 'id' }
    },
    friendId: {
        type: DataTypes.INTEGER,
        references: { model: "users", key: 'id' }
    },
    isAccepted: {
        type: DataTypes.ENUM('0', '1'),
        defaultValue: '0'
    }
}, { sequelize, timestamps: false });

friend.belongsTo(user,{foreignKey:'userId'});
friend.belongsTo(user,{foreignKey:'friendId'});
user.hasMany(friend,{foreignKey:'userId'});
user.hasMany(friend,{foreignKey:'friendId'});


export{friend};