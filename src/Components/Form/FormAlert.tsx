import React, { FunctionComponent } from 'react';
import { FormAlertData } from '../../common';
import { Alert, AlertTitle, Box } from '@mui/material';

interface FormAlertProps {
    formAlert: FormAlertData | undefined;
}

export const FormAlert: FunctionComponent<FormAlertProps> = ({ formAlert }) => {
    return formAlert ? (
        <Box marginY={2}>
            <Alert severity={formAlert.type || 'error'}>
                {formAlert.title && <AlertTitle>{formAlert.title}</AlertTitle>}
                {formAlert.message}
            </Alert>
        </Box>
    ) : null;
};
