import React, { FunctionComponent } from 'react';
import { useAuth } from '../Store/auth';
import { Navigate, useLocation } from 'react-router-dom';

interface RequireProfileFulfillProps {

}

export const RequireProfileFulfill: FunctionComponent<RequireProfileFulfillProps> = ({ children }) => {
    const auth = useAuth();
    const location = useLocation();

    if (auth.isAuthenticated() && !auth.isFulfilled() && location.pathname !== '/profile/create') {
        return <Navigate to='/profile/create' state={{ from: location }} replace />;
    }
    else if (auth.isAuthenticated() && auth.isFulfilled() && location.pathname === '/profile/create') {
        return <Navigate to='/' state={{ from: location }} replace />;
    }

    return <>{children}</>;
};
