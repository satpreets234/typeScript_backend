import {Sequelize} from 'sequelize';

const sequelize=new Sequelize('typescript_facebook','root','',{
    dialect:'mysql',host:'localhost'
})

 function connection(){
     try {
        sequelize.authenticate().then(success=>{
            console.log('connection established successfully');   
        })  
        } catch (error) {
            console.log(error);
            
        }
}


export {connection,sequelize};