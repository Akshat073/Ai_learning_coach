import { Router } from "express";
import { createContact } from "../controllers/contact.controller.js";

const contactRouter = Router();

contactRouter.post("/post-contact", createContact);

export default contactRouter;