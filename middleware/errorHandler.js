// middleware/errorHandler.js
// this catches errors sent with next(error) from the controllers
// needs 4 params so express knows its an error handler

const errorHandler = (err, req, res, next) => {
    // print the error so i can see it in the terminal
    console.error("🔥 Error:", err.stack || err.message);

    // mongoose validation errors get a 400 instead of 500
    if (err.name === "ValidationError") {
        const messages = Object.values(err.errors).map((e) => e.message);
        return res.status(400).json({
            success: false,
            message: messages.join(", ")
        });
    }

    // anything else just send a generic 500 message
    // not sending err.stack to the client
    res.status(500).json({
        success: false,
        message: "Internal Server Error"
    });
};

module.exports = errorHandler;
