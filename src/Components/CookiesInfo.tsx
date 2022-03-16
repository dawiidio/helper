import React, { FunctionComponent, useState } from 'react';
import { Box, Button, Container, Grid, Typography } from '@mui/material';

interface CookiesInfoProps {

}

const KEY = 'cookies';

export const CookiesInfo: FunctionComponent<CookiesInfoProps> = ({}) => {
    const [hidden, setHidden] = useState<boolean>(localStorage.getItem(KEY) === 'hidden');

    if (hidden)
        return null;

    const handleHide = () => {
        localStorage.setItem(KEY, 'hidden');
        setHidden(true);
    };

    return (
        <Box position='fixed' bottom={0} width='100%' padding={1} bgcolor={'#0071ce'} left={0} zIndex={100} boxSizing={'border-box'}>
            <Container maxWidth='md'>
                <Grid container alignItems={'center'}>
                    <Grid item flexGrow={1}>
                        <Typography variant='body1' color='white'>
                            Helper używa plików cookies aby zapewnić płynne działanie aplikacji
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Button onClick={handleHide} variant='contained' color={'secondary'}>
                            Rozumiem
                        </Button>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};
