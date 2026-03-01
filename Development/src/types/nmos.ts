// NMOS Resource Interfaces

export interface NmosResource {
    id: string;
    version: string;
    label: string;
    description?: string;
    tags?: Record<string, string[]>;
}

export interface NmosNode extends NmosResource {
    hostname?: string;
    href: string;
    api?: {
        versions: string[];
        endpoints: Array<{
            host: string;
            port: number;
            protocol: string;
        }>;
    };
    caps?: Record<string, unknown>;
    services?: Array<{
        href: string;
        type: string;
    }>;
    clocks?: Array<{
        name: string;
        ref_type: string;
    }>;
    interfaces?: Array<{
        chassis_id?: string;
        port_id: string;
        name: string;
    }>;
}

export interface NmosDevice extends NmosResource {
    type: string;
    node_id: string;
    senders: string[];
    receivers: string[];
    controls?: Array<{
        href: string;
        type: string;
    }>;
    $io?: Record<string, unknown>;
    $active?: Record<string, unknown>;
    $channelmappingAPI?: string | null;
    $activations?: Record<string, unknown>;
}

export interface NmosSource extends NmosResource {
    grain_rate?: Rational;
    caps?: Record<string, unknown>;
    device_id: string;
    parents: string[];
    clock_name?: string | null;
    format: string;
    channels?: Array<{
        label: string;
        symbol: string;
    }>;
}

export interface NmosFlow extends NmosResource {
    grain_rate?: Rational;
    source_id: string;
    device_id: string;
    parents: string[];
    format: string;
    frame_width?: number;
    frame_height?: number;
    interlace_mode?: string;
    colorspace?: string;
    transfer_characteristic?: string;
    media_type?: string;
    components?: Array<{
        name: string;
        width: number;
        height: number;
        bit_depth: number;
    }>;
    sample_rate?: Rational;
    bit_depth?: number;
    event_type?: string;
}

export interface NmosSender extends NmosResource {
    flow_id: string | null;
    transport: string;
    device_id: string;
    manifest_href: string | null;
    interface_bindings: string[];
    subscription: {
        receiver_id: string | null;
        active: boolean;
    };
    $connectionAPI?: string | null;
    $transporttype?: string;
    $staged?: TransportParams;
    $active?: TransportParams;
    $transportfile?: string;
}

export interface NmosReceiver extends NmosResource {
    transport: string;
    device_id: string;
    interface_bindings: string[];
    format: string;
    caps?: ReceiverCaps;
    subscription: {
        sender_id: string | null;
        active: boolean;
    };
    $connectionAPI?: string | null;
    $transporttype?: string;
    $staged?: TransportParams;
    $active?: TransportParams;
    $transportfile?: string;
}

export interface NmosSubscription extends NmosResource {
    ws_href: string;
    max_update_rate_ms: number;
    resource_path: string;
    params: Record<string, unknown>;
    persist: boolean;
    secure: boolean;
}

export interface NmosLog {
    id: string;
    timestamp: string;
    level: number;
    level_name: string;
    message: string;
    source_location?: {
        file: string;
        line: number;
        function: string;
    };
    [key: string]: unknown;
}

export interface NmosQueryApi {
    id: string;
    name: string;
    domain?: string;
    address: string;
    port: number;
    txt?: Record<string, string>;
    [key: string]: unknown;
}

export interface Rational {
    numerator: number;
    denominator?: number;
}

export interface TransportParams {
    transport_params?: Array<Record<string, unknown>>;
    transport_file?: {
        data: string | null;
        type: string | null;
    };
    activation?: {
        mode: string | null;
        requested_time: string | null;
        activation_time: string | null;
    };
    [key: string]: unknown;
}

export interface ReceiverCaps {
    media_types?: string[];
    event_types?: string[];
    constraint_sets?: ConstraintSet[];
    version?: string;
}

export interface ConstraintSet {
    'urn:x-nmos:cap:meta:label'?: string;
    'urn:x-nmos:cap:meta:preference'?: number;
    'urn:x-nmos:cap:meta:enabled'?: boolean;
    [key: string]: Constraint | string | number | boolean | undefined;
}

export interface Constraint {
    minimum?: number | Rational | string;
    maximum?: number | Rational | string;
    enum?: Array<number | Rational | string>;
}
