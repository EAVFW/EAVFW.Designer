import { SerializedNode } from "@craftjs/core";

export const upgrades: Record<string, (nodes: Record<string, SerializedNode>) => string> = {
    "initial": (nodes: Record<string, SerializedNode>) => {
        console.log("Upgrading from Initial to 1.0.0");
        return "1.0.0";
    },
    "1.0.0": (nodes: Record<string, SerializedNode>) => {
        console.log("Upgrading from 1.0.0 to 1.0.1");

        return "1.0.1";
    },
    "1.0.1": (nodes: Record<string, SerializedNode>) => {
        console.log("Upgrading from 1.0.1 to 1.0.2");
        for (let [nodeid, node] of Object.entries(nodes)) {
            console.log(node);
            if (typeof (node.type) === "object" && node.type.resolvedName === "TabHeaderNode") {
                node.isCanvas = true;
                node.props.header = { sortOrder: node.parent ? nodes[node.parent].nodes.indexOf(nodeid) : -1, ...node.props.header }
            }
        }
        return "1.0.2";
    }
}