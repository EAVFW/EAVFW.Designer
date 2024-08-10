import React from 'react';
import { makeStyles } from '@fluentui/react-components';

type CellProps = {
    cell: {
        position: {
            col: number,
            row: number,
        },
        span: {
            cols: number,
            rows: number,
        },
        alignment: {
            vertical: string,
            horizontal: string
        }
    }
}

const useStyles = makeStyles({
    cell: {
        display: 'flex',
        flexWrap: 'wrap',
        minWidth: '0',
        position: 'relative',
    },
});

export const Cell: React.FC<CellProps & React.HTMLAttributes<HTMLDivElement>> = ({ cell, children, ...props }) => {
    const styles = useStyles();

    const gridRowStart = cell.position.row;
    const gridRowEnd = cell.position.row + cell.span.rows;
    const gridColumnStart = cell.position.col;
    const gridColumnEnd = cell.position.col + cell.span.cols;

    return (
        <div
            className={styles.cell}
            style={{
                gridRowStart: gridRowStart,
                gridRowEnd: gridRowEnd,
                gridColumnStart: gridColumnStart,
                gridColumnEnd: gridColumnEnd,
            }}
            {...props}
        >
            {children}
        </div>
    );
};
