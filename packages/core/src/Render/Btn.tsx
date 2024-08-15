
//const Btn = styled.a`
//  padding: 0 0px;
//  opacity: 0.9;
//  display: flex;
//  align-items: center;
//  > div {
//    position: relative;
//    top: -50%;
//    left: -50%;
//  }
//`;

import { makeStyles, mergeClasses, shorthands } from '@fluentui/react-components';
import React, { forwardRef } from 'react';

const useStyles = makeStyles({
    btn: {
        ...shorthands.padding(0, '0px'),
        opacity: 0.9,
        display: 'flex',
        alignItems: 'center',
        '& > div': {
            position: 'relative',
            top: '-50%',
            left: '-50%',
        },
    },
});

export const Btn = forwardRef<HTMLAnchorElement, React.AnchorHTMLAttributes<HTMLAnchorElement>>(({ children, className, ...props }, ref) => {
    const classes = useStyles();
    return (
        <a ref={ref} className={mergeClasses(classes.btn, className)} {...props} >
            {children}
        </a>
    );
});
