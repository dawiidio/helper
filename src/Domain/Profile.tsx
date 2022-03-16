export interface Profile {
    id: string;
    name: string | null;
    surname: string | null;
    phone: string | null;
    email: string | null;
    confirmed: boolean;
    is_organisation: boolean;
}
