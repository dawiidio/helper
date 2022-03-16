import React, {
    Component,
    FunctionComponent,
    SyntheticEvent,
    useEffect,
    useState,
    ComponentType,
    useMemo, ChangeEvent,
} from 'react';
import { useAtomValue } from 'jotai';
import { placesAtom } from '../../Store/place';
import {
    Alert,
    Autocomplete, Button,
    FormControl,
    Grid, IconButton,
    InputLabel, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
    MenuItem,
    Pagination,
    Select,
    SelectChangeEvent,
    TextField, Tooltip, Typography,
} from '@mui/material';
import {
    Need,
    NEED_STATUSES,
    NEED_TYPE,
    NeedPriority,
    NeedStatus,
    NeedType,
    NeedUnit,
    NeedWithRelations,
} from '../../Domain/Need';
import { useClient, useFilter, useSelect } from 'react-supabase';
import DeleteIcon from '@mui/icons-material/Delete';
import Battery20Icon from '@mui/icons-material/Battery20';
import Battery30Icon from '@mui/icons-material/Battery30';
import Battery50Icon from '@mui/icons-material/Battery50';
import Battery60Icon from '@mui/icons-material/Battery60';
import Battery80Icon from '@mui/icons-material/Battery80';
import Battery90Icon from '@mui/icons-material/Battery90';
import BatteryFullIcon from '@mui/icons-material/BatteryFull';
import BatteryChargingFullIcon from '@mui/icons-material/BatteryChargingFull';
import BatteryUnknownIcon from '@mui/icons-material/BatteryUnknown';
import { SvgIconProps } from '@mui/material/SvgIcon/SvgIcon';
import { useAuth } from '../../Store/auth';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import { InfoText } from '../../Components/InfoText';
import dayjs from 'dayjs';
import { SelectItem } from '../../Components/Form/SelectItem';
import { TrustedIcon } from '../../Components/TrustedIcon';
import { ProfileNameWithTrustIcon } from '../../Components/ProfileNameWithTrustIcon';

const getIcon = (neededQuantity: number, supplied: number): ComponentType<SvgIconProps> => {
    const val = (supplied / neededQuantity) * 100;

    if (val < 20) {
        return Battery20Icon;
    } else if (val >= 20 && val < 30) {
        return Battery30Icon;
    } else if (val >= 30 && val < 50) {
        return Battery50Icon;
    } else if (val >= 50 && val < 60) {
        return Battery60Icon;
    } else if (val >= 60 && val < 80) {
        return Battery80Icon;
    } else if (val >= 80 && val < 100) {
        return Battery90Icon;
    } else if (val === 100) {
        return BatteryFullIcon;
    } else if (val === 100) {
        return BatteryChargingFullIcon;
    }

    return BatteryUnknownIcon;
};

const PRIORITY_TO_COLOR: Record<NeedPriority, Pick<SvgIconProps, 'color'>['color']> = {
    [NeedPriority.high]: 'error',
    [NeedPriority.medium]: 'info',
    [NeedPriority.low]: 'disabled',
};

interface ListNeedsProps {

}

interface PlaceItem {
    label: string;
    id: number;
}

interface PriorityItem {
    label: string;
    value: NeedPriority | 'RESET';
}

const RESET = 'RESET';

const PRIORITIES: Array<PriorityItem> = [
    {
        label: '---',
        value: 'RESET',
    },
    {
        label: 'Wysoki',
        value: NeedPriority.high,
    },
    {
        label: 'Średni',
        value: NeedPriority.medium,
    },
    {
        label: 'Niski',
        value: NeedPriority.low,
    },
];

const NEED_TYPE_WITH_RESET: SelectItem[] = [
    {
        label: '---',
        value: RESET,
    },
    ...NEED_TYPE,
];

interface PlaceResetItem {
    id: 'RESET',
    label: string
}

const isPlaceResetItem = (p: PlaceResetItem | PlaceItem | null): p is PlaceResetItem => {
    return p?.id === 'RESET';
};

const PLACE_RESET: PlaceResetItem = {
    id: 'RESET',
    label: '---',
};

const unitToLabel: Record<NeedUnit, string> = {
    [NeedUnit.h]: 'godzina',
    [NeedUnit.kg]: 'kilogram',
    [NeedUnit.l]: 'litr',
    [NeedUnit.piece]: 'sztuka',
    [NeedUnit.human]: 'wolontariusz',
};

