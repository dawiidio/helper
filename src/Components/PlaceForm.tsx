import React, { FunctionComponent } from 'react';
import { Place, PLACE_STATUSES } from '../Domain/Place';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import { FormTextField } from './Form/FormTextField';
import { Box, Grid, Typography } from '@mui/material';
import { FormSelectField } from './Form/FormSelectField';
import { getFieldError } from '../common';
import { FormAlert } from './Form/FormAlert';
import { FormProps } from './FormProps';

interface PlaceFormProps extends FormProps<PlaceFormData> {}

const schema = yup.object({
    status: yup.string().required(),
    name: yup.string().required().max(100),
    phone: yup.string().nullable().max(12),
    description: yup.string().nullable().max(1000),
    city: yup.string().required().max(100),
    addressLine1: yup.string().required().max(100),
    addressLine2: yup.string().nullable().max(100),
    organization_name: yup.string().nullable().max(100),
    postalCode: yup.string().required().max(6),
}).required();

export type PlaceFormData = Partial<Place>;

export const PlaceForm: FunctionComponent<PlaceFormProps> = ({
                                                                 onSubmit,
                                                                 data: place,
                                                                 loading,
                                                                 alert
                                                             }) => {
    const { handleSubmit, control, formState: { errors } } = useForm<PlaceFormData>({
        resolver: yupResolver(schema),
        defaultValues: place
    });


    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <FormAlert formAlert={alert} />
            <Grid container spacing={4}>
                <Grid item xs={12}>
                    <Typography variant='h6'>
                        Dane podstawowe
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    <FormTextField
                        error={getFieldError<PlaceFormData>('name', errors)}
                        control={control}
                        name='name'
                        label='Nazwa miejsca'
                        fullWidth
                        requiredStar
                    />
                </Grid>
                <Grid item xs={6}>
                    <FormTextField
                        error={getFieldError<PlaceFormData>('organization_name', errors)}
                        control={control}
                        name='organization_name'
                        label='Nazwa organizacji prowadzącej miejsce'
                        fullWidth
                    />
                </Grid>
                <Grid item xs={6}>
                    <FormSelectField
                        error={getFieldError<PlaceFormData>('status', errors)}
                        control={control}
                        name='status'
                        options={PLACE_STATUSES}
                        label='Status'
                        requiredStar
                    />
                </Grid>
                <Grid item xs={6}>
                    <FormTextField
                        error={getFieldError<PlaceFormData>('phone', errors)}
                        control={control}
                        name='phone'
                        label='Telefon kontaktowy'
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12}>
                    <FormTextField
                        error={getFieldError<PlaceFormData>('description', errors)}
                        control={control}
                        name='description'
                        label='Opis'
                        fullWidth
                        maxRows={5}
                        rows={4}
                        multiline
                    />
                </Grid>
                <Grid item xs={12}>
                    <Typography variant='h6'>
                        Adres
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    <FormTextField
                        error={getFieldError<PlaceFormData>('city', errors)}
                        control={control}
                        name='city'
                        label='Miasto'
                        fullWidth
                        requiredStar
                    />
                </Grid>
                <Grid item xs={6}>
                    <FormTextField
                        error={getFieldError<PlaceFormData>('postalCode', errors)}
                        control={control}
                        name='postalCode'
                        label='Kod pocztowy'
                        fullWidth
                        requiredStar
                    />
                </Grid>
                <Grid item xs={12}>
                    <FormTextField
                        error={getFieldError<PlaceFormData>('addressLine1', errors)}
                        control={control}
                        name='addressLine1'
                        label='Adres linia 1'
                        fullWidth
                        requiredStar
                    />
                </Grid>
                <Grid item xs={12}>
                    <FormTextField
                        error={getFieldError<PlaceFormData>('addressLine2', errors)}
                        control={control}
                        name='addressLine2'
                        label='Adres linia 2'
                        fullWidth
                    />
                </Grid>
            </Grid>
            <Box marginY={4}>
                <LoadingButton type='submit' fullWidth variant='contained' color='primary'
                               loading={loading}>
                    Wyślij
                </LoadingButton>
            </Box>
        </form>
    );
};
