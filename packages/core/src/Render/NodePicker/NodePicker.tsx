import { FreshNode, Nodes, useEditor, useNode, UserComponent } from "@craftjs/core";
import { PrimaryButton } from "@fluentui/react";
import React, { CSSProperties, Fragment, useCallback } from "react";
import { registredName, usePageDesignerResolver, UserComponentMap } from "../../Registration";
 

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

function sameTypeExistInParent(n: UserComponent, id:string, nodes: Nodes) {
    console.log("sameTypeExistInParent", [n, id, nodes, registredName(n)]);
    const typename = registredName(n);
    let node = nodes[id];
    while (node) {
        console.log("sameTypeExistInParent", [node.data.type, node.data.type===n, typename]);
        if (node.data.type === typename || node.data.type === n)
            return true;
        
        node = nodes[node.data.parent!];
    }

    return false;

}

export const NodePicker: React.FC<NodePickerProps> = () => {

    const { nodes, actions: { setOptions, selectNode, add: addNode, delete: deleteNode }, query: { parseFreshNode, parseSerializedNode, node: getNode } } = useEditor(s => ({ nodes: s.nodes }));


    const {        
        id,
        layoutNodeIndex,
        parentNodeId,
        nodeIndex
    } = useNode((node) => ({
       
        layoutNodeIndex: node.data.custom.nodeIndex, 
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
                .filter(x => x[1].craft?.custom?.nest !== false || !sameTypeExistInParent(x[1],id,nodes) )
                .map(([key, node]) => <Fragment>
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


