import React, { FunctionComponent } from 'react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { FormTextField } from '../Components/Form/FormTextField';
import { FieldErrors } from 'react-hook-form/dist/types/errors';
import { Alert, AlertTitle, Box, Button, Grid, Paper, Typography } from '@mui/material';
import { useSignIn } from 'react-supabase';
import { getFieldError, useFormAlert } from '../common';
import { FormAlert } from '../Components/Form/FormAlert';
import LoadingButton from '@mui/lab/LoadingButton';
import { useAtom } from 'jotai';
import { authAtom } from '../Store/auth';
import { useNavigate } from 'react-router-dom';

const schema = yup.object({
    email: yup.string().required(),
    password: yup.string().required(),
}).required();

interface LoginProps {

}

interface LoginData {
    email: string;
    password: string;
}

export const Login: FunctionComponent<LoginProps> = () => {
    const { handleSubmit, control, formState: { errors } } = useForm<LoginData>({
        resolver: yupResolver(schema),
    });
    const [{ error, fetching, session, user }, signIn] = useSignIn();
    const [alert, setAlert] = useFormAlert();
    const [auth, setAuth] = useAtom(authAtom);
    const navigate = useNavigate();

    const onSubmit = async ({ email, password }: LoginData) => {
        const { error, session, user } = await signIn({
            email,
            password,
        });

        if (error) {
            setAlert({
                title: 'Login error',
                message: error.message,
            });

            return;
        }

        if (!session || !user) {
            setAlert({
                title: 'Login error',
                message: 'Internal error (null session or user)',
            });

            return;
        }

        setAuth({ session, user });
        navigate('/');
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Paper>
                <Box padding={4}>
                    <Typography paddingBottom={2} variant={'h2'}>Helper 🇺🇦</Typography>
                    <FormAlert formAlert={alert} />
                    <Grid>
                        <Grid item>
                            <FormTextField
                                label='Email'
                                error={getFieldError<LoginData>('email', errors)}
                                defaultValue=''
                                control={control}
                                name='email'
                                fullWidth
                            />
                        </Grid>
                        <Grid item>
                            <FormTextField
                                label='Password'
                                error={getFieldError<LoginData>('password', errors)}
                                defaultValue=''
                                control={control}
                                name='password'
                                fullWidth
                                type='password'
                            />
                        </Grid>
                    </Grid>
                    <LoadingButton type='submit' fullWidth variant='contained' color='primary'
                                   loading={fetching}>Login</LoadingButton>
                </Box>
            </Paper>
        </form>
    );
};

