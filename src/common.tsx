import { FieldErrors } from 'react-hook-form/dist/types/errors';
import { useState } from 'react';
import { AlertColor } from '@mui/material/Alert/Alert';
import { Place } from './Domain/Place';
import { setLocale } from 'yup';

export function getFieldError<T>(field: keyof T, errors: FieldErrors<T>): string | undefined {
    // @ts-ignore
    return errors[field]?.message;
}

export const redirectSpecialAuthorizedLinks = () => {
    const search = new URLSearchParams(window.location.hash.replace('#', '?'));

    if (search.get('type') === 'recovery') {
        // @ts-ignore
        window.__TEMP_JWT = search.get('access_token');
        window.location.hash = '/password-recovery';
    }
    else if (search.get('type') === 'invite') {
        // @ts-ignore
        window.__TEMP_JWT = search.get('access_token');
        window.location.hash = '/profile/create';
    }
};

export interface FormAlertData {
    title?: string;
    message: string;
    type?: AlertColor;
}

export const useFormAlert = () => {
    return useState<FormAlertData>();
};

export const getRandomId = () => Math.round(Math.random() * 10000);

export function getDefaultValueFromModel<T extends object, Y = any>(model: T|undefined, keyName: keyof T): Y | string {
    if (model && model.hasOwnProperty(keyName)) {
        return model[keyName] as unknown as Y;
    }

    return '';
}

export function removeTimezone(date: string | undefined): string | undefined {
    return date?.replace(/\+\d\d:\d\d/, '');
}

export function createGoogleMapsLinkForPlace(place: Place) {
    const e = encodeURIComponent;
    const query = `${e(place.name)}+${e(place.city)}+${e(place.postalCode)}+${e(place.addressLine1)}+${e(place.addressLine2 ?? '')}`;

    return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

export const setYupLocale = () => {
  setLocale({
      mixed: {
          required: 'pole "${path}" jest wymagane',
      },
      string: {
          min: (params) => `minimalna liczba znaków w polu to ${params.min}`,
          max: (params) => `maksymalna liczba znaków w polu to ${params.max}`,
          email: `pole musi być poprawnym adresem email`,
      }
  })
}
