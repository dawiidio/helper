import React, { FunctionComponent } from 'react';
import { InfoText } from '../Components/InfoText';

interface AboutProps {

}

export const About: FunctionComponent<AboutProps> = ({}) => {

    return (
        <InfoText fullVersion />
    );
};
