import UserModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import sendEmail from "../config/sendEmail.js";
import verifyEmailTemplate from "../utils/verifyEmailTemplate.js";
import dotenv from "dotenv";
import generateAccessToken from "../utils/generateAccessToken.js";
import generateRefreshToken from "../utils/generateRefreshToken.js";
import uploadImageCloudnary from "../utils/uploadImageCloudnary.js";
import ContactModel from "../models/contact.model.js";

dotenv.config();




export const registerUserController = async (req, res) => {
    try {
        const { name, email, password,} = req.body;
        if(!name || !email || !password){
            return res.status(400).json({
                message: "All fields are required",
                success: false,
                error:true,
            });
        }
        const user = await UserModel.findOne({ email });
        if(user){
            return res.status(400).json({
                message: "User already exists",
                success: false,
                error:true,
            });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new UserModel({ name, email, password: hashedPassword });
        const savedUser = await newUser.save();
        
        const verifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${savedUser._id}`;
        
        const verifyEmail=await sendEmail({
            sendTo: email,
            subject: "Verify your email",
            html: verifyEmailTemplate({
                name,
                url:verifyEmailUrl
            }),
            
        });

        const accessToken = await generateAccessToken(savedUser._id);
        const refreshToken = await generateRefreshToken(savedUser._id);

        
        const cookieOptions = {
            httpOnly:true,
            secure:true,
            sameSite:"None",
        }

        res.cookie("accessToken",accessToken,cookieOptions)
        res.cookie("refreshToken",refreshToken,cookieOptions)


        return res.status(200).json({
            message: "User registered successfully",
            success: true,
            error:false,
            data:savedUser,
        });
        
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal server error",
            success: false,
            error:true,
        });
    }
}

export const verifyEmailController = async (req, res) => {
    try{
        const { code } = req.body;
        const user = await UserModel.findById(code);
        if(!user){
            return res.status(400).json({
                message: "User not found",
                success: false,
                error:true,
            });
        }
        user.verify_email = true;
        await user.save();
        return res.status(200).json({
            message: "Email verified successfully",
            success: true,
            error:false,
        });
    }catch(error){
        return res.status(500).json({
            message: error.message || "Internal server error",
            success: false,
            error:true,
        });
    }
}

export const loginUserController = async (req, res) => {
    try{
        const { email, password } = req.body;
        if(!email || !password){
            return res.status(400).json({
                message: "All fields are required",
                success: false,
                error:true,
            });
        }
        const user = await UserModel.findOne({ email });
        if(!user){
            return res.status(400).json({
                message: "User not found",
                success: false,
                error:true,
            });
        }

        if(user.status !== "active"){
            return res.status(400).json({
                message: "User is not active",
                success: false,
                error:true,
            });
        }


        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect){
            return res.status(400).json({
                message: "Invalid password",
                success: false,
                error:true,
            });
        }

        const accessToken = await generateAccessToken(user._id);
        const refreshToken = await generateRefreshToken(user._id);

        const updatedUser = await UserModel.findByIdAndUpdate(user._id,{last_login:new Date().toISOString()},{new:true});

        const cookieOptions = {
            httpOnly:true,
            secure:true,
            sameSite:"None",
        }

        res.cookie("accessToken",accessToken,cookieOptions)
        res.cookie("refreshToken",refreshToken,cookieOptions)

        return res.status(200).json({
            message: "User logged in successfully",
            success: true,
            error:false,
            data:{
                accessToken,
                refreshToken,
            }
        });

        

    }catch(error){
        return res.status(500).json({
            message: error.message || "Internal server error",
            success: false,
            error:true,
        });
    }
}


export const logoutUserController = async (req, res) => {
    try{
     const userId = req.userId; //from middleware
 
     const cookieOptions = {
         httpOnly:true,
         secure:true,
         sameSite:"None",
     }
     res.clearCookie("accessToken",cookieOptions);
     res.clearCookie("refreshToken",cookieOptions);
 
     await UserModel.updateOne({_id:userId},{refreshToken:null});
     return res.status(200).json({
         message: "User logged out successfully",
         success: true,
         error:false,
     });
 
    }catch(error){
     return res.status(500).json({
         message: error.message || "Internal server error",
         success: false,
         error:true,
     });
    }
 }
 
 export const uploadImageController = async (req, res) => {
     try{
         const image = req.file;
         const userId = req.userId;
         const uploadImage = await uploadImageCloudnary(image);
         await UserModel.updateOne({_id:userId},{avatar:uploadImage.secure_url});
         return res.status(200).json({
             message: "Image uploaded successfully",
             success: true,
             error:false,
             data:{
                 _id:userId,
                 avatar:uploadImage.secure_url,
             },
         });
 
     }catch(error){
         return res.status(500).json({
             message: error.message || "Internal server error",
             success: false,
             error:true,
         });
     }
 }
 
 export const updateUserDetailsController = async (req, res) => {
     try{
         const userId = req.userId;
         const { name, email, mobile, password } = req.body;
 
         let hashPassword="";
 
         if(password){
             const salt=await bcrypt.genSalt(10);
             hashPassword=await bcrypt.hash(password,salt);
         }
 
         await UserModel.updateOne(
             {_id:userId},
             {
                 ...(name && {name}),
                 ...(email && {email}),
                 ...(mobile && {mobile}),
                 ...(password && {password:hashPassword})
             }
         );
         return res.status(200).json({
             message: "User details updated successfully",
             success: true,
             error:false,
         });
 
     }catch(error){
         return res.status(500).json({
             message: error.message || "Internal server error",
             success: false,
             error:true,
         });
     }
 }
 
 
 export const forgotPasswordController = async (req, res) => {
     try{
         const { email } = req.body;
         const user = await UserModel.findOne({ email });
         if(!user){
             return res.status(400).json({
                 message: "User not found",
                 success: false,
                 error:true,
             });
         }
         const otp = generateOtp();
         const otpExpiry = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour
         await UserModel.updateOne({_id:user._id},{forgot_password_otp:otp,forgot_password_expiry:otpExpiry});
 
         await sendEmail({
             sendTo: email,
             subject: "Forgot password OTP",
             html: forgotPasswordTemplate({
                 name:user.name,
                 otp:otp,
             }),
         });
 
         return res.status(200).json({
             message: "OTP sent successfully to your email",
             success: true,
             error:false,
         });
     }catch(error){
         return res.status(500).json({
             message: error.message || "Internal server error",
             success: false,
             error:true,
         });
     }
 }
 
 export const verifyForgotPasswordController = async (req, res) => {
     try{
         const {email, otp } = req.body;
         if(!email || !otp){
             return res.status(400).json({
                 message: "All fields are required",
                 success: false,
                 error:true,
             });
         }
         const user = await UserModel.findOne({ email });
         if(!user){
             return res.status(400).json({
                 message: "User not found",
                 success: false,
                 error:true,
             });
         }
         if(user.forgot_password_otp !== otp ){
             return res.status(400).json({
                 message: "Invalid OTP",
                 success: false,
                 error:true,
             });
         }
         if(user.forgot_password_expiry < new Date().toISOString()){
             return res.status(400).json({
                 message: "OTP expired",
                 success: false,
                 error:true,
             });
         }
         await UserModel.updateOne({_id:user._id},{forgot_password_otp:null,forgot_password_expiry:null});
         return res.status(200).json({
             message: "OTP verified successfully",
             success: true,
             error:false,
         });
 
     }catch(error){
         return res.status(500).json({
             message: error.message || "Internal server error",
             success: false,
             error:true,
         });
     }
 }
 
 export const resetPasswordController = async (req, res) => {
     try{
         const { email, password ,confirmPassword } = req.body;
         if(!email || !password || !confirmPassword){
             return res.status(400).json({
                 message: "All fields are required",
                 success: false,
                 error:true, 
             });
         }
         if(password !== confirmPassword){
             return res.status(400).json({
                 message: "Password and confirm password do not match",
                 success: false,
                 error:true,
             });
         }
         const user = await UserModel.findOne({ email });
         if(!user){
             return res.status(400).json({
                 message: "User not found",
                 success: false,
                 error:true,
             });
         }
         const salt = await bcrypt.genSalt(10);
         const hashedPassword = await bcrypt.hash(password, salt);
         await UserModel.updateOne({_id:user._id},{password:hashedPassword});
         return res.status(200).json({
             message: "Password reset successfully",
             success: true,
             error:false,
         });
     }catch(error){
         return res.status(500).json({
             message: error.message || "Internal server error",
             success: false,
             error:true,
         });
     }
 }
 
 export const refreshTokenController = async (req, res) => {
     try{
         const refreshToken = req.cookies.refreshToken || req?.headers?.authorization?.split(" ")[1];
         if(!refreshToken){
             return res.status(400).json({
                 message: "Refresh token is required",
                 success: false,
                 error:true,
             });
         }
         const verifyRefreshToken = jwt.verify(refreshToken,process.env.SECRET_KEY_REFRESH_TOKEN);
         if(!verifyRefreshToken){
             return res.status(400).json({
                 message: "Invalid refresh token",
                 success: false,
                 error:true,
             });
         }
         const userId = verifyRefreshToken.id;
         const newAccessToken = await generateAccessToken(userId);

         res.cookie("accessToken",newAccessToken,{
             httpOnly:true,
             secure:true,
             sameSite:"None",
         });

         return res.status(200).json({
             message: "New Access token generated successfully",
             success: true,
             error:false,
             data:{
                 accessToken:newAccessToken,
             },
         });
     }catch(error){
         return res.status(500).json({
             message: error.message || "Internal server error",
             success: false,
             error:true,
         });
     }
 }
 
 export const getUserDetailsController = async (req, res) => {
     try{
         const userId = req.userId;
         const user = await UserModel.findById(userId).select("-password -refreshToken");
         return res.status(200).json({
         message: "User details fetched successfully",
         success: true,
         error:false,
         data:user,
         });
     }catch(error){
         return res.status(500).json({
             message: error.message || "Internal server error",
             success: false,
             error:true,
         });
     }
 }
 export const updateAnswerController = async (req, res) => {
    try{
        const userId = req.userId;
        const { correctAnswer, wrongAnswer } = req.body;
        const previousAnswers = await UserModel.findById(userId).select("correctAnswer wrongAnswer");
        const totalCorrectAnswer=previousAnswers.correctAnswer+correctAnswer;
        const totalWrongAnswer=previousAnswers.wrongAnswer+wrongAnswer;
        await UserModel.updateOne({_id:userId},{correctAnswer:totalCorrectAnswer,wrongAnswer:totalWrongAnswer});
        return res.status(200).json({
            message: "Correct answer updated successfully",
            success: true,
            error:false,
            data:{
                previousCorrectAnswer:previousAnswers.correctAnswer,
                newCorrectAnswer:totalCorrectAnswer,
                previousWrongAnswer:previousAnswers.wrongAnswer,
                newWrongAnswer:totalWrongAnswer,
            },
        });
    }catch(error){
        return res.status(500).json({
            message: error.message || "Internal server error",
            success: false,
            error:true,
        });
    }
 }
 export const getLeaderboardController = async (req, res) => {
    try{
        const users = await UserModel.find().sort({correctAnswer:-1}).select("name correctAnswer");
        return res.status(200).json({
            message: "Leaderboard fetched successfully",
            success: true,
            error: false,
            data:users,
        });
    }catch(error){
        return res.status(500).json({
            message: error.message || "Internal server error",
            success: false,
            error:true,
        });
    }
 }
 export const showProfileController = async (req, res) => {
    try {
        const userId = req.query.id; 
        const user = await UserModel.findById(userId).select("name correctAnswer wrongAnswer email avatar");
        if (!user) {
            return res.status(400).json({
                message: "User not found",
                success: false,
                error: true,
                userId: userId,
            });
        }
        return res.status(200).json({
            message: "User details fetched successfully",
            success: true,
            error: false,
            data: user,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal server error",
            success: false,
            error: true,
        });
    }
};


export const createContact = async (req, res) => {
    try {

        if (!req.body.name ||!req.body.email ||!req.body.subject ||!req.body.message) {
            return res.status(400).json({ 
                message: "All fields are required",
                success: false,
                error: true,
             });

        }
        const contact = new ContactModel(req.body);
        
        const data = await contact.save();
        res.status(201).json({
            message: "Contact created successfully",
            data: data,
            success: true,
            error: false,
            });
    } catch (error) {
        res.status(400).json({ 
            message: error.message ,
            success: false,
            error: true,
        });
    }
};



