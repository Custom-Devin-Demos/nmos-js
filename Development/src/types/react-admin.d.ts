// Augment react-admin types for v3 compatibility
// react-admin v3 has its own type definitions but they're incomplete
// This fills in gaps for the specific APIs used in nmos-js

import 'react-admin';

declare module 'react-admin' {
    export const GET_LIST: string;
    export const GET_ONE: string;
    export const GET_MANY: string;
    export const GET_MANY_REFERENCE: string;
    export const CREATE: string;
    export const UPDATE: string;
    export const DELETE: string;

    export const fetchUtils: {
        fetchJson: (
            url: string,
            options?: Record<string, unknown>
        ) => Promise<{
            status: number;
            headers: Headers;
            body: string;
            json: any;
        }>;
        queryParameters: (data: Record<string, string>) => string;
    };
}
