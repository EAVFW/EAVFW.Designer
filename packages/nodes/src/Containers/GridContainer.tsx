import React, { PropsWithChildren, forwardRef } from 'react';
import { makeStyles } from '@fluentui/react-components';

type GridProps = {
    rows: string[],
    cols: string[]
}

type GridContainerProps = {
    grid: GridProps
}

const useStyles = makeStyles({
    gridContainer: {
        width: '100%',
        height: '100%',
        display: 'grid',
        position: 'relative',
    },
});

export const GridContainer = forwardRef<HTMLDivElement, PropsWithChildren<GridContainerProps>>(({ grid, children }, ref) => {
    const styles = useStyles();

    const gridTemplateRows = grid.rows?.join(" ");
    const gridTemplateColumns = grid.cols?.join(" ");

    return (
        <div
            className={styles.gridContainer}
            style={{
                gridTemplateRows: gridTemplateRows,
                gridTemplateColumns: gridTemplateColumns,
            }}
            ref={ref}
        >
            {children}
        </div>
    );
});

GridContainer.displayName = 'GridContainer';
