"use strict";
// route to      => api/v1/test
exports.setup = (req, res, next) => {
    return res.status(200).json({
        success: true,
        message: "working !"
    });
};
