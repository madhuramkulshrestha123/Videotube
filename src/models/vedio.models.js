import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const videoSchema = new Schema(
{
    videofile:{
        type:String, //cloudinary
        required: true
    },
    title:{
        type:String, 
        required: true
    },
    description: {
        type:String, 
        required: true
    },
    duration: {
        type:String, //cloudinary
        required: true
    },
    view: {
        type:Number,
        default:0
    },
    isPublished:{
        type:Boolean,
        default:true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref:"User"
    } 
},
{timestamps:true});

videoSchema
export const Video = mongoose.model("Video",videoSchema)