import React, { FunctionComponent, useMemo } from 'react';
import { useAuth } from '../../Store/auth';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppNotifications } from '../../Components/AppNotification/AppNotificationState';
import { useFilter, useInsert, useSelect, useUpdate } from 'react-supabase';
import { useFormAlert } from '../../common';
import { NeedForm, NeedFormData } from '../../Components/NeedForm';
import { Need } from '../../Domain/Need';
import dayjs from 'dayjs';

interface EditNeedProps {

}

export const EditNeed: FunctionComponent<EditNeedProps> = () => {
    const auth = useAuth();
    const params = useParams();
    const navigate = useNavigate();
    const pushNotification = useAppNotifications();
    const [alert, setAlert] = useFormAlert();
    const filter = useFilter((query) => {
        return query.eq('id', params.id);
    }, [params.id]);
    const [{ fetching }, update] = useUpdate<Need>('need', {
        filter
    });
    const [{ data, fetching: selectFetching }] = useSelect<Need>('need', {
        filter
    });

    const formattedNeed = useMemo<Need|null>(() => {
        if (!data)
            return null;

        const entity = data[0];

        return {
            ...entity,
            end_date: entity.end_date ? dayjs(entity.end_date).tz(dayjs.tz.guess()).format() : null,
            start_date: entity.start_date ? dayjs(entity.start_date).tz(dayjs.tz.guess()).format() : null,
        };
    }, [data]);

    const handleSubmit = async (need: NeedFormData) => {
        try {
            const needWithFixedDates: NeedFormData = {
                ...need,
                // @ts-ignore
                end_date: need.end_date ? dayjs(need.end_date?.replace('+00:00', '')).utc().format() : null,
                // @ts-ignore
                start_date: need.start_date ? dayjs(need.start_date?.replace('+00:00', '')).utc().format() : null,
                updated_at: dayjs().utc().format()
            };

            const {
                error,
            } = await update(needWithFixedDates);

            if (error) {
                setAlert({
                    title: 'Błąd',
                    type: 'error',
                    message: error.message,
                });
                return;
            }

            pushNotification({
                type: 'success',
                text: `Zaktualizowano potrzebę o nazwie: ${need.name}`,
            });
            navigate('/');
        } catch {
            setAlert({
                title: 'Błąd',
                type: 'error',
                message: 'Wystąpił nieznany błąd podczas przetwarzania żądania',
            });
        }
    };

    if (formattedNeed) {
        return (
            <NeedForm
                onSubmit={handleSubmit}
                loading={fetching}
                alert={alert}
                data={formattedNeed}
                editMode
            />
        );
    }

    return (
        <p>Loading...</p>
    );
};
