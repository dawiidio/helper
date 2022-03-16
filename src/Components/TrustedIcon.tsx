import React, { FunctionComponent } from 'react';
import SecurityIcon from '@mui/icons-material/Security';
import { Tooltip } from '@mui/material';

interface TrustedIconProps {
    trusted?: boolean
}

export const TrustedIcon: FunctionComponent<TrustedIconProps> = ({ trusted }) => {
    if (!trusted)
        return null;

    return (
        <Tooltip title='Ten użytkownik został zatwierdzony jako zaufany'>
            <SecurityIcon fontSize={'small'} color={'primary'} />
        </Tooltip>
    );
};
