import React, { FunctionComponent } from 'react';
import { useClient, useInsert } from 'react-supabase';
import { Profile as IProfile } from '../../Domain/Profile';
import { useAuth } from '../../Store/auth';
import { useNavigate } from 'react-router-dom';
import { useAppNotifications } from '../../Components/AppNotification/AppNotificationState';
import { useFormAlert } from '../../common';
import { CreateProfileForm, CreateProfileFormData } from '../../Components/CreateProfileForm';

interface ProfileProps {

}

export const CreateProfile: FunctionComponent<ProfileProps> = () => {
    const auth = useAuth();
    const navigate = useNavigate();
    const pushNotification = useAppNotifications();
    const [alert, setAlert] = useFormAlert();
    const client = useClient();
    const [{ fetching }, insert] = useInsert<IProfile>('profile');

    const handleSubmit = async (profile: CreateProfileFormData) => {
        const fulfilledProfile: Partial<IProfile> = {
            id: auth.user!.id,
            surname: profile.surname,
            name: profile.name,
            phone: profile.phone,
            email: profile.email,
            is_organisation: profile.is_organisation
        };

        try {
            const {
                error,
            } = await insert(fulfilledProfile);

            if (error) {
                setAlert({
                    title: 'Błąd',
                    type: 'error',
                    message: error.message,
                });
                return;
            }

            await client.auth.update( {
                password: profile.password1,
                data: {
                    fulfilled: true
                }
            });

            pushNotification({
                type: 'success',
                text: `Witaj ${profile.name} ${profile.surname ?? ''}! :)`,
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

    return (
        <CreateProfileForm
            onSubmit={handleSubmit}
            loading={fetching}
            alert={alert}
        />
    );
};
