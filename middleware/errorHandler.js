
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
