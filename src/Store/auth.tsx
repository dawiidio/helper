import { atom, useAtom, useAtomValue } from 'jotai';
import { User, UserAttributes, Session } from '@supabase/supabase-js';
import { supabase } from '../supbaseClient';

interface AuthData {
    user: User | null;
    session: Session | null;
}


interface EntityWithCreatorId {
    creator_id: string
}

export const authAtom = atom<AuthData>({
    user: supabase.auth.session()?.user ?? null,
    session: supabase.auth.session() ?? null,
});

export function useAuth() {
    const [auth, setAuth] = useAtom(authAtom);

    return {
        ...auth,
        isAuthenticated() {
            return Boolean(this.session);
        },
        isFulfilled(): boolean {
            return Boolean(auth.user?.user_metadata.fulfilled);
        },
        canEdit(entity: EntityWithCreatorId) {
            return this.isAuthenticated() && auth.user?.id === entity.creator_id;
        },
        logout() {
            supabase.auth.signOut();
        }
    };
}
