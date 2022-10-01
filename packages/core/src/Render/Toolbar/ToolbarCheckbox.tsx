

import { Checkbox } from '@fluentui/react';
import React from 'react';



export const ToolbarCheckbox = ({ value, label, onChange }: any) => {
   
    const boolvalue = value === undefined ? false : value;
    return (
        <Checkbox  checked={boolvalue} label={label } onChange={onChange} />        
    );
};

