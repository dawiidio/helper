import React, { FunctionComponent } from 'react';
import { FormControl, FormHelperText, InputLabel, MenuItem, Select, SelectProps } from '@mui/material';
import { CommonFormFieldProps } from './CommonFormFieldProps';
import { Controller } from 'react-hook-form';
import { SelectItem } from './SelectItem';


export interface FormSelectFieldProps<T extends SelectItem = SelectItem> extends CommonFormFieldProps, Omit<SelectProps<T>, 'name' | 'label' | 'error'> {
    options: T[];
}

export const FormSelectField: FunctionComponent<FormSelectFieldProps> = ({
                                                                             name,
                                                                             control,
                                                                             defaultValue,
                                                                             options,
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
                <FormControl fullWidth error={Boolean(error)} variant='filled'>
                    <InputLabel id={`${name}-select-label`}>{`${label}${requiredStar ? ' *' : ''}`}</InputLabel>
                    <Select
                        labelId={`${name}-select-label`}
                        id={`${name}-select`}
                        error={Boolean(error)}
                        {...rest}
                        {...field}
                    >
                        {options.map(s => (
                            <MenuItem value={s.value} key={s.value} disabled={s.disabled}>{s.label}</MenuItem>
                        ))}
                    </Select>
                    {error && <FormHelperText>{error}</FormHelperText>}
                </FormControl>
            )}
        />
    );
};
