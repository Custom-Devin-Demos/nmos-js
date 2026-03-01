import React from 'react';
import {
    ChevronLeft,
    ChevronRight,
    FirstPage,
    LastPage,
} from '@material-ui/icons';
import { Button } from '@material-ui/core';
import { includes, keys } from 'lodash';

const components = {
    prev: ChevronLeft,
    next: ChevronRight,
    last: LastPage,
    first: FirstPage,
};

export const PaginationButton = ({
    pagination,
    disabled,
    nextPage,
    rel,
    label = rel,
}: any) => {
    rel.toLowerCase();
    const buttons = keys(pagination);

    const enabled = (() => {
        if (disabled) return false;
        return includes(buttons, rel);
    })();

    const getIcon = (label: any) => {
        const ButtonIcon = (components as any)[label];
        return <ButtonIcon style={{ transform: 'rotate(270deg)' }} />;
    };

    return (
        <Button onClick={() => nextPage(rel)} disabled={!enabled} name={rel}>
            {getIcon(rel)}
            {label}
        </Button>
    );
};

const PaginationButtons = (props: any) => (
    <>
        <PaginationButton rel="first" {...props} />
        <PaginationButton rel="prev" {...props} />
        <PaginationButton rel="next" {...props} />
        <PaginationButton rel="last" {...props} />
    </>
);

export default PaginationButtons;
