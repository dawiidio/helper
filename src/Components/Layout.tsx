import Container from '@mui/material/Container';
import React, { FunctionComponent, Suspense } from 'react';
import {
    AppBar,
    Box,
    Button,
    Grid,
    IconButton,
    Menu,
    MenuItem,
    Toolbar,
    Typography,
    Link,
    Tooltip, Avatar,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Store/auth';
import MenuIcon from '@mui/icons-material/Menu';

interface LayoutProps {
    center?: boolean;
}

const LINKS = [
    {
        path: '/places',
        label: 'Miejsca',
    },
    {
        path: '/about',
        label: 'Informacje',
    },
    {
        path: '/terms-and-conditions',
        label: 'Regulamin',
    },
];

const USER_MENU = [
    // {
    //     path: '/profile/view',
    //     label: 'Mój profil'
    // },
    {
        path: '/profile/edit',
        label: 'Edytuj profil'
    },
    {
        path: 'logout',
        label: 'Wyloguj'
    },
];

export const Layout: FunctionComponent<LayoutProps> = ({ children, center }) => {
    const navigate = useNavigate();
    const auth = useAuth();
    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = (path: string) => {
        if (path === 'logout') {
            auth.logout();
            return;
        }

        navigate(path);
        setAnchorElUser(null);
    };

    const handleCloseNavMenu = (path: string) => {
        navigate(path);
        setAnchorElNav(null);
    };

    const c = center ? (
        <Container maxWidth='md'>
            <Grid container height='100vh' alignItems='center'>
                <Grid item xs={12}>
                    {children}
                </Grid>
            </Grid>
        </Container>
    ) : (
        <>
            <AppBar position='static'>
                <Container maxWidth='md'>
                    <Toolbar disableGutters>
                        <Typography
                            variant='h6'
                            noWrap
                            component='a'
                            href='#/'
                            color='#fff'
                            sx={{ mr: 2, display: { xs: 'none', md: 'flex', textDecoration: 'none' } }}
                        >
                            Helper 🇺🇦
                        </Typography>
                        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                            <IconButton
                                size='large'
                                aria-label='account of current user'
                                aria-controls='menu-appbar'
                                aria-haspopup='true'
                                onClick={handleOpenNavMenu}
                                color='inherit'
                            >
                                <MenuIcon />
                            </IconButton>
                            <Menu
                                id='menu-appbar'
                                anchorEl={anchorElNav}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                open={Boolean(anchorElNav)}
                                onClose={handleCloseNavMenu}
                                sx={{
                                    display: { xs: 'block', md: 'none' },
                                }}
                            >
                                {LINKS.map(l => (
                                    <MenuItem onClick={() => handleCloseNavMenu(l.path)} key={l.path}>
                                        <Typography textAlign='center'>{l.label}</Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>
                        <Typography
                            variant='h6'
                            noWrap
                            component='a'
                            href='#/'
                            color='#fff'
                            sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none', textDecoration: 'none' } }}
                        >
                            Helper 🇺🇦
                        </Typography>
                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                            {LINKS.map(l => (
                                <Button
                                    href={'#' + l.path}
                                    key={l.path}
                                    sx={{ my: 2, color: 'white', display: 'block' }}
                                >
                                    {l.label}
                                </Button>
                            ))}
                        </Box>
                        <Box sx={{ flexGrow: 0 }}>
                            {
                                auth.isAuthenticated()
                                    ? (
                                        <Box sx={{ flexGrow: 0 }}>
                                            <Tooltip title="Otwórz menu użytkownika">
                                                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                                    <Avatar alt="Remy Sharp" />
                                                </IconButton>
                                            </Tooltip>
                                            <Menu
                                                sx={{ mt: '45px' }}
                                                id="menu-appbar"
                                                anchorEl={anchorElUser}
                                                anchorOrigin={{
                                                    vertical: 'top',
                                                    horizontal: 'right',
                                                }}
                                                keepMounted
                                                transformOrigin={{
                                                    vertical: 'top',
                                                    horizontal: 'right',
                                                }}
                                                open={Boolean(anchorElUser)}
                                                onClose={handleCloseUserMenu}
                                            >
                                                <MenuItem key='email' disabled>
                                                    <Typography textAlign="center">{auth.user?.email}</Typography>
                                                </MenuItem>
                                                {USER_MENU.map((item) => (
                                                    <MenuItem key={item.path} onClick={() => handleCloseUserMenu(item.path)}>
                                                        <Typography textAlign="center">{item.label}</Typography>
                                                    </MenuItem>
                                                ))}
                                            </Menu>
                                        </Box>
                                    )
                                    : <Button color='inherit' onClick={() => navigate('/login')}>Login</Button>
                            }
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
            <Container maxWidth='md'>
                <Box marginY={4} paddingX={2}>
                    <Suspense fallback='Loading...'>
                        {children}
                    </Suspense>
                </Box>
            </Container>
        </>
    );

    return (
        <Box minHeight='100vh'>
            {c}
        </Box>
    );
};
