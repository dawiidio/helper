import React, { FunctionComponent, useEffect, useMemo } from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import { FormTextField } from './Form/FormTextField';
import { Box, Grid, Typography } from '@mui/material';
import { FormSelectField } from './Form/FormSelectField';
import { getFieldError, setYupLocale } from '../common';
import { FormAlert } from './Form/FormAlert';
import { Need, NEED_PRIORITY, NEED_STATUSES, NEED_TYPE, NEED_UNITS, NeedStatus } from '../Domain/Need';
import { FormAutocomplete } from './Form/FormAutocomplete';
import { useAtomValue } from 'jotai';
import { placesAtom } from '../Store/place';
import { SelectItem } from './Form/SelectItem';
import { FormProps } from './FormProps';
import dayjs from 'dayjs';

interface NeedFormProps extends FormProps<NeedFormData>{}

setYupLocale();

const schema = yup.object({
    status: yup.string().required().label('status'),
    name: yup.string().required().label('nazwa'),
    type: yup.string().required().label('typ'),
    organizer_phone: yup.string().nullable().label('telefon kontaktowy'),
    organizer_email: yup.string().required().label('email kontaktowy'),
    organizer_name: yup.string().required().label('nazwa organizatora'),
    description: yup.string().required().label('opis'),
    organization_unit_id: yup.string().required().label('miejsce'),
    quantity: yup.number().required().max(100000).min(1).test('test0', 'Ilość nie może być mniejsza od ostatnio ustawionej', function(val) {
        if (this.parent.id) {
            return (val ? val : 0) >= this.options.context?.defaultQuantity;
        }

        return true;
    }).label('ilość'),
    supplied: yup.number().required().max(100000).min(0).test('test1', 'Ilość nie może być mniejsza od ostatnio ustawionej', function(val) {
        if (this.parent.id) {
            return (val ? val : 0) >= this.options.context?.defaultSupplied;
        }

        return true;
    }).label('otrzymano'),
    unit: yup.string().required().label('jednostka'),
    priority: yup.string().required().label('priorytet'),
    start_date: yup.string().nullable().label('data rozpoczęcia'),
    end_date: yup.string().nullable().label('data zakończenia'),
});

export type NeedFormData = Partial<Need>;

const DATE_FORMAT = 'YYYY-MM-DDTHH:mm';

