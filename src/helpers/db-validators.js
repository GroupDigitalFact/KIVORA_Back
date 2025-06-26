import User from "../user/user.model.js"

export const emailExist = async(email = "") =>{
    const existe = await User.findOne({email})
    if(existe){
        throw new Error(`The email ${email} is already registered`)
    }
}
 
export const usernameExist = async (username = "") => {
    const existe = await User.findOne({username})
    if(existe){
        throw new Error(`The user ${username} is already registered`)
    }
}