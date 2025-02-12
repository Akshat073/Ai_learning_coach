export const baseUrl = import.meta.env.VITE_API_URL;

const SummeryApi = {
    register: {
        url: 'api/user/register',
        method: 'POST',
    },
    login: {
        url: 'api/user/login',
        method: 'POST',
    }, 
    forgotPassword: {
        url: 'api/user/forgot-password',
        method: 'PUT',
    },
    verifyOtp: {
        url: 'api/user/verify-forgot-password',
        method: 'PUT',
    },
    resetPassword: {
        url: 'api/user/reset-password',
        method: 'PUT',
    },
    refreshToken: {
        url: 'api/user/refresh-token',
        method: 'POST',
    },
    getUserDetails: {
        url: 'api/user/get-user-details',
        method: 'GET',
    },
    updateAnswer: {
        url: 'api/user/update-answers',
        method: 'PUT',
    },
    logout: {
        url: 'api/user/logout',
        method: 'GET',
    },
    uploadAvatar: {
        url: 'api/user/upload-avatar',
        method: 'PUT',
    },
    updateUserDetails: {
        url: 'api/user/update-user',
        method: 'PUT',
    },
    leaderboard: {
        url: 'api/user/leaderboard',
        method: 'GET',
    },
    showProfile: {
        url: 'api/user/show-profile',
        method: 'GET',
    },
}

export default SummeryApi