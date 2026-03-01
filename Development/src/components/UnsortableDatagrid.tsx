import React, { Children, cloneElement, isValidElement } from 'react';
import { Datagrid } from 'react-admin';

export const UnsortableDatagrid = ({ children, ...props }: any) => (
    <Datagrid {...props}>
        {Children.map(
            children,
            (child: any) =>
                isValidElement(child) &&
                cloneElement(child, { sortable: false })
        )}
    </Datagrid>
);

export default UnsortableDatagrid;
