import React, { FunctionComponent } from 'react';
import { useAuth } from '../Store/auth';
import { Navigate, useLocation } from 'react-router-dom';

interface RequireAuthProps {
    inverted?: boolean
}

export const RequireAuth: FunctionComponent<RequireAuthProps> = ({ children, inverted }) => {
    const auth = useAuth();
    const location = useLocation();

    if (inverted) {
        if (auth.isAuthenticated()) {
            return <Navigate to='/' state={{ from: location }} replace />;
        }
    }
    else {
        if (!auth.isAuthenticated()) {
            return <Navigate to='/login' state={{ from: location }} replace />;
        }
    }

    return <>{children}</>;
};
