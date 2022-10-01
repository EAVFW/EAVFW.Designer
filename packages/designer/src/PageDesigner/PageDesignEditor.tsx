import { Editor, Frame, Options, Element } from '@craftjs/core';
import { FieldProps } from '@rjsf/core';

import React, { PropsWithChildren, useEffect, useMemo, useState } from 'react';


import { gzip, ungzip } from "pako";

import { useModelDrivenApp, useRibbon } from '@eavfw/apps';
import { useEAVForm } from '@eavfw/forms';
import { isLookup } from '@eavfw/manifest';
import { useDebouncer } from "@eavfw/hooks";
import { upgrades } from './upgrades';
import { PageDesignEditorRibbonHost } from './PageDesignEditorRibbonHost';


import { GridNode, Container } from "@eavfw/designer-nodes"
import { DefaultDocument } from './defaultPageContent';
import { usePageDesignerResolver, RenderNode, Viewport } from '@eavfw/designer-core';







export type PageDesignEditorProps = {
    onChange: FieldProps["onChange"];
    value: any;
} & FieldProps
export const PageDesignEditor: React.VFC<PageDesignEditorProps> = (props) => {
    const { value, entityName, attributeName } = props;

    //  const { items, addItem } = useribbon((ribbonState) => { ribbonState.items})
    const [formData, { onChange }] = useEAVForm((state) => state.formValues);
    //const formData = formContext.formData;
    const app = useModelDrivenApp();
    const entity = app.getEntity(entityName);
    const column = entity.attributes[attributeName];
    console.log([formData, column, formData[column.logicalName.slice(0, -2)]]);

    // const { actions, query, enabled } = useEditor((state) => ({
    //    enabled: state.options.enabled
    //}));
    //  console.log(value);



    console.log([value, formData]);
    const old = useMemo(() => {



        // console.log("Resetting from data", [value, formData, ungzip(atob(value), { to: 'string' })]);
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
    const [, { onChange: onFormDataChange }] = useEAVForm(() => ({}));

    const onNodesChange: Options["onNodesChange"] = useDebouncer((query) => {
        let json = query.serialize();
        console.log("onNodesChange", json);
        console.log("onNodesChange", old);
        console.log(props);

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
            onChange(props => {
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

    return (
        <>

            <Editor onNodesChange={onNodesChange}
                resolver={resolver}
                enabled={true}
                onRender={RenderNode}
            >
                <PageDesignEditorRibbonHost />
                <Viewport showToolbox={false} showSidebar={false} showHeader={false}>
                    <Frame data={old}  >
                        <Element
                            canvas
                            is={Container}
                            width="800px"
                            height="auto"
                            background={{ r: 255, g: 255, b: 255, a: 1 }}
                            padding={['40', '40', '40', '40']}
                            custom={{ displayName: 'Blanket' }}
                        >
                            <Element
                                canvas
                                is={GridNode}
                                custom={{ displayName: 'Content' }}
                            >

                            </Element>


                        </Element>
                    </Frame>
                </Viewport>
            </Editor>
        </>
    )
}