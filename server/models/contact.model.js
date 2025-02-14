import { Schema, model } from "mongoose";

const contactSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
    },
    subject: {
        type: String,
        required: [true, "Subject is required"],
    },
    message: {
        type: String,
        required: [true, "Message is required"],
    },
    isReplyed: {
        type: Boolean,
        default: false,
    },
    reply:{
        type: String,
        default: null,
    }
}, {
    timestamps: true,
});

const ContactModel = model("Contact", contactSchema);

export default ContactModel;