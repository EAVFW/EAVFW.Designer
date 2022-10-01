import { useEditor, useNode, Element } from "@craftjs/core";
import { ContextualMenu, IDragOptions, Modal } from "@fluentui/react";
import { useId, useBoolean } from '@fluentui/react-hooks';
import React, { PropsWithChildren, ReactChild, ReactElement, ReactFragment } from "react";
import { Cell } from "./Cell";
import { GridContainer } from "../GridContainer";
import { GridNodeLayoutSelector } from "./GridNodeLayoutSelector";
import { GridNodeSettings } from "./GridNodeSettings";
import { Placeholder } from "../../Placeholder/Placeholder";
import { registerNode } from "@eavfw/designer-core";


export type GridNodeProps = {
    grid: any,
    //gridStyles:any
    gridId: string
};

export const GridNode: React.FC<PropsWithChildren<Partial<GridNodeProps>>> & {craft ?: any} = ({children, gridId, grid}) => {



    const {
        connectors: { connect },
        actions: { setProp },
        //   grid,
        hovered,
        displayName,
        id,
        childNodes
    } = useNode((node) => ({
        childNodes: node.data.nodes,
        selected: node.events.selected,
        hovered: node.events.hovered,
        // grid: node.data.props.grid,
        displayName: node.data.custom.displayName
    }));
    const { enabled, query: { node: getNode } } = useEditor((state) => ({ enabled: state.options.enabled }));

    const [isModalOpen, { setTrue: showModal, setFalse: hideModal }] = useBoolean(false);
    const [isDraggable, { toggle: toggleIsDraggable }] = useBoolean(false);
    const [keepInBounds, { toggle: toggleKeepInBounds }] = useBoolean(false);
    const titleId = useId('title');
    // Normally the drag options would be in a constant, but here the toggle can modify keepInBounds
    const dragOptions = React.useMemo(
        (): IDragOptions => ({
            moveMenuItemText: 'Move',
            closeMenuItemText: 'Close',
            menu: ContextualMenu,
            keepInBounds,
        }),
        [keepInBounds],
    );

    // console.log("[GRID]", grid);

    //  const { actions, query } = useEditor();

    //const addSomeNodes = () => {
    //    alert("Adding nodes");
    //   // const childNode = query.parseReactElement(<div></div>);
    //   // actions.add(childNode,);

    //   // const cells = [];
    //    let i = 0;
    //    for (let cell of grid.nodes) {

    //        let cellProps = cell.styles.instance['grid-cell'].md ?? cell.styles.instance['grid-cell'].xs;

    //        const childNode = query.parseReactElement(<Cell key={`${gridId}cell${grid.nodes.indexOf(cell as any)}`} cell={cellProps}>
    //            <Element id={`${gridId}cell${grid.nodes.indexOf(cell as any)}`} is={Cell}
    //                canvas custom={{ displayName: cell.role }} >
    //            </Element>
    //        </Cell>);
    //        actions.addNodeTree(childNode.toNodeTree(), id, i++);
    //    }
    //}

    //useEffect(() => {
    //    if (grid && !children)
    //        addSomeNodes();
    //}, [grid]);

    console.log("Children Nodes: ", [childNodes, children]);



    if (!grid) {

        if (!enabled)
            return null;

        //  console.log("hovered", hovered)
        return <Placeholder ref={connect as any}>
            <Modal
                titleAriaId={titleId}
                isOpen={isModalOpen}
                onDismiss={hideModal}
                isBlocking={false}

                dragOptions={isDraggable ? dragOptions : undefined}
            >
                <GridNodeLayoutSelector />
            </Modal>
            {/*<IconButton style={{ position: "absolute", background: "lightgray", borderRadius: "20px", display: hovered?'block':'none' }} hidden={!hovered} iconProps={emojiIcon} title="Add" ariaLabel="Add" onClick={showModal} />*/}
            {displayName}
        </Placeholder>
    }

    const gridInstance = grid.styles.instance.grid.md ?? grid.styles.instance.grid.xs;
    const childrenMap = Object.fromEntries(((children as ReactElement).props.children as ReactElement[]).map(c => [c.props.id, c]));
    console.log("childrenMap", childrenMap);

    const cells = [];
    for (let cell of childNodes) {
        let element = childrenMap[cell];
        console.log("Node Props", getNode(cell).get());
        let nodeProps = grid.nodes[getNode(cell).get().data.custom.nodeIndex];

        let cellProps = nodeProps.styles.instance['grid-cell'].md ?? nodeProps.styles.instance['grid-cell'].xs;
        cells.push(<Cell key={`${gridId}cell${childNodes.indexOf(cell as any)}`} cell={cellProps}>
            {element}
        </Cell>);
    }
    return <GridContainer key={gridId} grid={gridInstance} ref={connect as any}>
        {cells}
    </GridContainer>


    //const cells = [];
    //console.log("Layout Nodes", grid.nodes);
    //for (let cell of grid.nodes) {

    //    let cellProps = cell.styles.instance['grid-cell'].md ?? cell.styles.instance['grid-cell'].xs;

    //    cells.push(<Cell key={`${gridId}cell${grid.nodes.indexOf(cell as any)}`} cell={cellProps}>
    //        <Element   id={`${gridId}cell${grid.nodes.indexOf(cell as any)}`} is={GridNode}
    //            canvas custom={{ layoutNodeIndex: grid.nodes.indexOf(cell as any) , displayName: cell.role, renderNode: { canAddTop: false } }} >
    //        </Element>
    //    </Cell>);
    //}

    //return <GridContainer key={gridId} grid={gridInstance} ref={connect as any}>
    //    {cells}
    //</GridContainer>

};

GridNode.craft = {
    displayName: 'Grid',
    custom: {
        renderNode: {
            canAddLeft: false,
            canAddRight: false,
            canAddTop: true,
            canAddBottom: true
        }
    },
    //  defaultProps: defaultProps,
    rules: {
        canDrag: () => true, //grid nodes can be dragged around
        canMoveIn: () => false, // no elements can be moved into the grid node.

    },
    related: {
        toolbar: GridNodeSettings,
    },

};

registerNode("GridNode", GridNode);