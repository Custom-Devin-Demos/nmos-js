import React, { useState } from 'react';
import { Button, Menu, MenuItem } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import get from 'lodash/get';
import { useNotify, useRefresh } from 'react-admin';
import makeConnection from '../../components/makeConnection';
import { ActivateImmediateIcon, StageIcon } from '../../icons';
import dataProvider from '../../dataProvider';

const ConnectButtons = ({ senderData, receiverData }: any) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [senderLegs, setSenderLegs] = useState(0);
    const [endpoint, setEndpoint] = useState('');

    const history = useHistory();
    const notify = useNotify();
    const refresh = useRefresh();

    const connect = (endpoint: any, senderLeg: any) => {
        const options = { singleSenderLeg: senderLeg };
        makeConnection(senderData.id, receiverData.id, endpoint, options)
            .then(() => {
                notify('Element updated', 'info');
                refresh();
                history.push(`/receivers/${receiverData.id}/show/${endpoint}`);
            })
            .catch((error: any) => {
                if (error && error.hasOwnProperty('body'))
                    notify(
                        get(error.body, 'error') +
                            ' - ' +
                            get(error.body, 'code') +
                            ' - ' +
                            get(error.body, 'debug'),
                        'warning'
                    );
                notify(error.toString(), 'warning');
            });
    };

    const handleConnect = (endpoint: any, event: any) => {
        setEndpoint(endpoint);
        if (get(receiverData, '$staged.transport_params').length === 1) {
            const ref = event.currentTarget;
            dataProvider('GET_ONE', 'senders', {
                id: senderData.id,
            }).then(({ data: senderData }: any) => {
                if (get(senderData, '$staged.transport_params').length > 1) {
                    setSenderLegs(
                        get(senderData, '$staged.transport_params').length
                    );
                    setAnchorEl(ref);
                } else {
                    connect(endpoint);
                }
            });
        } else {
            connect(endpoint);
        }
    };

    return (
        <>
            <Button
                onClick={(event: any) => handleConnect('active', event)}
                color="primary"
                startIcon={<ActivateImmediateIcon />}
                name="activate"
            >
                Activate
            </Button>
            <Button
                onClick={(event: any) => handleConnect('staged', event)}
                color="primary"
                startIcon={<StageIcon />}
            >
                Stage
            </Button>
            <Menu
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
            >
                {[...Array(senderLegs).keys()].map((leg: any) => (
                    <MenuItem
                        key={leg}
                        onClick={() => connect(endpoint, leg)}
                        style={{ fontSize: '0.875rem' }}
                    >
                        Leg {leg + 1}
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
};

export default ConnectButtons;
