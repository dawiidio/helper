import React, { FunctionComponent } from 'react';
import { CommonFormFieldProps } from './CommonFormFieldProps';
import {
    Box,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormHelperText,
    Switch,
    SwitchProps,
    ToggleButtonProps,
} from '@mui/material';
import { Controller } from 'react-hook-form';

interface FormToggleProps extends CommonFormFieldProps, Omit<SwitchProps, 'name'> {

}

export const FormToggle: FunctionComponent<FormToggleProps> = ({
                                                                   name,
                                                                   control,
                                                                   defaultValue,
                                                                   requiredStar,
                                                                   label,
                                                                   error,
                                                                   ...rest
                                                               }) => {

    return (
        <Controller
            name={name}
            control={control}
            defaultValue={defaultValue}
            render={({ field }) => (
                <Box paddingY={'0.9em'} marginBottom={1}>
                    <FormControl fullWidth error={Boolean(error)}>
                        <FormControlLabel control={<Switch {...rest} />} label={label as string} {...field} />
                        {error && <FormHelperText>{error}</FormHelperText>}
                    </FormControl>
                </Box>
            )}
        />
    );
};
