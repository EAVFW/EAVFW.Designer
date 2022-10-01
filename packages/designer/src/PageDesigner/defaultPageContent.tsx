import { Editor, Frame, Element, Options, useEditor, useNode, FreshNode, EditorState, SerializedNode } from '@craftjs/core';

import { GridNode, Container } from "@eavfw/designer-nodes"

export const DefaultDocument: React.FC = () => {

    return <Element
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
                "width": "800px",
                "height": "auto"
            }, "displayName": "Container", "custom": {
                renderNode: {
                    canAddLeft: false,
                    canAddRight: false,
                    canAddTop: true,
                    canAddBottom: true
                }, "displayName": "Blanket 2"
            }, "hidden": false, "nodes": ["GBCxB0dj1x"], "linkedNodes": {}
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