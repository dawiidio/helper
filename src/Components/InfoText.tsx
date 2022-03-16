import React, { FunctionComponent } from 'react';
import { Box, Button, Typography } from '@mui/material';

interface InfoTextProps {
    fullVersion?: boolean
}

export const InfoText: FunctionComponent<InfoTextProps> = ({ fullVersion }) => {

    return (
        <>
            <Typography variant='h6' marginY={0} paddingY={0} lineHeight={1}>
                Witaj!
            </Typography>
            <Typography variant='body1' marginY={2}>
                Dziękuję za zainteresowanie Helperem. Jest to bardzo młody projekt ponieważ powstał w marcu 2022r,
                w odpowiedzi na rosnącą liczbę uchodźców z Ukrainy w Polsce oraz chęć niesienia im pomocy
                przez
                społeczeństwo, koordynacja takich działań jest rzeczą niesłychanie trudną dlatego chciałbym aby Helper
                służył
                wolontariuszom, działającym w ramach organizacji jak i na własną rękę, do zgłaszania potrzeb i komunikacji z darczyńcami. (<i>określenia "zbiórka" i "potrzeba" są używane w systemie zamiennie</i>).
                <br /><br />
                W tej chwili odbywa się to przez dodawanie placówek i potem w ich ramach potrzeb które wyświetlają
                się na stronie głównej, potrzeby można aktualizować na bieżąco tak aby komunikować osobom chcącym pomóc,
                że np. nie potrzebujemy już naleśników ale brakuje kocy itd.
                <br /><br />
                Teraz dużo takiej komunikacji odbywa się przez FB, pocztę pantoflową lub pliki, lecz taki system
                szybko się dezaktualizuje i prowadzi do nieporozumień dlatego chciałbym aby Helper służył jako
                centrala do zgłaszania potrzeb która będzie aktualizowana na bieżąco przez wolontariuszy
                <br /><br />
            </Typography>
            <Typography variant='subtitle2' marginY={0} paddingY={0} lineHeight={1}>
                Zgłaszanie wolontariuszy
            </Typography>
            <Typography variant='body1' marginY={1}>
                Przez to, że Helper jest we wczesnej fazie rozwoju nie obsługujemy jeszcze rejestracji wszystkich użytkowników
                dlatego jeśli chcesz zgłosić się jako wolontariusz wyślij wiadomość na email
                <a href='mailto:wolontariathelper@gmail.com'> wolontariathelper@gmail.com</a>
                , napisz podstawowe info o sobie i swoich zbiórkach a także czy działasz sam czy w ramach organizacji,
                w odpowiedzi na Twojego maila dostaniesz na podany email zaproszenie do rejestracji w systemie, zazwyczaj trwa
                to kilka godzin ale maksymlanie może wydłużyć się do 24h. Po rejestracji dostaniesz dostęp do
                dodania swojego punktu i nowych zbiórek
            </Typography>
            {
                !fullVersion && (
                    <Box textAlign='right'>
                    <Button component='a' href='#/about'>czytaj więcej</Button>
                    </Box>
                )
            }
            {
                fullVersion && (
                    <>
                        <Typography variant='subtitle2' marginY={1} marginTop={3} paddingY={0} lineHeight={1}>
                            Dalszy rozwój
                        </Typography>
                        <Typography variant='body1' marginY={1}>
                            Helper powstaje w wolnym czasie, na pewno zawiera błędy i mnóstwo miejsca na nowe funkcjonalności,
                            jeśli znajdziesz buga lub chciałbyś pomóc w rozwoju to pisz na powyższego maila :)
                            Myślę, że w przyszłości Helper mógłby być używany także przez organizacje wspierające osoby w kryzysie
                            bezdomności lub schroniska dla zwierząt
                        </Typography>
                        <Typography variant='subtitle2' marginY={0} paddingTop={2} lineHeight={1}>
                            Przydatne linki
                        </Typography>
                        <Typography variant='body1' marginY={1}>
                            Helper rozwijany jest na zasadach Open Source Software (OSS) i bazuje na licencji Apache v2.0, link do repozytorium kodu źródłowego: <a href="https://github.com/dawiidio/helper" rel='noreferrer'>https://github.com/dawiidio/helper</a>
                        </Typography>
                    </>
                )
            }
        </>
    );
};
