import React, { PropsWithChildren } from 'react';
import { makeStyles, shorthands } from '@griffel/react';
import Arrow from '../../../Icons/arrow.svg';

const useStyles = makeStyles({
    sidebarItemDiv: {
        color: '#545454',
        display: 'flex',
        flexDirection: 'column',
        height: 'auto',
        '&.fullHeight': {
            flexGrow: 1,
            flexShrink: 1,
            flexBasis: "0%"
        },
    },
    chevron: {
        display: 'inline-block',
        ...shorthands.transition('transform','0.2s'),
        '& svg': {
            width: '8px',
            height: '8px',
        },
        '&.rotated': {
            transform: 'rotate(180deg)',
        },
    },
    headerDiv: {
        color: '#615c5c',
        height: '45px',
        display: 'flex',
        alignItems: 'center',
        ...shorthands.padding('0','8px'),
        backgroundColor: 'white',
        ...shorthands.borderBottom('1px','solid','#e0e0e0'),
        cursor: 'pointer',
        '&:last-child': {
            borderBottomStyle: 'none',
        },
        '& svg': {
            fill: '#707070',
        },
        '&.shadow': {
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        },
    },
    content: {
        width: '100%',
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: "0%",
        ...shorthands.overflow('auto'),
    },
});

export type SidebarItemProps = {
    title: string;
    height?: string;
    icon: React.ElementType;
    visible?: boolean;
    onChange?: (bool: boolean) => void;
};

export const SidebarItem: React.FC<PropsWithChildren<SidebarItemProps>> = ({
    visible,
    icon,
    title,
    children,
    height,
    onChange,
}) => {
    const styles = useStyles();
    const sidebarItemClass = `${styles.sidebarItemDiv} ${visible && height === 'full' ? 'fullHeight' : ''}`;
    const chevronClass = `${styles.chevron} ${visible ? 'rotated' : ''}`;
    const headerClass = `${styles.headerDiv} ${visible ? 'shadow' : ''}`;

    return (
        <div className={sidebarItemClass} style={{ height: visible && height && height !== 'full' ? height : 'auto' }}>
            <div
                className={headerClass}
                onClick={() => {
                    if (onChange) onChange(!visible);
                }}
            >
                <div className="flex-1 flex items-center">
                    {React.createElement(icon, { className: 'w-4 h-4 mr-2' })}
                    <h2 className="text-xs uppercase">{title}</h2>
                </div>
                <a className={chevronClass}>
                    <Arrow />
                </a>
            </div>
            {visible ? <div className={styles.content}>{children}</div> : null}
        </div>
    );
};
