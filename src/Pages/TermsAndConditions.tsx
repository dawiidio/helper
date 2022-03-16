import React, { FunctionComponent } from 'react';
import { Typography } from '@mui/material';

interface TermsAndConditionsProps {

}

export const TermsAndConditions: FunctionComponent<TermsAndConditionsProps> = () => {

    return (
        <>
            <Typography variant='body1'>
                Twórcy aplikacji Helper nie ponoszą odpowiedzialności za treść ogłoszeń oraz za ewentualnie wyrządzone przez nie szkody.
                Aplikacja jest platformą z darmowymi ogłoszeniami niekomercyjnymi.
                Twórcy nie prowadzą weryfikacji użytkowników dlatego przed udziałem w zbiórce użytkownik powinien upewnić się co do jej słuszności.

                <br/>
                Dalej w tekście określenia "Ogłoszenie" i "zbiórka" są stosowane zamiennie i odnoszą się do wpisów dodawanych przez użytkownika w aplikacji Helper
                <br/>
                <br/>
                Użytkownicy zarejestrowani jako wolontariusze oraz przeglądający ogłoszenia w aplikacji zobowiązują się do:

                <ul>
                    <ol><strong>1.</strong> należytego sprawdzania zbiórek przed wzięciem w nich udziału oraz przed ich dodaniem</ol>
                    <ol><strong>2.</strong> zgłaszania nieprawidłowych zbiórek, miejsc, organizacji oraz błędów w działaniu aplikacji na email: wolontariathelper@gmail.com</ol>
                    <ol><strong>3.</strong> niedodawania zbiórek w celach zarobkowych, dozwolone są tylko zbiórki realizujące cele pomocy humanitarnej oraz pomocy zwierzętom</ol>
                    <ol><strong>4.</strong> niedodawania ogłoszeń bazujących na zbieraniu: pieniędzy w jakiejkolwiek walucie, metali szlachetnych, broni i materiałów wybuchowych, używek, narkotyków oraz leków na receptę. Dozwolone są tylko ogłoszenia związane z przekazywaniem rzeczy, pożywienia lub wykonywaniem usług z czego wykluczyć należy usługi o charakterze seksualnym</ol>
                    <ol><strong>5.</strong> zachowania należytej staranności podczas dodawania ogłoszeń aby te były zgodne z niniejszym regulaminem, były opisane w sposób jasny i zrozumiały dla innych oraz zawierały informacje i aktualne dane kontaktowe do organizatorów pozwalające na weryfikację zbiórki</ol>
                    <ol><strong>6.</strong> aktualizowania na bieżąco swoich zbiórek tak aby oddawały one jak najlepiej stan rzeczywisty otrzymanego wsparcia</ol>
                </ul>
            </Typography>
        </>
    );
};
