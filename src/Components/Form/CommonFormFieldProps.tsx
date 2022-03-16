import { Control } from 'react-hook-form';
import { ReactNode } from 'react';

export interface CommonFormFieldProps {
    control: Control<any>;
    name: string;
    label: string|ReactNode;
    error?: string;
    requiredStar?: boolean
}
