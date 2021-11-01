const mongoose=require("mongoose")
 const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

var studentSchema = new mongoose.Schema({
    name: {
        type: String,required:{true:"This field is required"}},

	email: {
        type: String,unique: true,required:{true:"This Email field is required"},uniqueCaseInsensitive: true},

	password: 
    {type: String},
    confirmpassword: {type: String},

	phone: 
        {type: Number},
    tokens: 
        [{token:{type: String}
}],
// password:
// {timestamps:true}

});
studentSchema.set('validateBeforeSave', false);
studentSchema.path('email').validate(()=>{
    return false
},'Email Already exists')

studentSchema.methods.ganerateAuthToken = async function(){
        try{
            console.log(this._id)
                const token=jwt.sign({_id:this._id.toString()},process.env.SECRET_KEY);
                this.tokens =this.tokens.concat({token:token})
                await this.save();
                return token;
        }   
        catch(error){
            console.log();(`the error part      ${error}`)
        } 
    }
studentSchema.pre("save",async function(next){
    if(this.isModified("password")){
        this.password=await bcrypt.hash(this.password, 10);
        this.confirmpassword=await bcrypt.hash(this.password, 10);
    }
    next();
})
module.exports = mongoose.model("students",studentSchema);