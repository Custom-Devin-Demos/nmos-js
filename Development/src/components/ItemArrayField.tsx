import React from 'react';
import { Typography } from '@material-ui/core';
import get from 'lodash/get';

const ItemArrayField = ({ className, record, source }: any) => (
    <>
        {get(record, source, []).map((item: any, index: any) => (
            <Typography variant="body2" key={index} className={className}>
                {item}
            </Typography>
        ))}
    </>
);
ItemArrayField.defaultProps = {
    addLabel: true,
};

export default ItemArrayField;
