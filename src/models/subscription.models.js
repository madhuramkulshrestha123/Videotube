import mongoose, { Schema, mongo } from "mongoose";

const subscriptionSchema = new Schema({
    subscriber:{        //who is subscribing
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    channel:{
        type:Schema.Types.ObjectId, // whom subscriber is subscribing
        ref:"User"
    }
})

export const Subscription = mongoose.model("Subscription", subscriptionSchema);