/**
 * This middleware should be used AFTER the 'isAuthenticated' middleware.
 * It checks if the authenticated user has the 'Admin' role.
 * If not, it blocks the request with a 403 Forbidden error.
 */
exports.isAdmin = (req, res, next) => {
    // We assume that the 'isAuthenticated' middleware has already run
    // and successfully attached the user's data (including their role) to the 'req' object.
s
    // Check if the user object exists and if their role is 'Admin'
    if (req.user && req.user.role === 'Admin') {
        // If they are an admin, allow the request to proceed to the next step (the controller).
        next(); 
    } else {
        // If they are not an admin, immediately stop and send an error response.
        return res.status(403).json({ 
            success: false,
            message: "Access Denied. You do not have the required admin privileges."
        });
    }
};