import { Editor, Frame, Element, Options, useEditor, useNode, FreshNode, EditorState, SerializedNode } from '@craftjs/core';

import { GridNode, Container, ContainerProps } from "@eavfw/designer-nodes"

export const DefaultDocument: React.FC<Partial<ContainerProps>> = (props) => {

    return <Element
        canvas
        is={Container} {...props}
    >
        <Element
            canvas
            is={GridNode}
            custom={{ displayName: 'Content' }}
        >

        </Element>


    </Element>
}

const initial = JSON.stringify(
    {
        "ROOT": {
            "type": { "resolvedName": "Container" },
            "isCanvas": true,
            "props": {
                "flexDirection": "column",
                "alignItems": "flex-start",
                "justifyContent": "flex-start",
                "fillSpace": "no",
                "padding": ["40", "40", "40", "40"],
                "margin": ["0", "0", "0", "0"],
                "background": { "r": 255, "g": 255, "b": 255, "a": 1 },
                "color": { "r": 0, "g": 0, "b": 0, "a": 1 },
                "shadow": 0,
                "radius": 0,
                "width": "90%",
                "height": "auto"
            },
            "displayName": "Container",
            "custom": {
                renderNode: {
                    canAddLeft: false,
                    canAddRight: false,
                    canAddTop: true,
                    canAddBottom: true
                },
                "displayName": "New Slide"
            },
            "hidden": false,
            "nodes": ["GBCxB0dj1x"],
            "linkedNodes": {}
        },
        "GBCxB0dj1x": {
            "type": { "resolvedName": "GridNode" },
            "isCanvas": true, "props": {},
            "displayName": "Grid",
            "custom": { "displayName": "Content" },
            "parent": "ROOT",
            "hidden": false,
            "nodes": [],
            "linkedNodes": {}
        }
    }
);

export default initial;