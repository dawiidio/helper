import React, { FunctionComponent } from "react";
import { Button, Grid, IconButton, Tooltip, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useNavigate, useParams } from 'react-router-dom';
import { useFilter, useSelect } from 'react-supabase';
import { NEED_STATUSES, NeedWithRelations } from '../../Domain/Need';
import { PLACE_STATUSES, PlaceWithRelations } from '../../Domain/Place';
import { DetailsViewItem } from '../../Components/DetailsViewItem';
import { ProfileNameWithTrustIcon } from '../../Components/ProfileNameWithTrustIcon';
import { createGoogleMapsLinkForPlace } from '../../common';
import MapIcon from '@mui/icons-material/Map';

interface ViewPlaceProps {

}

export const ViewPlace:FunctionComponent<ViewPlaceProps> = ({  }) => {
    const params = useParams();
    const filter = useFilter((query) => {
        return query.select(`*, profile:creator_id (*)`).eq('id', params.id);
    }, [params.id]);
    const [{ data }] = useSelect<PlaceWithRelations>('organization_unit', {
        filter,
    });

    if (!data)
        return <p>Loading...</p>

    const place = data[0];

    const handleBack = () => {
        window.history.back();
    };

    return (
        <Grid container>
            <Grid container xs={12} alignItems='center' flexWrap='nowrap'>
                <Grid item flexGrow={1}>
                    <Typography variant='h4'>
                        {place.name}
                    </Typography>
                    <Typography variant='body1' color={'gray'} paddingY={1}>
                        Dodano: <i>{dayjs((place.created_at)).tz(dayjs.tz.guess()).format('DD.MM.YYYY HH:mm')}</i> |
                        Status: <i>{PLACE_STATUSES.find(x => x.value = place.status)?.label}</i>
                    </Typography>
                </Grid>
                <Grid item>
                    <Button onClick={handleBack}>wróć</Button>
                    <Tooltip title={'Otwórz w mapach Google'}>
                        <IconButton edge='end' aria-label='edit' component='a'
                                    target='_blank'
                                    href={createGoogleMapsLinkForPlace(place)}>
                            <MapIcon />
                        </IconButton>
                    </Tooltip>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Typography variant='h6' marginTop={2}>
                    Adres
                </Typography>
            </Grid>
            <DetailsViewItem title='Ulica'>
                {place.addressLine1}
                {place.addressLine2 || ''}
            </DetailsViewItem>
            <DetailsViewItem title='Miasto'>
                {place.city}
            </DetailsViewItem>
            <DetailsViewItem title='Kod pocztowy'>
                {place.postalCode}
            </DetailsViewItem>
            <Grid item xs={12}>
                <Typography variant='h6' marginTop={2}>
                    Dane szczegółowe
                </Typography>
            </Grid>
            <DetailsViewItem title='Organizacja/osoba prowadząca miejsce'>
                {place.organization_name ?? 'Brak'}
            </DetailsViewItem>
            <DetailsViewItem title='Telefon kontaktowy'>
                {place.phone ?? 'Brak'}
            </DetailsViewItem>
            <DetailsViewItem title='Opis'>
                {place.description ?? 'Brak'}
            </DetailsViewItem>
            <Grid item xs={12}>
                <Typography variant='h6' marginTop={2}>
                    W systemie dodane przez
                </Typography>
            </Grid>
            <DetailsViewItem title='Imię i nazwisko lub nazwa organizacji'>
                <ProfileNameWithTrustIcon trusted={place.profile.confirmed} variant='place'>
                    {place.profile.name} {place.profile.surname ?? ''}
                </ProfileNameWithTrustIcon>
            </DetailsViewItem>
        </Grid>
    )
};
