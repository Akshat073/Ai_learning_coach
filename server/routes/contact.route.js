import { Router } from "express";
import { createContact,getAllMail,deleteMailById,replyMailById } from "../controllers/contact.controller.js";

const contactRouter = Router();

contactRouter.post("/post-contact", createContact);
contactRouter.get("/get-all-mail", getAllMail);
contactRouter.delete("/delete-mail", deleteMailById);
contactRouter.put("/reply-mail", replyMailById);

export default contactRouter;