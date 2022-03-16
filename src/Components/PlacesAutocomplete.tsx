import React, { FunctionComponent } from "react";
import { useAtomValue } from 'jotai';
import { placesAtom } from '../Store/place';

interface PlacesAutocompleteProps {

}

export const PlacesAutocomplete:FunctionComponent<PlacesAutocompleteProps> = ({  }) => {
    const places = useAtomValue(placesAtom);

    return (
        <>
            PlacesAutocomplete
        </>
    )
};
