import { Element, useEditor } from '@craftjs/core';
import React from 'react';
import { makeStyles, shorthands } from '@fluentui/react-components';
import { NodePicker } from '../NodePicker/NodePicker';

const useStyles = makeStyles({
    toolboxDiv: {
        ...shorthands.transition( '0.4s','cubic-bezier(0.19, 1, 0.22, 1)'),
        width: 'auto',
        opacity: 1,
    },
    toolboxDivHidden: {
        width: '0',
        opacity: 0,
    },
    item: {
        '& svg': {
            width: '22px',
            height: '22px',
            fill: '#707070',
        },
        cursor: 'default',
    },
    itemMove: {
        cursor: 'move',
    },
});

export const Toolbox = () => {
    const {
        enabled,
        connectors: { create },
    } = useEditor((state) => ({
        enabled: state.options.enabled,
    }));

    const styles = useStyles();

    return (
        <div
            className={`${styles.toolboxDiv} ${!enabled ? styles.toolboxDivHidden : ''} toolbox transition w-12 h-full flex flex-col bg-white`}
        >
            <div className="flex flex-1 flex-col items-center pt-3">
                <NodePicker />
            </div>
        </div>
    );
};