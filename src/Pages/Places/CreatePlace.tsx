import React, { FunctionComponent } from 'react';
import { PlaceForm, PlaceFormData } from '../../Components/PlaceForm';
import { useAuth } from '../../Store/auth';
import { useNavigate } from 'react-router-dom';
import { useAppNotifications } from '../../Components/AppNotification/AppNotificationState';
import { Place } from '../../Domain/Place';
import { useInsert } from 'react-supabase';
import { useFormAlert } from '../../common';

interface CreatePlaceProps {

}

export const CreatePlace: FunctionComponent<CreatePlaceProps> = ({}) => {
    const auth = useAuth();
    const navigate = useNavigate();
    const pushNotification = useAppNotifications();
    const [alert, setAlert] = useFormAlert();
    const [{ fetching }, insert] = useInsert<Place>('organization_unit');

    const handleSubmit = async (place: PlaceFormData) => {
        const fulfilledPlace: PlaceFormData = {
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
                text: `Dodano miejsce o nazwie: ${place.name}`,
            });
            navigate('/places');
        } catch {
            setAlert({
                title: 'Błąd',
                type: 'error',
                message: 'Wystąpił nieznany błąd podczas przetwarzania żądania',
            });
        }
    };

    return (
        <PlaceForm
            onSubmit={handleSubmit}
            loading={fetching}
            alert={alert}
        />
    );
};
