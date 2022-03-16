import React, { FunctionComponent, useMemo } from 'react';
import { useAuth } from '../../Store/auth';
import { useNavigate } from 'react-router-dom';
import { useAppNotifications } from '../../Components/AppNotification/AppNotificationState';
import { useFilter, useInsert, useSelect } from 'react-supabase';
import { useFormAlert } from '../../common';
import { NeedForm, NeedFormData } from '../../Components/NeedForm';
import { Need, NeedStatus } from '../../Domain/Need';
import { Profile as IProfile } from '../../Domain/Profile';

interface CreateNeedProps {

}

export const CreateNeed: FunctionComponent<CreateNeedProps> = ({}) => {
    const auth = useAuth();
    const navigate = useNavigate();
    const pushNotification = useAppNotifications();
    const [alert, setAlert] = useFormAlert();
    const [{ fetching }, insert] = useInsert<Need>('need');
    const profileFilter = useFilter((query) => {
        return query.eq('id', auth.user?.id);
    }, [auth.user?.id]);
    const [{ data: profilesArr }] = useSelect<IProfile>('profile', {
        filter: profileFilter
    });

    const needDefaultValues = useMemo<NeedFormData|null>(() => {
        if (!profilesArr)
            return null;

        const profile = profilesArr[0];

        return {
            status: NeedStatus.active,
            start_date: null,
            end_date: null,
            organizer_name: `${profile.name} ${profile.surname}`,
            organizer_phone: profile.phone ?? '',
            organizer_email: profile.email ?? ''
        }
    }, [profilesArr])

    const handleSubmit = async (place: NeedFormData) => {
        const fulfilledPlace: NeedFormData = {
            ...place,
            creator_id: auth.user!.id,
        };

        try {
            const {
                error,
            } = await insert(fulfilledPlace);

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
                text: `Dodano potrzebę o nazwie: ${place.name}`,
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

    if (!needDefaultValues)
        return <p>Loading...</p>

    return (
        <NeedForm
            onSubmit={handleSubmit}
            loading={fetching}
            alert={alert}
            data={needDefaultValues}
        />
    );
};
