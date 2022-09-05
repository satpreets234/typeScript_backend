import winston,{format,createLogger} from "winston";
const {timestamp,combine,printf}=format


function logger() {
const myFormat=printf(({level,message,timestamp})=>{
    return `${timestamp} ${level} ${message}`
})
    return createLogger(
        {level:'silly',
        format:combine(winston.format.colorize(),timestamp(),myFormat),
            transports:[new winston.transports.Console()]}
    )
}


export {logger}