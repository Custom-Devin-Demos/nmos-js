// Settings type definitions

export interface SettingsValues {
    [key: string]: string | number | boolean;
}

export interface ConfigSetting<T = unknown> {
    value?: T;
    disabled?: boolean;
    hidden?: boolean;
}

export interface Config {
    title?: string;
    [key: string]: ConfigSetting | string | undefined;
}
