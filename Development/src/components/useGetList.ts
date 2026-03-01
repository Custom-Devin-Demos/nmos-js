import { useEffect } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import {
    CRUD_GET_LIST,
    useCheckMinimumRequiredProps,
    useDataProvider,
    useNotify,
    useSafeSetState,
    useVersion,
} from 'react-admin';
import isEqual from 'lodash/isEqual';
import useDebounce from './useDebounce';

const isEmptyList = (data: any) =>
    Array.isArray(data)
        ? data.length === 0
        : data &&
          Object.keys(data).length === 0 &&
          data.hasOwnProperty('fetchedAt');

// We need a custom hook as the request URL needs to be returned.
const useQueryWithStore = (
    query: any,
    options: any,
    dataSelector: any,
    totalSelector: any
) => {
    const { type, resource, payload } = query;
    const data = useSelector(dataSelector);
    const total = useSelector(totalSelector);
    const [state, setState] = useSafeSetState({
        data,
        total,
        error: null,
        loading: true,
        loaded: data !== undefined && !isEmptyList(data),
        pagination: null,
        url: null,
    });
    if (!isEqual(state.data, data) || state.total !== total) {
        setState(
            Object.assign(Object.assign({}, state), {
                data,
                total,
                loaded: true,
            })
        );
    }
    const dataProvider = useDataProvider();
    useEffect(() => {
        // If the filter has changed ignore paginationURL
        payload.paginationURL = null;
    }, [payload.filter]); // eslint-disable-line
    useEffect(() => {
        setState((prevState: any) =>
            Object.assign(Object.assign({}, prevState), { loading: true })
        );
        dataProvider[type](resource, payload, options)
            .then((response: any) => {
                // We only care about the dataProvider url response here, because
                // the list data was already passed to the SUCCESS redux reducer.
                setState((prevState: any) =>
                    Object.assign(Object.assign({}, prevState), {
                        error: null,
                        loading: false,
                        loaded: true,
                        pagination: response.pagination,
                        url: response.url,
                    })
                );
            })
            .catch((error: any) => {
                setState({
                    error,
                    loading: false,
                    loaded: false,
                });
            });
    }, [JSON.stringify({ query, options })]); // eslint-disable-line
    return state;
};

const useGetList = (props: any) => {
    useCheckMinimumRequiredProps(
        'List',
        ['basePath', 'filter', 'resource'],
        props
    );
    const { basePath, resource, paginationURL, filter } = props;
    const debouncedFilter = useDebounce(filter, 250);

    const notify = useNotify();
    const version = useVersion();

    const { total, error, loading, loaded, pagination, url } =
        useQueryWithStore(
            {
                type: 'getList',
                resource,
                payload: {
                    filter: debouncedFilter,
                    paginationURL,
                },
            },
            {
                action: CRUD_GET_LIST,
                version,
                onFailure: (error: any) =>
                    notify(
                        typeof error === 'string'
                            ? error
                            : error.message || 'ra.notification.http_error',
                        'warning'
                    ),
            },
            (state: any) =>
                state.admin.resources[resource]
                    ? state.admin.resources[resource].list.ids
                    : null,
            (state: any) =>
                state.admin.resources[resource]
                    ? state.admin.resources[resource].list.total
                    : null
        );
    const data = useSelector(
        (state: any) =>
            state.admin.resources[resource]
                ? state.admin.resources[resource].data
                : {},
        shallowEqual
    );
    const ids = useSelector(
        (state: any) =>
            state.admin.resources[resource]
                ? state.admin.resources[resource].list.ids
                : [],
        shallowEqual
    );

    const listDataObject = {};
    ids.forEach((key: any) => ((listDataObject as any)[key] = data[key]));

    const listDataArray = Object.keys(listDataObject).map((key: any) => {
        return (listDataObject as any)[key];
    });

    return {
        basePath,
        data: listDataArray,
        error,
        ids,
        loading,
        loaded,
        pagination,
        resource,
        total,
        url,
        version,
    };
};

export default useGetList;
