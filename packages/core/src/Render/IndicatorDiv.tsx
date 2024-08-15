

//export const IndicatorDiv = styled.div`
//  height: 30px;
//  margin-top: -29px;
//  margin-right:-4;
//  font-size: 12px;
//  line-height: 12px;

//  svg {
//    fill: #fff;
//    width: 15px;
//    height: 15px;
//  }
//`

import { makeStyles, mergeClasses, shorthands } from '@fluentui/react-components';
import React, { forwardRef } from 'react';

const useStyles = makeStyles({
    indicatorDiv: {
        height: '30px',
        marginTop: '-29px',
        marginRight: '-4px',
        fontSize: '12px',
        lineHeight: '12px',
        '& svg': {
            fill: '#fff',
            width: '15px',
            height: '15px',
        },
    },
});

export const IndicatorDiv = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ children, className, ...props }, ref) => {
    const classes = useStyles();
    return (
        <div ref={ref} className={mergeClasses(classes.indicatorDiv, className)} {...props} >
            {children}
        </div>
    );
});
