import React, { FC } from 'react';
import { Outlet } from 'react-router-dom';

export const Admin:FC = () => {
    return (
        <>
            <h1>Dashboard</h1>
            <Outlet />
        </>
    )
}
