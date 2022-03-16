import React, { FunctionComponent, PropsWithChildren } from 'react';
import { Controller } from 'react-hook-form';
import {
    Autocomplete,
    Box,
    AutocompleteProps,
    TextField,
    AutocompleteValue,
    FormHelperText,
    FormControl,
} from '@mui/material';
import { CommonFormFieldProps } from './CommonFormFieldProps';

interface FormAutocompleteProps<T,
    Multiple extends boolean | undefined = undefined,
    DisableClearable extends boolean | undefined = undefined,
    FreeSolo extends boolean | undefined = undefined,
    > extends Omit<AutocompleteProps<T, Multiple, DisableClearable, FreeSolo>, 'renderInput'>, CommonFormFieldProps {
    defaultValue?: AutocompleteValue<T, Multiple, DisableClearable, FreeSolo> | undefined;
}

export function FormAutocomplete<T>({
                                        control,
                                        name,
                                        defaultValue,
                                        label,
                                        requiredStar,
                                        error,
                                        ...rest
                                    }: PropsWithChildren<FormAutocompleteProps<T>>) {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => {
                const {value, ...f} = field;

                return (
                    <FormControl fullWidth error={Boolean(error)} variant='filled'>
                        <Autocomplete
                            disablePortal
                            {...f}
                            {...rest}
                            onChange={(event, val) => {
                                field.onChange({
                                    target: {
                                        // @ts-ignore
                                        value: val.value
                                    }
                                });
                            }}
                            renderInput={(params) => (
                                <TextField
                                    variant={'filled'}
                                    error={Boolean(error)}
                                    {...params}
                                    label={`${label}${requiredStar ? ' *' : ''}`}
                                />
                            )}
                            defaultValue={defaultValue}
                        />
                        {error && <FormHelperText>{error}</FormHelperText>}
                    </FormControl>
                )
            }}
        />
    );
};
