import React, { FunctionComponent } from 'react';
import { useAuth } from '../../Store/auth';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppNotifications } from '../../Components/AppNotification/AppNotificationState';
import { useFormAlert } from '../../common';
import { useFilter, useInsert, useSelect, useUpdate } from 'react-supabase';
import { Place } from '../../Domain/Place';
import { PlaceForm, PlaceFormData } from '../../Components/PlaceForm';

interface EditPlaceProps {

}

export const EditPlace: FunctionComponent<EditPlaceProps> = () => {
    const auth = useAuth();
    const params = useParams();
    const navigate = useNavigate();
    const pushNotification = useAppNotifications();
    const [alert, setAlert] = useFormAlert();
    const filter = useFilter((query) => {
        return query.eq('id', params.id);
    }, [params.id]);
    const [{ fetching }, update] = useUpdate<Place>('organization_unit', {
        filter
    });
    const [{ data, fetching: selectFetching }] = useSelect<Place>('organization_unit', {
        filter
    });

    const handleSubmit = async (place: PlaceFormData) => {
        try {
            const {
                error,
            } = await update(place);

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
                text: `Zaktualizowano miejsce o nazwie: ${place.name}`,
            });
            navigate('/places');
            setTimeout(() => {
                window.location.reload()
            }, 1);
        } catch (e) {
            setAlert({
                title: 'Błąd',
                type: 'error',
                message: 'Wystąpił nieznany błąd podczas przetwarzania żądania',
            });
        }
    };

    if (data) {
        return (
            <PlaceForm
                onSubmit={handleSubmit}
                loading={fetching || selectFetching}
                alert={alert}
                data={data[0]}
            />
        )
    }

    return (
        <p>Loading...</p>
    );
};
