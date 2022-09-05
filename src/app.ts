import express,{Application} from 'express';
import {logger} from './logger/logger';
const app:Application=express();
import {router} from './routers/index-router';
import {connection} from './connection/connection';
connection();
app.use(express.json());
app.use('/',router);
logger().info('anx')


app.listen(2001,()=>{
    logger().silly('Server listening at 2001');
    
})