import React  from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { Provider, useAuthStateChange } from 'react-supabase';
import { supabase } from './supbaseClient';
import { Provider as JotaiProvider, useSetAtom } from 'jotai';
import { RequireAuth } from './Components/RequireAuth';
import { Login } from './Pages/Login';
import { RouteLayout } from './Components/RouteLayout';
import { createTheme, ThemeProvider } from '@mui/material';
import { PasswordRecovery } from './Pages/PasswordRecovery';
import { redirectSpecialAuthorizedLinks } from './common';
import { AppNotification } from './Components/AppNotification/AppNotification';
import { authAtom } from './Store/auth';
import { ListNeeds } from './Pages/Needs/ListNeeds';
import { ViewNeed } from './Pages/Needs/ViewNeed';
import { ListPlaces } from './Pages/Places/ListPlaces';
import { EditPlace } from './Pages/Places/EditPlace';
import { EditNeed } from './Pages/Needs/EditNeed';
import { CreatePlace } from './Pages/Places/CreatePlace';
import { About } from './Pages/About';
import { CreateNeed } from './Pages/Needs/CreateNeed';
import { RequireProfileFulfill } from './Components/RequireProfileFulfill';
import { CreateProfile } from './Pages/Profile/CreateProfile';
import { ViewProfile } from './Pages/Profile/ViewProfile';
import { EditProfile } from './Pages/Profile/EditProfile';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { TermsAndConditions } from './Pages/TermsAndConditions';
import { ViewPlace } from './Pages/Places/ViewPlace';
import { CookiesInfo } from './Components/CookiesInfo';

dayjs.locale('pl');
dayjs.extend(utc);
dayjs.extend(timezone);

const theme = createTheme({
    palette: {
        primary: {
            main: '#0071ce',
        },
        secondary: {
            main: '#fcdf51',
        },
    },
});

redirectSpecialAuthorizedLinks();

function AuthListener(): null {
    const setAuth = useSetAtom(authAtom);

    useAuthStateChange((event, session) => {
        setAuth({
            session,
            user: session?.user ?? null,
        });
    });

    return null;
}

// @ts-ignore
ReactDOM.render(
    <React.StrictMode>
        <Provider value={supabase}>
            <JotaiProvider>
                <AuthListener />
                <ThemeProvider theme={theme}>
                    <AppNotification />
                    <CookiesInfo />
                    <HashRouter>
                        <Routes>
                            <Route path='/'>
                                <Route path='' element={<RequireProfileFulfill><RouteLayout /></RequireProfileFulfill>}>
                                    <Route path='' element={<ListNeeds />} />
                                    <Route path='about' element={<About />} />
                                    <Route path='places' element={<ListPlaces />} />
                                    <Route path='place/:id' element={<ViewPlace />} />
                                    <Route path='need/:id' element={<ViewNeed />} />
                                </Route>
                                <Route path='' element={<RouteLayout />}>
                                    <Route path='terms-and-conditions' element={<TermsAndConditions />} />
                                </Route>
                                <Route path='' element={<RequireAuth><RequireProfileFulfill><RouteLayout /></RequireProfileFulfill></RequireAuth>}>
                                    <Route path='place/edit/:id' element={<EditPlace />} />
                                    <Route path='place/add' element={<CreatePlace />} />
                                    <Route path='need/edit/:id' element={<EditNeed />} />
                                    <Route path='need/create' element={<CreateNeed />} />
                                    <Route path='profile/create' element={<CreateProfile />} />
                                    <Route path='profile/edit' element={<EditProfile />} />
                                    <Route path='profile/:id' element={<ViewProfile />} />
                                </Route>
                                <Route path='' element={<RequireAuth inverted><RouteLayout center /></RequireAuth>}>
                                    <Route path='login' element={<Login />} />
                                    <Route path='password-recovery' element={<PasswordRecovery />} />
                                </Route>
                            </Route>
                        </Routes>
                    </HashRouter>
                </ThemeProvider>
            </JotaiProvider>
        </Provider>
    </React.StrictMode>
    ,
    document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
