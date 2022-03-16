import { atom, useSetAtom } from 'jotai';
import { getRandomId } from '../../common';
import { AlertColor } from '@mui/material/Alert/Alert';

interface Notification {
    text: string;
    type?: AlertColor;
    closeable?: boolean;
    timeoutInMs?: number;
    id: number;
}

export const appNotifications = atom<Array<Notification>>([]);

export const useAppNotifications = () => {
    const setNotifications = useSetAtom(appNotifications);

    return ({
        text,
        type = 'success',
        closeable = true,
        timeoutInMs = 8000,
    }: Omit<Notification, 'id'>) => {
        const id = getRandomId();

        setTimeout(() => {
            setNotifications((oldArr) => {
                return oldArr.filter((notification) => notification.id !== id);
            });
        }, timeoutInMs);

        setNotifications((oldArr) => {
            return [
                ...oldArr,
                {
                    text,
                    type,
                    closeable,
                    id,
                },
            ];
        });
    };
};
