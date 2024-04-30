import { useEditor, useNode, UserComponent } from "@craftjs/core";
import React from "react";
import { GridNodeLayoutSelector } from "../Containers/GridNode/GridNodeLayoutSelector";
import { Placeholder } from "./Placeholder";


type PlaceholderNodeProps = {
    content: string;
    children?: React.ReactNode
}
export const PlaceholderNode: UserComponent<PlaceholderNodeProps> = ({content, children}) => {

    const {
        connectors: { connect },
        isSelected,
        actions: { setProp }
    } = useNode((node) => ({
        isSelected: node.events.selected,
    }));

    const { enabled } = useEditor((state) => ({ enabled: state.options.enabled }));
    if (children)
        return <>{children}</>;

    if (!enabled)
        return null;


    return <Placeholder ref={connect as any} >{content}</Placeholder>
}

PlaceholderNode.craft = {
    displayName: 'Placeholder',
    rules: {
        canDrag: () => true,

    },
    related: {
        toolbar: GridNodeLayoutSelector,
    },
};
