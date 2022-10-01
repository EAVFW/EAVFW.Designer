import { Dropdown } from '@fluentui/react';
import React from 'react';


export const ToolbarDropdown = ({ title, value, onChange, children, multiple }: any) => {

    return <Dropdown label={title} multiSelect={multiple || false} selectedKey={value} options={children } ></Dropdown> 
    //return (
    //    <FormControl>
    //        <InputLabel>{title}</InputLabel>
    //        <Select multiple={multiple || false} native value={value} onChange={(e) => onChange(e.target.value)}>
    //            {children}
    //        </Select>
    //    </FormControl>
    //);
};

//import { Label } from '@fluentui/react/lib/Label';
//import { TextField } from '@fluentui/react/lib/TextField';
//import { useId } from '@fluentui/react-hooks';
//import { Dropdown, Stack } from '@fluentui/react';

//export const ToolbarDropdown = ({ title, value, onChange, children }: any) => {

//    const textFieldId = useId('anInput');

//    return (
//        <Stack>
//            <Label>{title}</Label>
//            {children}
//        </Stack>
//    );
//};
