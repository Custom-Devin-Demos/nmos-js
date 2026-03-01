import React from 'react';
import { SvgIcon } from '@material-ui/core';

const JsonIcon = (props: any) => (
    <SvgIcon {...props}>
        <g>
            <style>{'.txt { font-size: 14px; font-family: monospace; }'}</style>
            <text x={0} y={15} className="txt">
                {'{…}'}
            </text>
        </g>
    </SvgIcon>
);

export default JsonIcon;
