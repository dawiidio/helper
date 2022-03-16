import React, { FunctionComponent, useMemo } from 'react';
import { ProfileForm, ProfileFormData } from '../../Components/ProfileForm';
import { useClient, useFilter, useInsert, useSelect, useUpdate } from 'react-supabase';
import { Profile as IProfile } from '../../Domain/Profile';
import { useAuth } from '../../Store/auth';
import { useNavigate } from 'react-router-dom';
import { useAppNotifications } from '../../Components/AppNotification/AppNotificationState';
import { useFormAlert } from '../../common';

interface EditProfileProps {

}

export const EditProfile: FunctionComponent<EditProfileProps> = () => {
    const auth = useAuth();
    const navigate = useNavigate();
    const pushNotification = useAppNotifications();
    const [alert, setAlert] = useFormAlert();
    const filter = useFilter((query) => {
        return query.eq('id', auth.user?.id);
    }, [auth.user?.id]);

    const [{ fetching }, insert] = useUpdate<IProfile>('profile', {
        filter
    });
    const [{ data, fetching: selectFetching }] = useSelect<IProfile>('profile', {
        filter
    });

    const profile = useMemo<IProfile|null>(() => {
        if (!data)
            return null;

        return {
            ...data[0],
            phone: data[0]?.phone ?? ''
        }
    }, [data]);

    const handleSubmit = async (profile: ProfileFormData) => {
        try {
            const {
                error,
            } = await insert(profile);

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
                text: `Profil użytkownika ${profile.name} ${profile.surname} został zaktualizowany`,
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

    if (!profile)
        return <p>Loading...</p>;

    return (
        <ProfileForm
            onSubmit={handleSubmit}
            loading={fetching}
            alert={alert}
            data={profile}
            editMode
        />
    );
};
