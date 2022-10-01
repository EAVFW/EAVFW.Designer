import { useNode } from '@craftjs/core';

import { Link, ComboBox, CommandBar, CommandButton, FontWeights, getTheme, IButtonStyles, IComboBox, IComboBoxOption, IComboBoxProps, IconButton, IIconProps, IStackProps, IStyleFunction, mergeStyleSets, Modal, ScrollablePane, Slider, Stack, Sticky, StickyPositionType, TextField, useTheme, PrimaryButton, ChoiceGroup } from "@fluentui/react";

import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';

import { ToolbarDropdown } from './ToolbarDropdown';
import { ToolbarCheckbox } from './ToolbarCheckbox';
import { AttributeDefinition } from '@eavfw/manifest';



export type ToolbarItemProps = {
    prefix?: string;
    type?: any;
    label?: string;
    full?: boolean;
    multiline?: boolean;
    defaultVal?: any;
    propKey?: string;
    index?: number;
    children?: React.ReactNode;
    onChange?: (value: any) => any;
};
export type FieldSelectorProps = ToolbarItemProps & {
    entity?: boolean,
    attributes?: { [key: string]: AttributeDefinition },
    ["x-purpose"]?: string
    ["x-field-identifier"]?: string
    selectableType?: boolean
    twocolumns?: { isPrev: boolean }
    formName?: string;
    onSaveManifest?: (manifest: any, data: any) => void,
    onLoadManifest?: (manifest: any, data: any) => void,
}



//const entityRelatedAttributeDefinition = {
//    pluralName: "Entity Attributes",
//    displayName: "Entity Attribute",
//    logicalName: "entityattribute",
//    collectionSchemaName: "EntityAttributes",
//    schemaName: "EntityAttribute",
//    forms: {

//    },

//    attributes: {
//        ...customAttributeAttributes,
//        "Entity": {
//            "locale": {
//                "1033": {
//                    "displayName": "Entity"
//                },
//                "1030": {
//                    "displayName": "Tabel"
//                }
//            },
//            "type": {
//                "type": "lookup",
//                "referenceType": "entity",
//                "required": true,
//                "foreignKey": {
//                    "principalTable": "entity",
//                    "principalColumn": "id",
//                    "principalNameColumn": "name",
//                    "name": "entity"
//                },
//                "forms": {
//                    "Main": {
//                        "type": "Main",
//                        "name": "Main Information",
//                        "tab": "TAB_Attributes",
//                        "column": "COLUMN_First",
//                        "section": "SECTION_General",
//                        "view": "Assosiated Attributes"
//                    }
//                },
//            },
//            "displayName": "Entity",
//            "schemaName": "entityid",
//            "logicalName": "entityid"
//        }

//    }
//};




const theme = getTheme();

const stackProps: Partial<IStackProps> = {
    horizontal: true,
    tokens: { childrenGap: 40 },
    styles: { root: { marginBottom: 20 } },
};








export const ToolbarItem = ({
    full = false,
    propKey,
    type,
    onChange,
    index,
    defaultVal,
    multiline = false,
    ...props
}: ToolbarItemProps) => {
    const {
        actions: { setProp },
        propValue,
    } = useNode((node) => ({
        propValue: node.data.props[propKey!],
    }));
    const value = Array.isArray(propValue) ? propValue[index!] : propValue;
    console.log(propKey, value, propValue);
    return (
        <Stack.Item >
            <div className="mb-2">
                {['text', 'color', 'bg', 'number', 'date'].includes(type) ? (
                    <TextField multiline={multiline} label={props.label} defaultValue={value || (defaultVal as string)} type={type} onChange={(e, value) => {
                        setProp((props: any) => {
                            if (Array.isArray(propValue)) {
                                props[propKey!][index!] = onChange ? onChange(value) : value;
                            } else {
                                props[propKey!] = onChange ? onChange(value) : value;
                            }
                        }, 500);
                    }} />
                ) : type === 'slider' ? (
                    <>
                        <Slider label={props.label} min={0} max={100} step={1} defaultValue={parseInt(value) || 0} showValue snapToStep onChange={(value) => {
                            console.log(value);
                            setProp((props: any) => {
                                if (Array.isArray(propValue)) {
                                    props[propKey!][index!] = onChange
                                        ? onChange(value)
                                        : value;
                                } else {
                                    props[propKey!] = onChange ? onChange(value) : value;
                                }
                            }, 1000);
                        }} />

                    </>
                ) : type === 'radio' ? (
                    <>
                        {props.label ? (
                            <h4 className="text-sm text-light-gray-2">{props.label}</h4>
                                ) : null}
                                <ChoiceGroup 
                            value={value || 0}
                                    onChange={(e, o) => {
                                        const value = o?.value
                                setProp((props: any) => {
                                    props[propKey!] = onChange ? onChange(value) : value;
                                });
                            }}
                        >
                            
                                </ChoiceGroup>
                    </>
                ) : type === 'select' ? (
                    <>
                        {props.label ? (
                            <h4 className="text-sm text-light-gray-2">{props.label}</h4>
                        ) : null}
                        <ToolbarDropdown
                            value={value || ''}
                            onChange={(value: any) =>
                                setProp(
                                    (props: any) =>
                                        (props[propKey!] = onChange ? onChange(value) : value)
                                )
                            }
                            {...props}
                        /></>
                )
                    : type === 'checkbox' ? (
                        <>
                            <ToolbarCheckbox label={props.label} value={value}
                                onChange={(value: any) => {
                                    console.log("Checkbox Value Change", [value]);
                                    setProp(
                                        (props: any) =>
                                            (props[propKey!] = onChange ? onChange(value?.target?.checked) : value?.target?.checked)
                                    )
                                }
                                }
                                {...props}
                            ></ToolbarCheckbox>

                        </>
                    ) : null}
            </div>
        </Stack.Item>
    );
};
