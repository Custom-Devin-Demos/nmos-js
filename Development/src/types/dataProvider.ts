// Data provider type definitions

export interface DataProviderParams {
    id?: string;
    ids?: string[];
    data?: Record<string, unknown>;
    previousData?: Record<string, unknown>;
    filter?: Record<string, unknown>;
    paginationURL?: string;
    target?: string;
    pagination?: {
        page: number;
        perPage: number;
    };
    sort?: {
        field: string;
        order: string;
    };
}

export interface DataProviderResult {
    url?: string;
    data: Record<string, unknown> | Array<Record<string, unknown>>;
    total?: number;
    pagination?: PaginationLinks | null;
    unfilteredTotal?: number;
}

export interface PaginationLinks {
    first?: string;
    last?: string;
    next?: string;
    prev?: string;
}

export interface HttpRequest {
    url: string;
    options: RequestInit & { headers: Headers };
    referenceFilter?: Record<string, Record<string, unknown>>;
}

export interface ApiResource {
    api: string;
    res: string;
}

export interface ReferenceFilter {
    [ref: string]: Record<string, unknown>;
}
