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
import { PasswordRecoveryFormData } from '../Pages/PasswordRecovery';
import { FormToggle } from './Form/FormToggle';
import { ProfileFormData } from './ProfileForm';

interface CreateProfileFormProps extends FormProps<CreateProfileFormData> {
}

export type CreateProfileFormData = Partial<Profile> & Partial<PasswordRecoveryFormData>;


const schema = yup.object({
    name: yup.string().required().max(100),
    surname: yup.string().when('is_organisation', {
        is: false,
        then: (schema) => schema.required().max(100),
        otherwise: (schema) => schema.nullable()
    }),
    email: yup.string().email().max(100).required(),
    is_organisation: yup.boolean(),
    phone: yup.string().nullable().max(100),
    terms: yup.boolean().isTrue().required(),
    password1: yup.string().required().matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&\-_.,\[\];:=+()])[A-Za-z\d@$!%*#?&\-_.,\[\];:=+()]{8,}$/,
        'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character',
    ),
    password2: yup.string().required().test('df', 'Passwords do not match', function(val) {
        //@ts-ignore
        return val === this.parent.password1;
    }),
});


export const CreateProfileForm: FunctionComponent<CreateProfileFormProps> = ({
                                                                                 data: profile,
                                                                                 onSubmit,
                                                                                 loading,
                                                                                 alert,
                                                                             }) => {
    const { handleSubmit, control, formState: { errors }, watch } = useForm<CreateProfileFormData>({
        resolver: yupResolver(schema),
        defaultValues: profile,
    });

    const isOrganisation = watch('is_organisation');

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
                <Grid item xs={12}>
                    <FormToggle
                        error={getFieldError<CreateProfileFormData>('is_organisation', errors)}
                        control={control}
                        name='is_organisation'
                        label='Profil organizacji'
                        requiredStar
                    />
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
                        error={getFieldError<CreateProfileFormData>('email', errors)}
                        control={control}
                        name='email'
                        label='Email'
                        fullWidth
                        requiredStar
                    />
                </Grid>
                <Grid item xs={6}>
                    <FormTextField
                        error={getFieldError<CreateProfileFormData>('phone', errors)}
                        control={control}
                        name='phone'
                        label='Numer telefonu'
                        fullWidth
                    />
                </Grid>
                <>
                    <Grid item xs={12}>
                        <Typography variant='h6'>
                            Hasło do profilu
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <FormTextField
                            label='Password'
                            error={getFieldError<PasswordRecoveryFormData>('password1', errors)}
                            defaultValue=''
                            control={control}
                            name='password1'
                            type='password'
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <FormTextField
                            label='Repeat password'
                            error={getFieldError<PasswordRecoveryFormData>('password2', errors)}
                            defaultValue=''
                            control={control}
                            name='password2'
                            type='password'
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant='h6'>
                            Regulamin
                        </Typography>
                        <Typography variant='body2'>
                            Akcetptuję regualamin znajdujący się na stronie <a href='/#/terms-and-conditions'
                                                                               target='_blank'
                                                                               title='Otwórz w nowym oknie'>REGULAMIN</a>
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <FormToggle
                            // @ts-ignore
                            error={getFieldError<CreateProfileFormData>('terms', errors)}
                            control={control}
                            name='terms'
                            label='Akceptuję regulamin'
                            requiredStar
                        />
                    </Grid>
                </>
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
