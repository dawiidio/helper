import React, { FunctionComponent } from 'react';
import * as yup from 'yup';
import { Profile } from '../Domain/Profile';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import { FormProps } from './FormProps';
import { FormAlert } from './Form/FormAlert';
import { Box, Grid, Typography } from '@mui/material';
import { FormTextField } from './Form/FormTextField';
import { getFieldError } from '../common';
import LoadingButton from '@mui/lab/LoadingButton';
import { CreateProfileFormData } from './CreateProfileForm';

interface ProfileFormProps extends FormProps<ProfileFormData> {
}

export type ProfileFormData = Partial<Profile>;


const schema = yup.object({
    name: yup.string().required().max(100),
    email: yup.string().email().max(100).required(),
    phone: yup.string().nullable().max(100),
    is_organisation: yup.boolean(),
    surname: yup.string().when('is_organisation', {
        is: false,
        then: (schema) => schema.required().max(100),
        otherwise: (schema) => schema.nullable()
    }),
});

export const ProfileForm: FunctionComponent<ProfileFormProps> = ({
                                                                     data: profile,
                                                                     onSubmit,
                                                                     loading,
                                                                     alert,
                                                                     editMode,
                                                                 }) => {
    const { handleSubmit, control, formState: { errors } } = useForm<ProfileFormData>({
        resolver: yupResolver(schema),
        defaultValues: profile,
    });

    const isOrganisation = profile?.is_organisation;

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <FormAlert formAlert={alert} />
            <Grid container spacing={4}>
                <Grid item xs={12}>
                    <Typography variant='h6'>
                        Dane podstawowe
                    </Typography>
                    <Typography variant='body1'>
                        Podane przez Ciebie imię, nazwisko, telefon oraz email będą widoczne publicznie w szczególach
                        dodanych przez Ciebie potrzeb,
                    </Typography>
                </Grid>
                <Grid item xs={isOrganisation ? 12 : 6}>
                    <FormTextField
                        error={getFieldError<CreateProfileFormData>('name', errors)}
                        control={control}
                        name='name'
                        label={isOrganisation ? 'Nazwa organizacji' : 'Imię'}
                        fullWidth
                        requiredStar
                    />
                </Grid>
                {
                    !isOrganisation && (
                        <Grid item xs={6}>
                            <FormTextField
                                error={getFieldError<CreateProfileFormData>('surname', errors)}
                                control={control}
                                name='surname'
                                label='Nazwisko'
                                fullWidth
                                requiredStar
                            />
                        </Grid>
                    )
                }
                <Grid item xs={6}>
                    <FormTextField
                        error={getFieldError<ProfileFormData>('email', errors)}
                        control={control}
                        name='email'
                        label='Email'
                        fullWidth
                        requiredStar
                    />
                </Grid>
                <Grid item xs={6}>
                    <FormTextField
                        error={getFieldError<ProfileFormData>('phone', errors)}
                        control={control}
                        name='phone'
                        label='Numer telefonu'
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
