// Authentication type definitions

export interface BearerToken {
    access_token: string;
    refresh_token: string;
    id_token?: string;
    expires_in: number;
    token_type: string;
}

export interface UserIdentity {
    id: string;
    fullName: string;
    avatar: string;
}

export interface UserInfo {
    sub: string;
    name?: string;
    preferred_username?: string;
}

export interface AuthSettings {
    client_id: string;
    server_metadata_endpoint: string;
    redirect_uri: string;
    scope: string;
}

export interface ServerMetadata {
    authorization_endpoint: string;
    token_endpoint: string;
    userinfo_endpoint?: string;
    revocation_endpoint?: string;
    end_session_endpoint?: string;
    [key: string]: unknown;
}

export interface AuthProvider {
    login: () => Promise<void>;
    checkError: (error: { status: number }) => Promise<void>;
    checkAuth: () => Promise<void>;
    logout: () => Promise<void>;
    getIdentity: () => Promise<UserIdentity | null>;
    getPermissions: () => Promise<string>;
}
