import React, { FC, FunctionComponent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFilter, useSelect } from 'react-supabase';
import { Need, NEED_PRIORITY, NEED_STATUSES, NEED_TYPE, NEED_UNITS, NeedWithRelations } from '../../Domain/Need';
import { Box, Button, Grid, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { DetailsViewItem } from '../../Components/DetailsViewItem';
import { ProfileNameWithTrustIcon } from '../../Components/ProfileNameWithTrustIcon';

interface ViewNeedProps {

}

export const ViewNeed: FunctionComponent<ViewNeedProps> = ({}) => {
    const params = useParams();
    const filter = useFilter((query) => {
        return query.select(`*, place:organization_unit_id (*), profile:creator_id (*)`).eq('id', params.id);
    }, [params.id]);
    const [{ data, fetching: selectFetching }] = useSelect<NeedWithRelations>('need', {
        filter,
    });

    if (!data)
        return <>Loading ...</>;

    const need = data[0];

    return (
        <Grid container>
            <Grid container xs={12} alignItems='center' flexWrap='nowrap'>
                <Grid item flexGrow={1}>
                    <Typography variant='h4'>
                        {need.name}
                    </Typography>
                    <Typography variant='body1' color={'gray'} paddingY={1}>
                        Dodano: <i>{dayjs((need.created_at)).tz(dayjs.tz.guess()).format('DD.MM.YYYY HH:mm')}</i> |
                        Zaktualizowano: <i>{dayjs((need.updated_at)).tz(dayjs.tz.guess()).format('DD.MM.YYYY HH:mm')}</i>
                    </Typography>
                </Grid>
                <Grid item>
                    <Button href='#/' component='a'>wróć</Button>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Typography variant='h6' marginTop={2}>
                    W systemie dodane przez
                </Typography>
            </Grid>
            <DetailsViewItem title='Imię i nazwisko lub nazwa organizacji'>
                <ProfileNameWithTrustIcon trusted={need.profile.confirmed} variant='need'>
                    {need.profile.name} {need.profile.surname ?? ''}
                </ProfileNameWithTrustIcon>
            </DetailsViewItem>
            <Grid item xs={12}>
                <Typography variant='h6' marginTop={2}>
                    Organizator
                </Typography>
            </Grid>
            <DetailsViewItem title='Nazwa'>
                {need.organizer_name}
            </DetailsViewItem>
            <DetailsViewItem title='Email kontaktowy'>
                {need.organizer_email}
            </DetailsViewItem>
            <DetailsViewItem title='Telefon kontaktowy'>
                {need.organizer_phone}
            </DetailsViewItem>
            <Grid item xs={12}>
                <Typography variant='h6' marginY={2}>
                    Miejsce zbiórki
                </Typography>
            </Grid>
            <DetailsViewItem title='Nazwa'>
                {need.place.name}
            </DetailsViewItem>
            <DetailsViewItem title='Adres'>
                {need.place.city} {need.place.postalCode}, {need.place.addressLine1} {need.place.addressLine2 ?? ''}
                <br/>
                <Button component='a' href={'#/place/'+need.place.id}>Pokaż szczegóły miejsca</Button>
            </DetailsViewItem>
            <Grid item xs={12}>
                <Typography variant='h6' marginY={2}>
                    Szczegóły
                </Typography>
            </Grid>
            <DetailsViewItem title='Potrzebna ilość'>
                {need.quantity}
            </DetailsViewItem>
            <DetailsViewItem title='Dostarczono'>
                {need.supplied}
            </DetailsViewItem>
            <DetailsViewItem title='Brakuje jeszcze'>
                {need.quantity - need.supplied}
            </DetailsViewItem>
            <DetailsViewItem title='Jednostka miary'>
                {NEED_UNITS.find(x => x.value = need.unit)?.label}
            </DetailsViewItem>
            <DetailsViewItem title='Opis'>
                {need.description}
            </DetailsViewItem>
            <Grid item xs={12}>
                <Typography variant='h6' marginTop={2}>
                    Ramy czasowe
                </Typography>
            </Grid>
            <DetailsViewItem title='Data startu'>
                {need.start_date ? dayjs(need.start_date).format('DD.MM.YYYY HH:mm') : 'Brak'}
            </DetailsViewItem>
            <DetailsViewItem title='Data zakończenia'>
                {need.end_date ? dayjs(need.end_date).format('DD.MM.YYYY HH:mm') : 'Brak'}
            </DetailsViewItem>
            <Grid item xs={12}>
                <Typography variant='h6' marginY={2}>
                    Status
                </Typography>
            </Grid>
            <DetailsViewItem title='Status'>
                {NEED_STATUSES.find(x => x.value = need.status)?.label}
            </DetailsViewItem>
            <DetailsViewItem title='Priorytet'>
                {NEED_PRIORITY.find(x => x.value = need.priority)?.label}
            </DetailsViewItem>
            <DetailsViewItem title='Typ'>
                {NEED_TYPE.find(x => x.value = need.type)?.label}
            </DetailsViewItem>
        </Grid>
    );
};
