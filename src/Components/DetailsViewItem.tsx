import React, { FC } from 'react';
import { Grid, Typography } from '@mui/material';

export interface DetailsViewItemProps {
    title: string
}

export const DetailsViewItem: FC<DetailsViewItemProps> = ({
                                                       title,
                                                       children,
                                                   }) => {

    return (
        <Grid xs={12} marginY={2}>
            <Grid container rowSpacing={2}>
                <Grid xs={12} md={3} textAlign={{ xs: 'left', md: 'right' }} paddingX={2} paddingY={1}>
                    <Typography variant='body1' fontWeight={'bold'}>
                        {title}:
                    </Typography>
                </Grid>
                <Grid xs={12} md={9} bgcolor={'aliceblue'} paddingX={2} paddingY={1}>
                    <Typography variant='body1'>
                        {children}
                    </Typography>
                </Grid>
            </Grid>
        </Grid>
    )
};
