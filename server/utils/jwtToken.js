// Create and send token and save it cookie
const sendToken = (user, res) => {
    // Create JWT Token
    const token = user.getJwtToken();
    
    // Option for cookie
    const options = {
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000),
        httpOnly: true
    };

    // if (process.env.NODE_ENV.trim() === 'production') {
    //     options.secure = true;
    // }
   
    return res
        .status(200)
        .cookie('token', token, options)
        .json({
            error: null,
            message: null,
            httpStatus: 200,
            data: {
                token: token
            }
        })
}

module.exports = sendToken