import Container from "@mui/material/Container";
import React, { FunctionComponent } from "react";
import { Outlet } from 'react-router-dom';
import { Layout } from './Layout';

interface RouteLayoutProps {
    center?: boolean
}

export const RouteLayout:FunctionComponent<RouteLayoutProps> = ({ center }) => {

    return (
        <Layout center={center}>
            <Outlet />
        </Layout>
    );
};
