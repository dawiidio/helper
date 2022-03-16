import React, { FunctionComponent, useState } from 'react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { FormTextField } from '../Components/Form/FormTextField';
import { Alert, AlertTitle, Box, Button, Grid, Paper, Typography } from '@mui/material';
import { useClient, useSignIn } from 'react-supabase';
import { getFieldError, useFormAlert } from '../common';
import { useAppNotifications } from '../Components/AppNotification/AppNotificationState';
import { FormAlert } from '../Components/Form/FormAlert';
import { useLocation, useNavigate } from 'react-router-dom';
import LoadingButton from '@mui/lab/LoadingButton';

const schema = yup.object({
    password1: yup.string().required().matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&\-_.,\[\];:=+()])[A-Za-z\d@$!%*#?&\-_.,\[\];:=+()]{8,}$/,
        'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character',
    ),
    password2: yup.string().required().test('df', 'Passwords do not match', function (val) {
        //@ts-ignore
        return val === this.parent.password1;
    }),
}).required();

interface PasswordRecoveryProps {

}

export interface PasswordRecoveryFormData {
    password1: string;
    password2: string;
}

export const PasswordRecovery: FunctionComponent<PasswordRecoveryProps> = () => {
    const client = useClient();
    const { handleSubmit, control, formState: { errors } } = useForm<PasswordRecoveryFormData>({
        resolver: yupResolver(schema),
    });
    const [alert, setAlert] = useFormAlert();
    const pushNotification = useAppNotifications();
    const [fetching, setFetching] = useState<boolean>(false);
    const navigate = useNavigate();

    const onSubmit = async (data: PasswordRecoveryFormData) => {
        const jwt = window.__TEMP_JWT;
        setFetching(true);

        if (!jwt) {
            setAlert({
                title: 'Token error',
                message: 'Temporary token not found'
            });
            return;
        }

        await client.auth.api.updateUser(jwt, {
            password: data.password1,
            data: {
                fulfilled: false
            }
        });

        window.__TEMP_JWT = undefined;
        pushNotification({
            text: 'Password changed'
        });
        navigate('/login');
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Paper>
                <Box padding={4}>
                    <Typography paddingBottom={2} variant={'h2'}>Helper 🇺🇦</Typography>
                    <Typography paddingBottom={2} variant='body2'>Ustaw hasło do konta</Typography>
                    <FormAlert formAlert={alert} />
                    <Grid>
                        <Grid item>
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
                        <Grid item>
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
                    </Grid>
                    <LoadingButton type='submit' fullWidth variant='contained' color='primary' loading={fetching}>Set new password</LoadingButton>
                </Box>
            </Paper>
        </form>
    );
};
