import React, { FunctionComponent, useMemo, useState } from 'react';
import {
    Alert,
    Box,
    Button,
    FormControl,
    Grid,
    IconButton, InputLabel,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    MenuItem,
    Select,
    SelectChangeEvent, Tooltip, Typography,
} from '@mui/material';
import { useAuth } from '../../Store/auth';
import { useAtom } from 'jotai';
import { placesAtom } from '../../Store/place';
import { useNavigate } from 'react-router-dom';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import MapIcon from '@mui/icons-material/Map';
import { Place, PlaceStatus, PlaceWithLabel } from '../../Domain/Place';
import LocationSearchingIcon from '@mui/icons-material/LocationSearching';
import EditIcon from '@mui/icons-material/Edit';
import { CITIES, City } from '../../Domain/City';
import { createGoogleMapsLinkForPlace } from '../../common';

interface ListPlacesProps {

}

const CITY_RESET: City = {
    value: 'RESET',
    label: '---',
};

const CITIES_WITH_RESET = [
    CITY_RESET,
    ...CITIES,
];

export const ListPlaces: FunctionComponent<ListPlacesProps> = ({}) => {
    const auth = useAuth();
    const [places] = useAtom(placesAtom);
    const [city, setCity] = useState<string>('RESET');

    const handleCityChange = (event: SelectChangeEvent) => {
        setCity(event.target.value as string);
    };

    const filteredPlaces = useMemo<PlaceWithLabel[]>(() => {
        if (city && city !== 'RESET') {
            return places.filter(p => p.city === city);
        }

        return places;
    }, [city, places]);

    return (
        <>
            <Grid container paddingY={4} marginTop={2} justifyContent='end' alignItems='center'>
                <Grid item flexGrow={1}>
                    <Typography variant='h6'>
                        Filtry
                    </Typography>
                </Grid>
                {
                    auth.isAuthenticated() &&
                    <Grid item>
                        <Button variant='contained' component='a' href='#/place/add'>Dodaj nowe miejsce</Button>
                    </Grid>
                }
            </Grid>
            <Grid container spacing={4}>
                <Grid item sm={6} xs={12}>
                    <FormControl fullWidth variant='filled'>
                        <InputLabel id='city-select-label'>Miasto</InputLabel>
                        <Select
                            labelId='city-select-label'
                            id='city-select'
                            value={city}
                            label='Miasto'
                            onChange={handleCityChange}
                        >
                            {CITIES_WITH_RESET.map(s => (
                                <MenuItem value={s.value} key={s.value}>{s.label}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
            <Box marginY={3}>
                <Typography variant='h5'>
                    Lista miejsc
                </Typography>
            </Box>
            <List>
                {filteredPlaces?.map((place) => {
                    return (
                        <ListItem
                            disablePadding
                            key={place.id}
                            secondaryAction={
                                <>
                                    {auth.canEdit(place) &&
                                        <IconButton edge='end' aria-label='edit' component='a'
                                                    href={`#/place/edit/${place.id}`}>
                                            <EditIcon />
                                        </IconButton>
                                    }
                                    <Tooltip title={'Otwórz w mapach Google'}>
                                        <IconButton edge='end' aria-label='edit' component='a'
                                                    target='_blank'
                                                    href={createGoogleMapsLinkForPlace(place)}>
                                            <MapIcon />
                                        </IconButton>
                                    </Tooltip>
                                </>
                            }
                        >
                            <ListItemButton component='a' href={`#/place/${place.id}`}>
                                <ListItemIcon>
                                    {
                                        place.status === PlaceStatus.disabled
                                            ? <LocationSearchingIcon fontSize='large' />
                                            : <MyLocationIcon fontSize='large' />
                                    }
                                </ListItemIcon>
                                <ListItemText
                                    primary={place.name}
                                    secondary={(
                                        <>
                                            {place.city} {place.postalCode}, {place.addressLine1} {place.addressLine2 ?? ''}
                                            <br/>
                                            {place.organization_name && <>Organizacja prowadząca: <strong>{place.organization_name}</strong></>}
                                        </>
                                    )}
                                />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
        </>
    );
};