export const NeedForm: FunctionComponent<NeedFormProps> = ({
                                                               onSubmit,
                                                               data: need,
                                                               loading,
                                                               alert,
    editMode
                                                           }) => {
    const { handleSubmit, control, formState: { errors }, watch, setValue } = useForm<NeedFormData>({
        resolver: yupResolver(schema),
        defaultValues: need,
        context: {
            defaultQuantity: need?.quantity,
            defaultSupplied: need?.supplied,
        },
    });
    const places = useAtomValue(placesAtom);

    const [startDate, status] = watch(['start_date', 'status']);
    const disableAllFields = editMode && need?.status === NeedStatus.outdated;
    const disableDateFields = disableAllFields || (need?.status === NeedStatus.active && Boolean(need?.start_date || need?.end_date));
    const disableStatus = disableAllFields || status === NeedStatus.waiting;
    const startDateMinDate = dayjs().format(DATE_FORMAT);
    const endDateMaxDate = dayjs(startDate ? startDateMinDate : new Date()).add(30, 'day').format(DATE_FORMAT);
    const endDateMinDate = startDate ? dayjs(startDate).add(1, 'day').format(DATE_FORMAT) : dayjs().add(1, 'day').format(DATE_FORMAT);

    useEffect(() => {
        if (startDate && dayjs(startDate).isAfter(dayjs())) {
            setValue('status', NeedStatus.waiting);
        }
        else if (!startDate) {
            setValue('status', NeedStatus.active);
        }
    }, [startDate]);

    const { placesOptions, defaultPlace } = useMemo(() => {
        const temp = places.map<SelectItem>(p => ({
            label: p.label,
            value: p.id.toString(),
        }));

        return {
            placesOptions: temp,
            defaultPlace: temp.find(x => need?.organization_unit_id === parseInt(x.value))
        }
    }, [places, need]);

    if (!places.length) {
        return null;
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <FormAlert formAlert={alert} />
            <Grid container spacing={4}>
                <Grid item xs={12}>
                    <Typography variant='h6'>
                        Dane podstawowe
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <FormAutocomplete
                        error={getFieldError<NeedFormData>('organization_unit_id', errors)}
                        control={control}
                        name='organization_unit_id'
                        label='Miejsce'
                        fullWidth
                        requiredStar
                        defaultValue={defaultPlace}
                        options={placesOptions}
                        disabled={disableAllFields}
                    />
                </Grid>
                <Grid item xs={6}>
                    <FormTextField
                        error={getFieldError<NeedFormData>('name', errors)}
                        control={control}
                        name='name'
                        label='Nazwa'
                        fullWidth
                        requiredStar
                        disabled={disableAllFields}
                    />
                </Grid>
                <Grid item xs={6}>
                    <FormSelectField
                        error={getFieldError<NeedFormData>('status', errors)}
                        control={control}
                        name='status'
                        options={NEED_STATUSES}
                        label='Status'
                        disabled={disableStatus}
                        requiredStar
                    />
                </Grid>
                <Grid item xs={6}>
                    <FormSelectField
                        error={getFieldError<NeedFormData>('priority', errors)}
                        control={control}
                        name='priority'
                        options={NEED_PRIORITY}
                        label='Priorytet'
                        requiredStar
                        disabled={disableAllFields}
                    />
                </Grid>
                <Grid item xs={6}>
                    <FormSelectField
                        error={getFieldError<NeedFormData>('type', errors)}
                        control={control}
                        name='type'
                        options={NEED_TYPE}
                        label='Typ'
                        requiredStar
                        disabled={disableAllFields}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Typography variant='h6'>
                        Ramy czasowe
                    </Typography>
                    <Typography variant='body2'>
                        Jeśli wybrana data startu znajduje się w przyszłości to pole statusu zablokuje się i system uruchomi
                        zbiórkę automatycznie w podanym terminie. Analogicznie działa data zakończenia, system automatycznie
                        zakończy zbiórkę po podanym terminie.
                        <br/>
                        Jeśli nie podasz żadnych dat to zbiórka wystartuje natychmiast i będzie wymagała ręcznej dezaktywacji
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    <FormTextField
                        error={getFieldError<NeedFormData>('start_date', errors)}
                        control={control}
                        name='start_date'
                        label='Data rozpoczęcia'
                        fullWidth
                        type='datetime-local'
                        disabled={disableDateFields}
                        InputProps={{
                            inputProps: {
                                min: startDateMinDate,
                            }
                        }}
                    />
                </Grid>
                <Grid item xs={6}>
                    <FormTextField
                        error={getFieldError<NeedFormData>('end_date', errors)}
                        control={control}
                        name='end_date'
                        label='Data zakończenia'
                        fullWidth
                        type='datetime-local'
                        disabled={disableDateFields}
                        InputProps={{
                            inputProps: {
                                max: endDateMaxDate,
                                min: endDateMinDate
                            }
                        }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Typography variant='h6'>
                        Informacje o organizatorze
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <FormTextField
                        error={getFieldError<NeedFormData>('organizer_name', errors)}
                        control={control}
                        name='organizer_name'
                        label='Organizator (imię i nazwisko lub organizacja)'
                        requiredStar
                        fullWidth
                        disabled={disableAllFields}
                    />
                </Grid>
                <Grid item xs={6}>
                    <FormTextField
                        error={getFieldError<NeedFormData>('organizer_email', errors)}
                        control={control}
                        name='organizer_email'
                        label='Email kontaktowy do organizatora'
                        requiredStar
                        fullWidth
                        disabled={disableAllFields}
                    />
                </Grid>
                <Grid item xs={6}>
                    <FormTextField
                        error={getFieldError<NeedFormData>('organizer_phone', errors)}
                        control={control}
                        name='organizer_phone'
                        label='Telefon kontaktowy do organizatora'
                        fullWidth
                        disabled={disableAllFields}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Typography variant='h6'>
                        Informacje szczegółowe
                    </Typography>
                    <Typography variant='body2'>
                        Opis nie jest wymagany ale pamiętaj, że im lepiej określisz potrzeby i cel swojej zbiórki tym łatwiej
                        będzie innym dostarczyć Ci potrzebne produkty :) Np. jeśli potrzebujesz naleśników to opisz jakich,
                        przepis jest prosty ale może okazać się, że dla Ciebie oczywiste było, że naleśniki robi się na
                        mleku roślinnym a dla kogoś innego, że na zwierzęcym.
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <FormSelectField
                        error={getFieldError<NeedFormData>('unit', errors)}
                        control={control}
                        name='unit'
                        options={NEED_UNITS}
                        label='Jednostka'
                        requiredStar
                        disabled={disableAllFields}
                    />
                </Grid>
                <Grid item xs={6}>
                    <FormTextField
                        error={getFieldError<NeedFormData>('quantity', errors)}
                        control={control}
                        name='quantity'
                        label='Potrzebna ilość'
                        fullWidth
                        type='number'
                        requiredStar
                        disabled={disableAllFields}
                    />
                </Grid>
                <Grid item xs={6}>
                    <FormTextField
                        error={getFieldError<NeedFormData>('supplied', errors)}
                        control={control}
                        name='supplied'
                        label='Już otrzymana ilość/pomoc'
                        fullWidth
                        type='number'
                        requiredStar
                        disabled={disableAllFields}
                    />
                </Grid>
                <Grid item xs={12}>
                    <FormTextField
                        error={getFieldError<NeedFormData>('description', errors)}
                        control={control}
                        name='description'
                        label='Opis'
                        fullWidth
                        maxRows={5}
                        rows={4}
                        multiline
                        disabled={disableAllFields}
                        requiredStar
                    />
                </Grid>
            </Grid>
            <Box marginY={4}>
                <LoadingButton type='submit' fullWidth variant='contained' color='primary'
                               loading={loading}
                               disabled={disableAllFields}>
                    Wyślij
                </LoadingButton>
            </Box>
        </form>
    );
};
