import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    // Check agar local storage me token hai
    const token = localStorage.getItem('access_token');
    
    // Agar token nahi hai, toh login par redirect karo
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    
    // Agar token hai, toh jo component manga gaya tha wo dikhao (children)
    return children;
};

export default ProtectedRoute;
