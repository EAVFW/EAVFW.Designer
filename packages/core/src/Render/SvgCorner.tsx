import React, { PropsWithChildren } from 'react';
import { makeStyles } from '@fluentui/react-components';

type SvgCornerProps = {
    alignment: string;
};
const alignments = ["top", "left", "bottom", "right"];
const useStyles = makeStyles({
    svg: {
        position: 'absolute',
        width: '14px',
        height: '14px',
        display: 'block',
        cursor: 'pointer',
    },
    topLeft: {
        top: '0px',
        left: '0px',
        transform: 'rotate(270deg)',
    },
    topRight: {
        top: '0px',
        right: '0px',
        transform: 'rotate(0deg)',
    },
    bottomLeft: {
        bottom: '0px',
        left: '0px',
        transform: 'rotate(180deg)',
    },
    bottomRight: {
        bottom: '0px',
        right: '0px',
        transform: 'rotate(90deg)',
    },
});
export const SvgCorner: React.FC<PropsWithChildren< SvgCornerProps>> = ({ alignment, children }) => {
    const classes = useStyles();

    const getAlignmentClass = () => {
        switch (alignment) {
            case 'top left':
                return classes.topLeft;
            case 'top right':
                return classes.topRight;
            case 'bottom left':
                return classes.bottomLeft;
            case 'bottom right':
                return classes.bottomRight;
            default:
                return '';
        }
    };
    return (
        <svg className={`${classes.svg} ${getAlignmentClass()}`}>
            {children}
        </svg>
    );
};
