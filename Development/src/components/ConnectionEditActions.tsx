import React from 'react';
import { Link } from 'react-router-dom';
import { ShowButton, TopToolbar } from 'react-admin';
import { useTheme } from '@material-ui/styles';

export default function ConnectionEditActions({ basePath, id }) {
    const theme = useTheme() as any;
    return (
        <TopToolbar
            style={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'flex-start',
                paddingTop: theme.spacing(4),
                paddingBottom: 0,
                paddingRight: theme.spacing(2),
                minHeight: theme.spacing(5),
            }}
        >
            <ShowButton
                label={'Show'}
                component={Link as any}
                to={`${basePath}/${id}/show/staged`}
            />
        </TopToolbar>
    );
}
