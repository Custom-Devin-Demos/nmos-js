import React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { get, isEqual } from 'lodash';
import CONFIG from './config.json';

export const LOGGING_API = 'Logging API';
export const QUERY_API = 'Query API';
export const DNSSD_API = 'DNS-SD API';
export const AUTH_API = 'Authorization API';
export const USE_AUTH = 'Auth Enabled';

export const USE_RQL = 'RQL';
export const PAGING_LIMIT = 'Paging Limit';

export const FRIENDLY_PARAMETERS = 'Friendly Parameters';

export const CLIENT_ID = 'Client ID';

export const disabledSetting = (name: string) =>
    get(CONFIG, `${name}.disabled`);
export const hiddenSetting = (name: string) => get(CONFIG, `${name}.hidden`);

export const concatUrl = (url: string, path: string): string => {
    return (
        url + (url.endsWith('/') && path.startsWith('/') ? path.slice(1) : path)
    );
};

const defaultUrl = (api: string): string => {
    const configUrl = get(CONFIG, `${api}.value`);
    if (configUrl) {
        return configUrl;
    }
    let baseUrl = window.location.protocol + '//' + window.location.host;
    switch (api) {
        case LOGGING_API:
            return baseUrl + '/log/v1.0';
        case QUERY_API:
            return baseUrl + '/x-nmos/query/v1.3';
        case DNSSD_API:
            return baseUrl + '/x-dns-sd/v1.1';
        case AUTH_API:
            return baseUrl + '/.well-known/oauth-authorization-server';
        default:
            // not expected to be used
            return '';
    }
};

export const apiUrl = (api: string): string => {
    if (disabledSetting(api)) {
        return defaultUrl(api);
    }
    return window.localStorage.getItem(api) || defaultUrl(api);
};
// deprecated, see useSettingsContext()
export const setApiUrl = (api: string, url: string) => {
    if (disabledSetting(api)) {
        console.error(`Configuration does not allow ${api} to be changed`);
        return;
    }
    if (url && url !== defaultUrl(api)) {
        window.localStorage.setItem(api, url);
    } else {
        window.localStorage.removeItem(api);
    }
};

// version, e.g. 'v1.3', is always the last path component
export const apiVersion = (api: string): string =>
    (apiUrl(api).match(/([^/]+)\/?$/g) || [''])[0];

export const queryVersion = (): string => apiVersion(QUERY_API);

// single value, not per-API, right now
// default to 10 rather than leaving undefined and letting the API use its default,
// in order to simplify pagination with client-side filtered results
export const apiPagingLimit = (_api: string): number =>
    getJSONSetting(PAGING_LIMIT, 10);
// deprecated, see useSettingsContext()
export const setApiPagingLimit = (
    _api: string,
    pagingLimit: number | undefined
) => {
    if (typeof pagingLimit === 'number') {
        setJSONSetting(PAGING_LIMIT, pagingLimit);
    } else {
        unsetJSONSetting(PAGING_LIMIT);
    }
};

// single value, not per-API, right now
export const apiUsingRql = (_api: string): boolean =>
    getJSONSetting(USE_RQL, true);
// deprecated, see useSettingsContext()
export const setApiUsingRql = (_api: string, rql: boolean | undefined) => {
    if (typeof rql === 'boolean') {
        setJSONSetting(USE_RQL, rql);
    } else {
        unsetJSONSetting(USE_RQL);
    }
};

export const usingAuth = (): boolean => getJSONSetting(USE_AUTH, true);
export const setUsingAuth = (auth: boolean | undefined) => {
    if (typeof auth === 'boolean') {
        setJSONSetting(USE_AUTH, auth);
    } else {
        unsetJSONSetting(USE_AUTH);
    }
};

export const authClientId = (): string =>
    window.localStorage.getItem(CLIENT_ID) || '';
export const setAuthClientId = (clientId: string) =>
    window.localStorage.setItem(CLIENT_ID, clientId);

export const getJSONSetting = (name: string, defaultValue: any = {}): any => {
    const configValue = get(CONFIG, `${name}.value`);
    if (configValue !== undefined) {
        defaultValue = configValue;
    }
    if (disabledSetting(name)) {
        return defaultValue;
    }
    try {
        const stored = window.localStorage.getItem(name);
        // treat empty string same as null (not found)
        return stored ? JSON.parse(stored) : defaultValue;
    } catch (e) {
        // treat parse error same as not found
        return defaultValue;
    }
};

