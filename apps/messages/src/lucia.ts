import { lucia } from 'lucia';
import { web } from 'lucia/middleware';
import { d1 } from '@lucia-auth/adapter-sqlite';

export const initializeLucia = (db: D1Database) => {
    const auth = lucia({
        env: 'DEV',//'PROD',
        middleware: web(),
        sessionCookie: {
            expires: false
        },
        adapter: d1(db, {
            user: 'auth_user',
            key: 'auth_key',
            session: 'auth_session'
        }),
        getUserAttributes: (user) => {
            return {
                username: user.username,
            };
        },
    });
    return auth;
};

export type Auth = ReturnType<typeof initializeLucia>;