function usePagination(itemsPerPage: number) {
    const [itemsCount, setItemsCount] = useState<number>(0);
    const pagesCount = Math.ceil(itemsCount / itemsPerPage);
    const [pageNumber, setPageNumber] = useState<number>(1);

    return {
        pageNumber,
        pagesCount,
        rangeFrom: (pageNumber - 1) * itemsPerPage,
        rangeTo: ((pageNumber - 1) * itemsPerPage) + itemsPerPage,
        itemsPerPage,
        setItemsCount(count: number) {
            setItemsCount(count);
        },
        setPage(p: number) {
            setPageNumber(p);
        },
        next() {
            if (pageNumber >= pagesCount)
                return;

            setPageNumber(p => p + 1);
        },
        prev() {
            if (pageNumber <= 0)
                return;

            setPageNumber(p => p - 1);
        },
    };
}

const getStoredValue = (): boolean => {
    return window.localStorage.getItem('infoHidden') === 'true';
};

const saveValueToStore = () => {
    window.localStorage.setItem('infoHidden', 'true');
};

export const ListNeeds: FunctionComponent<ListNeedsProps> = () => {
    const places = useAtomValue(placesAtom);
    const [status, setStatus] = useState<NeedStatus | 'RESET'>(NeedStatus.active);
    const [place, setPlace] = useState<PlaceItem | PlaceResetItem | null>(PLACE_RESET);
    const [priority, setPriority] = useState<NeedPriority | 'RESET'>();
    const [type, setType] = useState<NeedType | 'RESET'>();
    const [city, setCity] = useState<string>();
    const auth = useAuth();
    const navigate = useNavigate();
    const [infoHidden, setInfoHidden] = useState<boolean>(getStoredValue());

    const {
        pagesCount,
        rangeFrom,
        rangeTo,
        setPage,
        setItemsCount,
    } = usePagination(15);

    const placesWithReset = useMemo(() => {
        return [PLACE_RESET, ...places];
    }, [places]);

    const filter = useFilter(
        (query) => {
            let q = query;

            if (status && status !== 'RESET') {
                q = query.eq('status', status);
            }

            if (place && !isPlaceResetItem(place)) {
                q = q.eq('organization_unit_id', place?.id);
            }

            if (priority && priority !== RESET) {
                q = q.eq('priority', priority);
            }

            if (city && city !== RESET) {
                q = q.eq('city', city);
            }

            if (type && type !== RESET) {
                q = q.eq('type', type);
            }

            q.range(rangeFrom, rangeTo - 1);

            q.order('created_at', {
                ascending: false,
            });

            q.select('*, profile:creator_id (confirmed)');

            return q;
        },
        [status, place, priority, rangeFrom, rangeTo, city, type],
    );

    const [{ data, fetching, count }] = useSelect<NeedWithRelations>('need', {
        filter,
        options: {
            count: 'exact',
        },
    });

    useEffect(() => {
        if (count === undefined || count === null)
            return;

        setItemsCount(count);
    }, [count]);

    useMemo(() => {

    }, [status, place, priority]);

    const handlePlaceChange = (ev: SyntheticEvent, newVal: PlaceItem | PlaceResetItem | null) => {
        setPlace(newVal);
    };

    const handlePlaceReset = () => {
        setPlace(PLACE_RESET);
    };

    const handleStatusChange = (event: SelectChangeEvent) => {
        setStatus(event.target.value as NeedStatus);
    };

    const handlePriorityChange = (event: SelectChangeEvent) => {
        setPriority(event.target.value as NeedPriority);
    };

    const handleTypeChange = (event: SelectChangeEvent) => {
        setType(event.target.value as NeedType);
    };

    const handleCityChange = (event: SelectChangeEvent) => {
        setCity(event.target.value as string);
    };

    const handlePageChange = (event: ChangeEvent<any>, pageNumber: number) => {
        setPage(pageNumber);
    };

    return (
        <>
            {!infoHidden &&
                <Alert variant='standard' color='info' onClose={() => {
                    saveValueToStore();
                    setInfoHidden(true);
                }}>
                    <InfoText />
                </Alert>
            }
            <Grid container paddingY={4} marginTop={2} justifyContent='end' alignItems='center'>
                <Grid item flexGrow={1}>
                    <Typography variant='h6'>
                        Filtry
                    </Typography>
                </Grid>
                {
                    auth.isAuthenticated() &&
                    <Grid item>
                        <Button variant='contained' component='a' href='#/need/create'>Dodaj nową potrzebę</Button>
                    </Grid>
                }
            </Grid>
            <Grid container spacing={4}>
                <Grid item sm={6} xs={12}>
                    <Autocomplete
                        disablePortal
                        options={placesWithReset}
                        fullWidth
                        // @ts-ignore
                        value={place}
                        onChange={handlePlaceChange}
                        onReset={handlePlaceReset}
                        disabled={fetching}
                        renderInput={(params) => <TextField variant='filled' {...params} label='Miejsce' />}
                    />
                </Grid>
                <Grid item sm={6} xs={12}>
                    <FormControl fullWidth variant='filled'>
                        <InputLabel id='status-select-label'>Status</InputLabel>
                        <Select
                            labelId='status-select-label'
                            id='status-select'
                            value={status}
                            label='Status'
                            onChange={handleStatusChange}
                            disabled={fetching}
                        >
                            {NEED_STATUSES.map(s => (
                                <MenuItem value={s.value} key={s.value}>{s.label}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item sm={6} xs={12}>
                    <FormControl fullWidth variant='filled'>
                        <InputLabel id='type-select-label'>Typ</InputLabel>
                        <Select
                            labelId='type-select-label'
                            id='type-select'
                            value={type}
                            label='Typ'
                            onChange={handleTypeChange}
                            disabled={fetching}
                        >
                            {NEED_TYPE_WITH_RESET.map(s => (
                                <MenuItem value={s.value} key={s.value}>{s.label}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item sm={6} xs={12}>
                    <FormControl fullWidth variant='filled'>
                        <InputLabel id='priority-select-label'>Priorytet</InputLabel>
                        <Select
                            labelId='priority-select-label'
                            id='priority-select'
                            value={priority}
                            label='Priorytet'
                            onChange={handlePriorityChange}
                            disabled={fetching}
                        >
                            {PRIORITIES.map(s => (
                                <MenuItem value={s.value} key={s.value}>{s.label}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
            <Typography variant='h5' marginTop={4}>
                Lista potrzeb
            </Typography>
            <List>
                {data?.map((need) => {
                    const Icon = getIcon(need.quantity, need.supplied);

                    return (
                        <ListItem
                            disablePadding
                            key={need.id}
                            secondaryAction={
                                auth.canEdit(need) &&
                                <>
                                    <IconButton edge='end' aria-label='edit' component='a'
                                                href={`#/need/edit/${need.id}`}>
                                        <EditIcon />
                                    </IconButton>
                                </>
                            }
                        >
                            <ListItemButton component='a' href={`#/need/${need.id}`}>
                                <ListItemIcon>
                                    <Tooltip title={`Zebrano ${Math.round((need.supplied/need.quantity)*100)}%`}>
                                        <Icon color={PRIORITY_TO_COLOR[need.priority]} fontSize='large' />
                                    </Tooltip>
                                </ListItemIcon>
                                <ListItemText
                                    primary={<>
                                        <ProfileNameWithTrustIcon trusted={need.profile.confirmed} variant='need'>
                                            {need.name}
                                        </ProfileNameWithTrustIcon>
                                    </>}
                                    secondary={(
                                        <>
                                            Dostarczono <strong>{need.supplied}</strong> z <strong>{need.quantity}</strong>
                                            {
                                                need.quantity - need.supplied > 0 &&
                                                <>
                                                    &nbsp;brakuje
                                                    jescze <strong>{need.quantity - need.supplied}</strong> [{unitToLabel[need.unit]}]
                                                </>
                                            }
                                            <br />
                                            {
                                                need.start_date && (<>
                                                    Start
                                                    zbiórki: <strong>{dayjs(need.start_date).format('DD.MM.YYYY HH:mm')}</strong>
                                                </>)
                                            }

                                            {
                                                need.end_date && (<>
                                                    &nbsp;Zakończenie
                                                    zbiórki: <strong>{dayjs(need.end_date).format('DD.MM.YYYY HH:mm')}</strong>
                                                </>)
                                            }
                                        </>
                                    )}
                                />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
            <Grid container justifyContent='center' paddingY={4}>
                <Grid item>
                    <Pagination count={pagesCount} color='primary' onChange={handlePageChange} disabled={fetching} />
                </Grid>
            </Grid>
        </>
    );
};
