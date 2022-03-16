import { SelectItem } from '../Components/Form/SelectItem';
import { Profile } from './Profile';

export enum PlaceStatus {
    test = 'test',
    active = 'active',
    disabled = 'disabled',
}

export interface Place {
    id: number;
    status: PlaceStatus;
    name: string;
    created_at: string;
    organization_name: string | null;
    phone: string | null;
    description: string | null;
    creator_id: string;
    city: string;
    addressLine1: string;
    addressLine2: string | null;
    postalCode: string;
}

export interface PlaceWithRelations extends Place {
    profile: Profile
}

export interface PlaceWithLabel extends Place {
    label: string;
}

export const PLACE_STATUSES: SelectItem[] = [
    {
        value: PlaceStatus.active,
        label: 'Aktywny',
    },
    {
        value: PlaceStatus.disabled,
        label: 'Nieaktywny',
    },
];
