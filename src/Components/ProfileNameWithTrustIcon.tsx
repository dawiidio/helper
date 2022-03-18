import SecurityIcon from '@mui/icons-material/Security';
import React, { FunctionComponent } from 'react';
import { Grid, Tooltip } from '@mui/material';
import { SvgIconProps } from '@mui/material/SvgIcon/SvgIcon';

export type ProfileNameWithTrustIconVariant = 'need' | 'place' | 'profile';

interface ProfileNameWithTrustIconProps {
    trusted?: boolean;
    variant?: ProfileNameWithTrustIconVariant;
    color?: Pick<SvgIconProps, 'color'>['color'];
}

const messages: Record<ProfileNameWithTrustIconVariant, string> = {
    profile: 'Ten użytkownik został zatwierdzony jako zaufany',
    need: 'Ta potrzeba została dodana przez potwierdzonego użytkownika',
    place: 'Ten użytkownik został zatwierdzony jako zaufany',
};

export const ProfileNameWithTrustIcon: FunctionComponent<ProfileNameWithTrustIconProps> = ({
                                                                                               trusted,
                                                                                               children,
                                                                                               variant = 'profile',
                                                                                               color = 'primary',
                                                                                           }) => {
    return (
        <Grid container display='inline-flex'>
            <Grid item>
                {children}
            </Grid>
            {
                trusted && (
                    <Grid item paddingLeft={1}>
                        <Tooltip title={messages[variant]}>
                            <SecurityIcon fontSize={'small'} color={color} />
                        </Tooltip>
                    </Grid>
                )
            }
        </Grid>
    );
};