export const setJSONSetting = (name: string, value: any) => {
    if (disabledSetting(name)) {
        console.error(`Configuration does not allow ${name} to be changed`);
        return;
    }
    // note that e.g. NaN becomes null
    const stored = JSON.stringify(value);
    window.localStorage.setItem(name, stored);
};

export const unsetJSONSetting = (name: string) => {
    window.localStorage.removeItem(name);
};

export const useJSONSetting = (
    name: string,
    defaultValue: any = {}
): [any, React.Dispatch<React.SetStateAction<any>>] => {
    const [setting, setSetting] = useState(getJSONSetting(name, defaultValue));
    useEffect(() => {
        const configValue = get(CONFIG, `${name}.value`);
        const hasConfigValue = configValue !== undefined;
        if (!isEqual(setting, hasConfigValue ? configValue : defaultValue)) {
            setJSONSetting(name, setting);
        } else {
            unsetJSONSetting(name);
        }
    }, [name, setting, defaultValue]);

    return [setting, setSetting];
};

const useSettings = (): [
    Record<string, any>,
    React.Dispatch<React.SetStateAction<Record<string, any>>>,
] => {
    const [values, setValues] = useState({
        [QUERY_API]: apiUrl(QUERY_API),
        [LOGGING_API]: apiUrl(LOGGING_API),
        [DNSSD_API]: apiUrl(DNSSD_API),
        [PAGING_LIMIT]: apiPagingLimit(QUERY_API),
        [USE_RQL]: apiUsingRql(QUERY_API),
        [FRIENDLY_PARAMETERS]: getJSONSetting(FRIENDLY_PARAMETERS, false),
        [CLIENT_ID]: authClientId(),
        [AUTH_API]: apiUrl(AUTH_API),
    });

    const isEffective = (name: string): boolean =>
        !hiddenSetting(name) && !disabledSetting(name);
    useEffect(() => {
        if (isEffective(QUERY_API)) setApiUrl(QUERY_API, values[QUERY_API]);
        if (isEffective(LOGGING_API))
            setApiUrl(LOGGING_API, values[LOGGING_API]);
        if (isEffective(DNSSD_API)) setApiUrl(DNSSD_API, values[DNSSD_API]);
        if (isEffective(PAGING_LIMIT))
            setApiPagingLimit(QUERY_API, values[PAGING_LIMIT]);
        if (isEffective(USE_RQL)) setApiUsingRql(QUERY_API, values[USE_RQL]);
        if (isEffective(FRIENDLY_PARAMETERS))
            setJSONSetting(FRIENDLY_PARAMETERS, values[FRIENDLY_PARAMETERS]);
        if (isEffective(CLIENT_ID)) setAuthClientId(values[CLIENT_ID]);
        if (isEffective(AUTH_API)) setApiUrl(AUTH_API, values[AUTH_API]);
    }, [values]);

    return [values, setValues];
};

const SettingsContext = createContext<
    | [
          Record<string, any>,
          React.Dispatch<React.SetStateAction<Record<string, any>>>,
      ]
    | undefined
>(undefined);

export const SettingsContextProvider = (props: any) => {
    const [values, setValues] = useSettings();
    return <SettingsContext.Provider value={[values, setValues]} {...props} />;
};

export const useSettingsContext = () => useContext(SettingsContext)!;

// Authorization context for updating web interface when the "Use Auth" switch is toggled
const useAuthSettings = (): [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>,
] => {
    const [useAuth, setUseAuth] = useState(usingAuth());

    const isEffective = (name: string): boolean =>
        !hiddenSetting(name) && !disabledSetting(name);
    useEffect(() => {
        if (isEffective(USE_AUTH)) setUsingAuth(useAuth);
    }, [useAuth]);

    return [useAuth, setUseAuth];
};

const AuthContext = createContext<
    [boolean, React.Dispatch<React.SetStateAction<boolean>>] | undefined
>(undefined);

export const AuthContextProvider = (props: any) => {
    const [useAuth, setUseAuth] = useAuthSettings();
    return <AuthContext.Provider value={[useAuth, setUseAuth]} {...props} />;
};

export const useAuthContext = () => useContext(AuthContext)!;
