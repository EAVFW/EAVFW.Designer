import { makeStyles, shorthands } from '@griffel/react';
import React from 'react';

const useStyles = makeStyles({
    cellTemplate: {
        minHeight: '10px',
        height: '100%',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...shorthands.flex(1, 1, '0%'), 
        position: 'relative', // Needed for the :before pseudo-element
        '&:before': {
            top: '1px',
            left: '1px',
            right: '1px',
            bottom: '1px',
            position: 'absolute',
            content: '""',
            backgroundColor: '#d9d9d9', // Default background color
        },
    },
    articleRole: {
        '&:before': {
            backgroundColor: '#bfbfbf', // Background color for role 'article'
        },
    },
});

interface CellTemplateProps {
    role: string;
}

export const CellTemplate: React.FC<CellTemplateProps> = ({ role }) => {
    const styles = useStyles();
    const className = role === 'article' ? `${styles.cellTemplate} ${styles.articleRole}` : styles.cellTemplate;

    return <div className={className}></div>;
};
