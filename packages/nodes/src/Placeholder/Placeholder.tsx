import { makeStyles,shorthands } from '@griffel/react';
import React, { PropsWithChildren, forwardRef } from 'react';

const useStyles = makeStyles({
    placeholder: {
        minHeight: '80px',
        fontFamily: 'monospace',
        fontSize: '12px',
        textTransform: 'uppercase',
        height: '100%',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...shorthands.flex('1','1','auto'),
        flexDirection: 'column',
        position: 'relative',
        '&:before': {
            top: '5px',
            left: '5px',
            right: '5px',
            bottom: '5px',
            position: 'absolute',
            content: '""',
            backgroundColor: 'repeating-linear-gradient(45deg, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0) 10px, rgba(0, 0, 0, 0.05) 10px, rgba(0, 0, 0, 0.05) 20px)',
        },
    },
});

export const Placeholder = forwardRef<HTMLDivElement, PropsWithChildren<{}>>(({ children }, ref) => {
    const styles = useStyles();
    return <div className={styles.placeholder} ref={ref}>{children}</div>;
});

Placeholder.displayName = 'Placeholder';
