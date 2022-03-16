import React, { FunctionComponent } from 'react';
import { useAtom } from 'jotai';
import { appNotifications } from './AppNotificationState';
import { Alert, Box, Snackbar } from '@mui/material';

interface AppNotificationProps {

}

export const AppNotification: FunctionComponent<AppNotificationProps> = ({}) => {
    const [notifications, setNotifications] = useAtom(appNotifications);

    const closeFactory = (id: number) => () => {
        setNotifications(notifications.filter((notification) => notification.id !== id));
    };

    return (
        <Snackbar
            open={Boolean(notifications.length)}
        >
            <div>
                {notifications.map((notification) => (
                    <Box marginY={2} key={notification.id}>
                        <Alert elevation={6} severity={notification.type} onClick={closeFactory(notification.id)}>
                            {notification.text}
                        </Alert>
                    </Box>
                ))}
            </div>
        </Snackbar>
    );
};
