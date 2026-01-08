import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

/**
 * This component acts as a security guard for all protected admin routes.
 * It's a fundamental part of the admin panel's security.
 *
 * How it works:
 * 1. It checks for the existence of the 'admin_token' in the browser's local storage.
 * 2. If the token exists, it assumes the admin is logged in and renders the `<Outlet />`.
 *    The `<Outlet />` is a placeholder provided by react-router-dom that will be
 *    replaced with the actual component for the matched route (e.g., the AdminDashboardPage).
 * 3. If the token does NOT exist, it uses the `<Navigate />` component to
 *    forcefully redirect the user to the admin login page.
 */
const AdminRoute = () => {
    // Check if the admin-specific token is present in local storage.
    // The `!!` operator is a concise way to convert a value (like a token string or null)
    // into a true boolean (true if the token exists, false if it's null).
    const isAdminLoggedIn = !!localStorage.getItem('admin_token');

    // Return the appropriate component based on the login status.
    return isAdminLoggedIn ? <Outlet /> : <Navigate to="/admin/login" replace />;
};

export default AdminRoute;