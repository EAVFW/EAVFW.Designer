import { makeStyles } from '@griffel/react';
import React, { PropsWithChildren } from 'react';

const useStyles = makeStyles({
    gridSnippetContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        maxWidth: '400px',
    },
});

export const GridSnippetContainer: React.FC<PropsWithChildren<{}>> = ({ children }) => {
    const styles = useStyles();
    return <div className={styles.gridSnippetContainer}>{children}</div>;
};


