// middleware/errorHandler.js
// This is our "global error catcher". Express automatically sends any
// error passed to next(error) here, AS LONG AS this middleware is
// registered LAST in server.js (after all routes).
//
// Without this, an unexpected crash (e.g. database connection drop)
// would either crash the whole server or leak an ugly raw stack trace
// to the client — both are bad for a production API.

const errorHandler = (err, req, res, next) => {
    // Log the full error on the SERVER side (for debugging by developers)
    console.error("🔥 Error:", err.stack || err.message);

    // Handle Mongoose validation errors with a clean 400 response
    if (err.name === "ValidationError") {
        const messages = Object.values(err.errors).map((e) => e.message);
        return res.status(400).json({
            success: false,
            message: messages.join(", ")
        });
    }

    // Everything else: send a clean, generic 500 response to the CLIENT
    // side. We never send err.stack to the client.
    res.status(500).json({
        success: false,
        message: "Internal Server Error"
    });
};

module.exports = errorHandler;
