import { Router } from "express";
import { registerUserController,createContact ,verifyEmailController,getUserDetailsController,loginUserController,logoutUserController,uploadImageController,updateUserDetailsController,forgotPasswordController,verifyForgotPasswordController ,resetPasswordController,refreshTokenController,updateAnswerController,getLeaderboardController,showProfileController} from "../controllers/user.controller.js";
import auth from "../middleware/auth.js";
import upload from "../middleware/multer.js";


const userRouter = Router();

userRouter.post("/register",registerUserController);
userRouter.post("/verify-email/:code",verifyEmailController);
userRouter.post("/login",loginUserController);
userRouter.get("/logout",auth,logoutUserController);
userRouter.put("/upload-avatar",auth,upload.single("avatar"),uploadImageController);
userRouter.put("/update-user",auth,updateUserDetailsController);
userRouter.put("/forgot-password",forgotPasswordController);
userRouter.put("/verify-forgot-password",verifyForgotPasswordController);
userRouter.put("/reset-password",resetPasswordController);
userRouter.post("/refresh-token",refreshTokenController);
userRouter.get("/get-user-details",auth,getUserDetailsController);
userRouter.put("/update-answers",auth,updateAnswerController);
userRouter.get("/leaderboard", getLeaderboardController);
userRouter.get("/show-profile",showProfileController);
userRouter.post("/post-contact",createContact);

export default userRouter;