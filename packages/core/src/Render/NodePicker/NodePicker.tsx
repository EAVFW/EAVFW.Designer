import { FreshNode, useEditor, useNode, UserComponent } from "@craftjs/core";
import { PrimaryButton } from "@fluentui/react";
import React, { CSSProperties, Fragment, useCallback } from "react";
import { usePageDesignerResolver, UserComponentMap } from "../../Registration";
 

export type NodePickerProps = {

}

const buttonStyle: CSSProperties = { marginBottom: 15, border: "none", backgroundColor: 'rgba(38, 128, 235, 1)' };
const NodeButton = ({ node, label, replaceNode }: { label: string, node: FreshNode, replaceNode: Function }) => {

    return <PrimaryButton style={buttonStyle} onClick={(e) => {
        replaceNode(node);

    }} label={label} >{label}</PrimaryButton>
}

const IsUserComponent = (shape: string | UserComponent): shape is UserComponent => typeof (shape) !== "string";
const IsUserComponentEntry = (shape: [string, string | UserComponent]): shape is [string, UserComponent] => typeof (shape[1]) !== "string" && (shape[1].craft?.custom?.target === 'components' ?? false);

export const NodePicker: React.FC<NodePickerProps> = () => {

    const { actions: { setOptions, selectNode, add: addNode, delete: deleteNode }, query: { parseFreshNode, parseSerializedNode, node: getNode } } = useEditor();


    const {
        actions: { setProp },
        propValue,
        node,
        id,
        layoutNodeIndex,
        parentNodeId,
        nodeIndex
    } = useNode((node) => ({
        propValue: node.data.props["grid"],
        layoutNodeIndex: node.data.custom.nodeIndex,
        node: node,
        id: node.id,
        parentNodeId: node.data.parent,
        nodeIndex: node.data.parent ? getNode(node.data.parent).childNodes().indexOf(node.id) : undefined
    }));

    const replaceNode = useCallback((freshNode: FreshNode) =>{

        freshNode.data.custom = freshNode.data.custom ?? {};
        freshNode.data.custom.nodeIndex = layoutNodeIndex;
        // Create a new valid Node object from the fresh Node
        const node = parseFreshNode(freshNode as any).toNode();
        if (parentNodeId) {
            addNode(node, parentNodeId, nodeIndex);
        }
        deleteNode(id);
        selectNode(node.id);
    }, [id]);

  

    const resolver = usePageDesignerResolver();


    return <div>
         {
            Object.entries(resolver)
                .filter(IsUserComponentEntry)
                .map(([key, node]) => <Fragment key={key}>
                    <NodeButton replaceNode={replaceNode} node={{
                        data: {
                            type: node
                        }
                    }} label={`Add ${node.craft?.displayName ?? key}`} />
                    <br />
                </Fragment>)
        }

    </div>
}


