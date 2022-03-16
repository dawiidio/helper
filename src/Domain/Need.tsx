import { SelectItem } from '../Components/Form/SelectItem';
import { Profile } from './Profile';
import { Place } from './Place';

export enum NeedStatus {
    active = 'active',
    disabled = 'disabled',
    outdated = 'outdated',
    waiting = 'waiting',
    refill = 'refill',
}

export enum NeedUnit {
    piece = 'piece',
    kg = 'kg',
    l = 'l',
    h = 'h',
    human = 'human',
}

export enum NeedPriority {
    high = 'high',
    medium = 'medium',
    low = 'low',
}

export enum NeedType {
    food = 'food',
    transport = 'transport',
    volunteering = 'volunteering',
    other = 'other'
}

export interface Need {
    id: number;
    organization_unit_id: number;
    created_at: string;
    creator_id: string;
    organizer_name: string;
    organizer_phone: string;
    organizer_email: string;
    description: string;
    end_date: string | null;
    name: string;
    quantity: number;
    supplied: number;
    start_date: string | null;
    updated_at: string;
    status: NeedStatus;
    unit: NeedUnit;
    priority: NeedPriority;
    type: NeedType;
}

export interface NeedWithRelations extends Need {
    profile: Profile
    place: Place
}

export const NEED_STATUSES: SelectItem[] = [
    {
        label: 'Aktywne',
        value: NeedStatus.active,
    },
    {
        label: 'Nieaktywne',
        value: NeedStatus.disabled,
    },
    {
        label: 'Przedawnione',
        value: NeedStatus.outdated,
        disabled: true
    },
    {
        label: 'Oczekujące',
        value: NeedStatus.waiting,
        disabled: true
    },
];

export const NEED_UNITS: SelectItem[] = [
    {
        label: 'Litry',
        value: NeedUnit.l,
    },
    {
        label: 'Sztuki',
        value: NeedUnit.piece,
    },
    {
        label: 'Kilogramy',
        value: NeedUnit.kg,
    },
    {
        label: 'Godziny',
        value: NeedUnit.h,
    },
    {
        label: 'Człowiek',
        value: NeedUnit.human,
    },
];

export const NEED_PRIORITY: SelectItem[] = [
    {
        label: 'Niski',
        value: NeedPriority.low,
    },
    {
        label: 'Średni',
        value: NeedPriority.medium,
    },
    {
        label: 'Wysoki',
        value: NeedPriority.high,
    },
];

export const NEED_TYPE: SelectItem[] = [
    {
        label: 'Inne',
        value: NeedType.other,
    },
    {
        label: 'Pożywienie',
        value: NeedType.food,
    },
    {
        label: 'Transport',
        value: NeedType.transport,
    },
    {
        label: 'Wolontariat',
        value: NeedType.volunteering,
    },
];

