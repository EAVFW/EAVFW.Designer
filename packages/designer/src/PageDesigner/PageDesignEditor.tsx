import { Editor, Frame, Options, Element, ElementProps, SerializedNodes, useEditor } from '@craftjs/core';
import { FieldProps } from '@rjsf/utils';

import React, { PropsWithChildren, ReactComponentElement, useEffect, useMemo, useState } from 'react';


import { gzip, ungzip } from "pako";

import { RegistereControl, useModelDrivenApp, useRibbon } from '@eavfw/apps';
import { useEAVForm } from '@eavfw/forms';
import { isLookup } from '@eavfw/manifest';
import { useDebouncer } from "@eavfw/hooks";
import { upgrades } from './upgrades';
import { PageDesignEditorRibbonHost } from './PageDesignEditorRibbonHost';


import { GridNode, Container, ContainerProps } from "@eavfw/designer-nodes"
import { DefaultDocument } from './defaultPageContent';
import { usePageDesignerResolver, RenderNode, Viewport } from '@eavfw/designer-core';
import { resolve } from 'path/posix';







export type PageDesignEditorProps = {
    initial: SerializedNodes | string
    onChange: FieldProps["onChange"];
    value: any;
} & FieldProps & Partial<ContainerProps>
export const PageDesignEditor: React.VFC<PropsWithChildren<PageDesignEditorProps>> = ({
    value, entityName, attributeName, initial, children, ...containerProps
}) => {



    const [formData, { onChange: onFormDataChange }] = useEAVForm((state) => state.formValues);

    const app = useModelDrivenApp();
    const entity = app.getEntity(entityName);
    const column = entity.attributes[attributeName];

    const old = useMemo(() => {

        try {
            return isLookup(column.type) ?
                formData[column.logicalName.slice(0, -2)]?.data ? ungzip(new Uint8Array(atob(formData[column.logicalName.slice(0, -2)]?.data as string).split("").map(function (c) {
                    return c.charCodeAt(0);
                })), { to: "string" }) as string : undefined
                : value ? ungzip(new Uint8Array(atob(value as string).split("").map(function (c) {
                    return c.charCodeAt(0);
                })), { to: "string" }) as string : undefined

        } catch (err) {
            console.log(err);
            return undefined;
        }
    }, [value]);


    const onNodesChange: Options["onNodesChange"] = useDebouncer((query) => {
        let json = query.serialize();
        console.log("onNodesChange", json);
        console.log("onNodesChange", old);


        if (json === "{}")
            return;

        let layoutVersion = formData["layoutversion"] ?? "initial";
        const nodes = query.getSerializedNodes();

        while (layoutVersion in upgrades) {


            layoutVersion = upgrades[layoutVersion](nodes);


        }

        if (layoutVersion !== formData["layoutversion"]) {
            json = JSON.stringify(nodes);

            onFormDataChange(props => { props["layoutversion"] = layoutVersion });

        }


        if (old !== json) {
            console.log("Changing PageDesignEditor Content", [formData, JSON.parse(old ?? "{}"), JSON.parse(json)]);
            // console.log([JSON.parse(old ?? "{}"), JSON.parse(json)]);
            const content = { ... (formData[column.logicalName.slice(0, -2)] ?? { path: "page.json", container: "pages", contenttype: "application/json" }) };
            //console.log(gzip(json, { to: "string" }));
            //console.log(btoa(gzip(json, { to: "string" })));
            // var decoder = new TextDecoder('utf-8');
            // var b64encoded = btoa(unescape(lzstring.compressToUTF16(json)));

            //var decoder = new TextDecoder('utf8');
            //var b64encoded = btoa(decoder.decode(gzip(json)));

            content.data = btoa(String.fromCharCode.apply(null, Array.from(gzip(json))));
            onFormDataChange(props => {
                if (isLookup(column.type)) {
                    props[column.logicalName.slice(0, -2)] = content;
                } else {
                    props[column.logicalName] = content.data;
                }

            });
        }

    }
        , 1000, [old]
    );
    const resolver = usePageDesignerResolver();
    const defaultDoc = DefaultDocument(containerProps);
    return (
        <>

            <Editor onNodesChange={onNodesChange}
                resolver={resolver}
                enabled={true}
                onRender={RenderNode}
            >
                {children}
                <PageDesignEditorRibbonHost initial={initial} />
                <Viewport showToolbox={false} showSidebar={false} showHeader={false}>

                    <Frame data={old}  >
                        {defaultDoc}

                    </Frame>
                </Viewport>

            </Editor>
        </>
    )
}

export const CraftEditor: React.FC<PropsWithChildren<
    Partial<Options>
    
>> = (
{
    children, onNodesChange, resolver = usePageDesignerResolver(), ...containerProps
}) => {

  
    return (
        <Editor  onNodesChange={onNodesChange} resolver={resolver}
            enabled={true}
            onRender={RenderNode}
        >
            {children}
             
        </Editor>
    );
}

export const CraftViewPort: React.FC<{
    defaultValue?: SerializedNodes | string,
    value?: string | SerializedNodes
} & Partial<ContainerProps> & Partial<ElementProps<React.ElementType>>> = ({ value, defaultValue, ...containerProps }) => {

    const defaultDoc = DefaultDocument(containerProps);
    return (<Viewport showToolbox={false} showSidebar={false} showHeader={false}>

        <Frame data={value}  >
            {defaultDoc}
        </Frame>
    </Viewport>)
}

export const useEditorChanges = () => {
    return  useEditor((state, query) => {
        // using state.nodes would result in too calls of the useEffect
        // getSerializedNodes is more stable 
        return { nodes: query.getSerializedNodes() };
    });

}


RegistereControl("PageDesignEditor", PageDesignEditor);