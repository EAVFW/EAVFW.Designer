
import { ChoiceGroup, makeStyles } from '@fluentui/react';
import React from 'react';
import { classNames } from '../../Utils/classNames';
 
const useStyles = makeStyles({
    icon: {
        borderRadius: '100%',
        width: 15,
        height: 15,
        background: 'transparent',
        position: 'relative',
        padding: '3px',
        border: '2px solid rgb(142, 142, 142)',
        transition: '0.4s cubic-bezier(0.19, 1, 0.22, 1)',
    },
    checkedIcon: {
        background: 'rgb(19, 115, 230)',
        borderColor: 'transparent',
        '&:before': {
            content: '""',
            display: 'block',
            width: '100%',
            height: '100%',
            borderRadius: '100%',
            background: '#fff',
        },
    },
});

 

const useLabelStyles = makeStyles({
    label: {
        fontSize: '15px',
    },
});

export const ToolbarRadio = ({ value, label }: any) => {
    const classes = useStyles({});
    return (
        <ChoiceGroup
            
            color="default"
            
           
            
        />
    );
};
