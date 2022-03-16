import { atom } from 'jotai';
import { Place, PlaceWithLabel } from '../Domain/Place';
import { authAtom } from './auth';
import { supabase } from '../supbaseClient';


export const placesAtom = atom<Promise<PlaceWithLabel[]>>(
    async (get) => {
        const auth = get(authAtom);

        try {
            const response = await supabase.from<Place>('organization_unit').select('*');

            return response.data?.map<PlaceWithLabel>(p => ({ ...p, label: p.name })) ?? [];
        } catch {
            return [];
        }
    },
);
