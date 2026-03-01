import React, {
    Children,
    Component,
    cloneElement,
    isValidElement,
} from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { Card, CardContent, Grid } from '@material-ui/core';
import { FormInput } from 'react-admin';
// Derived from react-admin component
export class CardFormIterator extends Component<any, any> {
    nextId: number;
    ids: number[];
    constructor(props: any) {
        super(props);
        // we need a unique id for each field for a proper enter/exit animation
        // but redux-form doesn't provide one (cf https://github.com/erikras/redux-form/issues/2735)
        // so we keep an internal map between the field position and an autoincrement id
        this.nextId = props.fields.length
            ? props.fields.length
            : props.defaultValue
              ? props.defaultValue.length
              : 0;

        // We check whether we have a defaultValue (which must be an array) before checking
        // the fields prop which will always be empty for a new record.
        // Without it, our ids wouldn't match the default value and we would get key warnings
        // on the CssTransition element inside our render method
        this.ids = this.nextId > 0 ? Array.from(Array(this.nextId).keys()) : [];
    }

    render() {
        const { basePath, children, fields, record, resource, source } =
            this.props;
        const records = get(record, source);
        return fields ? (
            <>
                <br style={{ lineHeight: 2 }} />
                <Grid container spacing={2}>
                    {fields.map((member: any, index: any) => (
                        <Grid item sm key={index} style={{ flexGrow: 0 }}>
                            <Card elevation={3}>
                                <CardContent>
                                    {Children.map(
                                        children,
                                        (input: any, index2: any) =>
                                            isValidElement(input) ? (
                                                <FormInput
                                                    basePath={
                                                        (input.props as any)
                                                            .basePath ||
                                                        basePath
                                                    }
                                                    input={cloneElement(input, {
                                                        source: (
                                                            input.props as any
                                                        ).source
                                                            ? `${member}.${(input.props as any).source}`
                                                            : member,
                                                        index: (
                                                            input.props as any
                                                        ).source
                                                            ? undefined
                                                            : index2,
                                                        label:
                                                            (input.props as any)
                                                                .label ||
                                                            (input.props as any)
                                                                .source,
                                                    })}
                                                    record={
                                                        (records &&
                                                            records[index]) ||
                                                        {}
                                                    }
                                                    resource={resource}
                                                    style={{
                                                        display: 'inline-block',
                                                    }}
                                                />
                                            ) : null
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </>
        ) : null;
    }
}

CardFormIterator.propTypes = {
    defaultValue: PropTypes.any,
    basePath: PropTypes.string,
    children: PropTypes.node,
    fields: PropTypes.object,
    record: PropTypes.object,
    source: PropTypes.string,
    resource: PropTypes.string,
};

export default CardFormIterator;
