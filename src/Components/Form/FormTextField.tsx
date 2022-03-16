import React, { FunctionComponent } from 'react';
import { Box, TextField, TextFieldProps } from '@mui/material';
import { Control, Controller } from 'react-hook-form';
import { removeTimezone } from '../../common';

type FormTextFieldProps = {
    control: Control<any>;
    name: string;
    label: string;
    defaultValue?: string;
    error?: string;
    type?: Pick<TextFieldProps, 'type'>['type'];
    fullWidth?: boolean;
    requiredStar?: boolean
} & Omit<TextFieldProps, 'error'>;

export const FormTextField: FunctionComponent<FormTextFieldProps> = ({
                                                                         control,
                                                                         error,
                                                                         name,
                                                                         defaultValue,
                                                                         label,
                                                                         type = 'text',
                                                                         requiredStar,
                                                                         fullWidth,
                                                                         ...rest
                                                                     }) => {

    return (
        <Controller
            name={name}
            control={control}
            defaultValue={defaultValue}
            render={({ field }) => (
                <Box marginBottom={2}>
                    <TextField
                        {...rest}
                        {...field}
                        value={type === 'datetime-local' ? removeTimezone(field.value) : field.value}
                        error={Boolean(error)}
                        label={`${label}${requiredStar ? ' *' : ''}`}
                        helperText={error}
                        type={type}
                        variant='filled'
                        fullWidth={fullWidth}
                    />
                </Box>
            )}
        />
    );
};
