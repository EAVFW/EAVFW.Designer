import { useEditor, useNode } from "@craftjs/core";
import React from "react";
import { Cell } from "./Cell";
import { CellTemplate } from "./CellTemplate";
import { GridContainer } from "../GridContainer";
import { GridNode } from "./GridNode";
import { GridNodeLayoutSelectorProps } from "./GridNodeLayoutSelectorProps";
import { GridSnippetContainer } from "./GridSnippetContainer";
import { GridTemplates } from "./GridTemplates";


export const GridNodeLayoutSelector: React.FC<GridNodeLayoutSelectorProps> = () => {



    const {
        actions: { setProp, setCustom },
        propValue,
        node,
        id
    } = useNode((node) => ({
        propValue: node.data.props["grid"],
        node: node,
        id: node.id
    }));

    const { actions: { setOptions, selectNode, add: addNode }, query: { parseFreshNode, parseSerializedNode, node: getNode } } = useEditor();

    //const { actions: { }, test, query } = useEditor((state) => console.log("gridnodestate", [propValue, state]) as any || ({
    //     test: 1
    // }));

    //    const layers = useLayer(p => ({ grid: propValue ?? {}}));

    if (!node.data.parent)
        return null;


    const parentNode =  getNode(node.data.parent);
    const idx = parentNode.childNodes().indexOf(id);
    return <GridSnippetContainer>
        {GridTemplates.map((grid, index) => (
            <a key={`gridtemplate${index}`} style={{ width: "70px", height: "50px", margin: "1px" }} href="#" onClick={(e) => {

                e.preventDefault();
                e.stopPropagation();


                let template = GridTemplates[index];

                for (let i = 0; i < template.nodes.length; i++) {

                    const node = parseFreshNode({
                        data: {
                            type: GridNode,
                            props: {
                                node: template.nodes[i]
                            },
                            custom: {
                                nodeIndex: i,
                                displayName: template.nodes[i].role,
                                renderNode: { canAddTop: false }
                            }
                        }
                    }).toNode();

                    addNode(node, id, i);
                }

                setProp((props: any) => {
                    console.log("oldGrid", [propValue, node, Object.values(node.data.linkedNodes)]);

                    // props["gridStyles"] = GridTemplates[index].styles;
                    props["grid"] = GridTemplates[index];
                    props["gridId"] = `Grid ${index}`;
                    //setTimeout(() => {
                    //    selectNode();

                    //}, 0);
                }, 500);
                setCustom((custom: any) => { custom.displayName = `Grid ${index}` }, 500)
                //     actions.

                return false;
            }}>
                <GridContainer grid={grid.styles.instance.grid.md ?? grid.styles.instance.grid.xs}>
                    {grid.nodes
                        .map((cell) => ({ cell, cellProps: (cell.styles.instance['grid-cell'] as any).md ?? cell.styles.instance['grid-cell'].xs }))
                        .map(({ cellProps, cell }, cellindex) => <Cell key={`gridtemplate${index}_${cellindex}`} style={{ padding: "2px" }} cell={cellProps}><CellTemplate role={cell.role} /></Cell>)}
                </GridContainer>
            </a>)
        )}


    </GridSnippetContainer>

}