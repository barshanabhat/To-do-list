// middleware/notFound.js
// if someone goes to a url that doesnt exist (like /api/banana)
// this runs and sends back json instead of that ugly html page
// express shows by default

const notFound = (req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`
    });
};

module.exports = notFound;
