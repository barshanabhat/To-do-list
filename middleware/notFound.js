// middleware/notFound.js
// Catches any request to a URL that doesn't match any of our routes
// (e.g. GET /api/banana) and returns a clean 404 instead of Express's
// default plain-text HTML error page.

const notFound = (req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`
    });
};

module.exports = notFound;
