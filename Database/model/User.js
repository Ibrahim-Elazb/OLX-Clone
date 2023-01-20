// @ts-nocheck
const mongoose = require("mongoose");
const DBschema = mongoose.Schema;
const bcrypt=require("bcrypt");
const userSchema = new DBschema({
    firstName: {
        type: DBschema.Types.String,
        required: true
    },
    lastName: {
        type: DBschema.Types.String,
        required: true
    },
    email: {
        type: DBschema.Types.String,
        unique:true,
        required: true
    },
    password: {
        type: DBschema.Types.String,
        required: true
    },
    profilePicture: DBschema.Types.String,
    coverPictures: {
        type: DBschema.Types.Array,
        default:[]
    },
    qrCode: {
       type: DBschema.Types.String,
       default:""
    },
    confirmEmail: {
        type: DBschema.Types.Boolean,
        default: false
    },
    isBlocked: {
        type: DBschema.Types.Boolean,
        default: false
    },
    isDeleted: {
        type: DBschema.Types.Boolean,
        default: false
    },
    WishList:{
        type: [
            {
                _id: false, 
                type: DBschema.Types.ObjectId,
                ref: "Product",
            }
        ],
        default:[]
    },
    role: {
        type: DBschema.Types.String,
        default: "user"
    },
    resetPasswordCode:DBschema.Types.Number,
    pdfLink:DBschema.Types.String
}, {
    timestamps: true
});

userSchema.pre('save',async function(next){
    this.password=await bcrypt.hash(this.password,+process.env.HASH_SALT)
    next()
})

userSchema.pre('findOneAndUpdate',async function(next){
   const user=await this.model.findOne(this.getQuery()).select("__v")
   this.set({ __v: user.__v + 1 })
    next()
})


const userModel=mongoose.model("User",userSchema);
module.exports=userModel;