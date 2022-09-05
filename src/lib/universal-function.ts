import  brypt from 'bcrypt';
async function bryptPassword(plainPassword:string):Promise<string> {
    const newPassword=await brypt.hash(plainPassword,10);
    return newPassword;
}

async function comparePassword(plainPassword:string,hashedPassword:string):Promise<boolean> {
    const matchingPassword=await brypt.compare(plainPassword,hashedPassword);
    if(matchingPassword){
        return true;
    }else{
        return false;
    }
}
export {bryptPassword,comparePassword};