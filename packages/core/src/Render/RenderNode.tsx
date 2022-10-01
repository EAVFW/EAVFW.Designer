import { useNode, useEditor, Node, EditorState } from '@craftjs/core';
import { ROOT_NODE } from '@craftjs/utils';
import React, { useEffect, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';



import ArrowUp from '../../public/icons/arrow-up.svg';
import Delete from '../../public/icons/delete.svg';
import Move from '../../public/icons/move.svg';
import Visible from '../../public/icons/not-visible.svg';

import { IconButton, IIconProps, makeStyles } from '@fluentui/react';


type SvgCornerProps = {
    alignment: string
}
const alignments = ["top", "left", "bottom", "right"];
const SvgCorner = styled.svg <SvgCornerProps>`
    
    position: absolute;
    ${props => alignments.map(a => props.alignment.indexOf(a) !== -1 ? `${a}: 0px` : `${a}: initial}`).join(';')};
    transform: ${props => `rotate(${props.alignment === 'top left' ? 270 : props.alignment === 'bottom left' ? 180 : props.alignment === 'bottom right' ? 90 : 0}deg)`};
    width: 14px;
    height: 14px;
    display: block;
    cursor: pointer;
`

const IndicatorDiv = styled.div`
  height: 30px;
  margin-top: -29px;
  margin-right:-4;
  font-size: 12px;
  line-height: 12px;

  svg {
    fill: #fff;
    width: 15px;
    height: 15px;
  }
`

const Btn = styled.a`
  padding: 0 0px;
  opacity: 0.9;
  display: flex;
  align-items: center;
  > div {
    position: relative;
    top: -50%;
    left: -50%;
  }
`;
const emojiIcon: IIconProps = { iconName: 'Add' };
interface IRenderNode {
    canAddTop?: boolean,
    canAddBottom?: boolean,
    canAddLeft?: boolean,
    canAddRight?: boolean
}
function getRenderInfo(node: Node) {
    return node.data.custom.renderNode as IRenderNode | undefined;
}
function collector(state: EditorState, id: string) {
    if (!state.nodes[id])
        console.log("RenderNodeCOllector", [state, id]);
    return {
        isActive: state.nodes[id]?.events.selected,
    }
}


const styles = makeStyles(theme => ({
    wrapper: {
        color: theme.palette.white,
        paddingTop: ".5rem",
        paddingBottom: ".5rem",
        paddingLeft: ".5rem",
        paddingRight: ".5rem",
        background: theme.palette.black,
        alignItems: 'center',
        display: "flex",
        position: "fixed",
        boxSizing: "border-box",



    }
}));


export const RenderNode = ({ render }: any) => {
    const { id } = useNode();

    const {
        actions: { setOptions, selectNode, delete: deleteNode, add: addNode },
        query: { parseFreshNode, parseSerializedNode, node: getNode },
        isActive } = useEditor(state => collector(state, id));

    const {
        isHover,
        dom,
        name,
        moveable,
        deletable,
        connectors: { drag },
        parent,
        nodeIndex,
        canAddLeft,
        canAddRight,
        canAddTop,
        canAddBottom,
        parentName
    } = useNode((node) => ({
        isHover: node.events.hovered,
        dom: node.dom!,
        canAddLeft: getRenderInfo(node)?.canAddLeft ?? false,
        canAddRight: getRenderInfo(node)?.canAddRight ?? false,
        canAddTop: getRenderInfo(node)?.canAddTop ?? false,
        canAddBottom: getRenderInfo(node)?.canAddBottom ?? false,
        name: node.data.custom.displayName || node.data.displayName,
        moveable: getNode(node.id).isDraggable(),
        deletable: getNode(node.id).isDeletable(),
        nodeIndex: node.data.parent ? getNode(node.data.parent ?? "ROOT").childNodes().indexOf(node.id) : undefined,
        parentName: getNode(node.data.parent ?? "ROOT").get().data.custom.displayName,
        parent: node.data.parent ?? "ROOT",
        props: node.data.props,
    }));

    const style = styles();

    const currentRef = useRef<HTMLDivElement>(null);
    const cornerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (dom) {
            if (isActive || isHover) dom.classList.add('component-selected');
            else dom.classList.remove('component-selected');
        }
    }, [dom, isActive, isHover]);

    const getPos = useCallback((dom: HTMLElement) => {
        const { top, left, bottom, width, height } = dom
            ? dom.getBoundingClientRect()
            : { top: 0, left: 0, bottom: 0, width: 0, height: 0 };
        return {
            top: `${top > 0 ? top : bottom}px`,
            left: `${left}px`,
            width: `${width}px`,
            height: `${height}px`

        };
    }, []);

    const scroll = useCallback(() => {
        const { current: currentDOM } = currentRef;


        if (currentDOM) {
            const { top, left } = getPos(dom);
            currentDOM.style.top = top;
            currentDOM.style.left = left;
        }

        const { current: cornerDom } = cornerRef;

        if (cornerDom) {
            const { top, left } = getPos(dom);
            cornerDom.style.top = top;
            cornerDom.style.left = left;
        }


    }, [dom, getPos]);

    useEffect(() => {
        document.querySelector(".ms-ScrollablePane--contentContainer")
            ?.addEventListener('scroll', scroll);

        document
            .querySelector('.craftjs-renderer')
            ?.addEventListener('scroll', scroll);

        return () => {

            document.querySelector(".ms-ScrollablePane--contentContainer")
                ?.removeEventListener('scroll', scroll);
            document
                .querySelector('.craftjs-renderer')
                ?.removeEventListener('scroll', scroll);
        };
    }, [scroll]);



    return (
        <>
            {isHover || isActive
                ? ReactDOM.createPortal(
                    <IndicatorDiv
                        ref={currentRef}
                        className={style.wrapper}
                        style={{
                            left: getPos(dom).left,
                            top: getPos(dom).top,
                            zIndex: 9999,
                        }}
                    >
                        <h2 className="flex-1 mr-4">{name}</h2>
                        {/*{isActive ? (*/}
                        {/*    <Btn className="mr-2 cursor-pointer" onClick={() => { } }>*/}
                        {/*        <Visible style={{ width: "20px"}} />*/}
                        {/*    </Btn>*/}
                        {/*) : null}*/}
                        {moveable && isActive ? (
                            <Btn className="mr-2 cursor-move" ref={(drag as ((a: HTMLAnchorElement) => void))}>
                                <Move />
                            </Btn>
                        ) : null}
                        {id !== ROOT_NODE && (
                            <Btn
                                className="mr-2 cursor-pointer"
                                onClick={() => {
                                    selectNode(parent);
                                }}
                            >
                                <ArrowUp />
                            </Btn>
                        )}
                        {deletable ? (
                            <Btn
                                className="cursor-pointer"
                                onMouseDown={(e: React.MouseEvent) => {
                                    e.stopPropagation();
                                    deleteNode(id);
                                }}
                            >
                                <Delete />
                            </Btn>
                        ) : null}

                    </IndicatorDiv>,
                    document.querySelector('.page-container')!
                )
                : null}

            {isHover || isActive
                ? ReactDOM.createPortal(
                    <div ref={cornerRef} style={{
                        pointerEvents: "none",
                        position: "fixed",
                        ...getPos(dom),
                        zIndex: 9999,
                    }}>
                        {canAddTop && <IconButton style={{ pointerEvents: "all", position: "absolute", background: "lightgray", borderRadius: "20px", left: 'calc(50% - 16px)', top: 'calc(0px - 11px)', cursor: 'pointer' }} iconProps={emojiIcon} title="Add" ariaLabel="Add" onClick={() => {
                            console.log("TOP ADD");

                            addNode(
                                parseFreshNode({
                                    data: {
                                        type: "GridNode", // GridNode,
                                        displayName: "Empty",
                                        isCanvas: true,
                                        hidden: false,
                                        linkedNodes: {},
                                        nodes: [],
                                        parent: parent ?? "ROOT",
                                        props: {},
                                        custom: {
                                            displayName: "Empty"
                                        },
                                    }
                                }).toNode(), parent, nodeIndex ?? 0);

                        }} />}
                        {canAddLeft && typeof nodeIndex !== "undefined" && <IconButton style={{ pointerEvents: "all", position: "absolute", background: "lightgray", borderRadius: "20px", left: 'calc(0% - 16px)', top: 'calc(50% - 11px)', cursor: 'pointer' }} iconProps={emojiIcon} title="Add" ariaLabel="Add" onClick={() => console.log("LEFT ADD")} />}
                        {canAddRight && typeof nodeIndex !== "undefined" && <IconButton style={{ pointerEvents: "all", position: "absolute", background: "lightgray", borderRadius: "20px", right: 'calc(0% - 16px)', top: 'calc(50% - 11px)', cursor: 'pointer' }} iconProps={emojiIcon} title="Add" ariaLabel="Add" onClick={() => console.log("Right ADD")} />}

                        <SvgCorner alignment="top left">
                            <path d="M0,0 L14,0 L14,14 L12,14 L12,2 L0,2 Z" stroke="rgba(255,255,255,.5)" strokeWidth="1" fill="#9C27B0"></path>
                        </SvgCorner>
                        <SvgCorner alignment="top right">
                            <path d="M0,0 L14,0 L14,14 L12,14 L12,2 L0,2 Z" stroke="rgba(255,255,255,.5)" strokeWidth="1" fill="#9C27B0"></path>
                        </SvgCorner>
                        <SvgCorner alignment="bottom left">
                            <path d="M0,0 L14,0 L14,14 L12,14 L12,2 L0,2 Z" stroke="rgba(255,255,255,.5)" strokeWidth="1" fill="#9C27B0"></path>
                        </SvgCorner>
                        <SvgCorner alignment="bottom right">
                            <path d="M0,0 L14,0 L14,14 L12,14 L12,2 L0,2 Z" stroke="rgba(255,255,255,.5)" strokeWidth="1" fill="#9C27B0"></path>
                        </SvgCorner>

                        {canAddBottom && <IconButton style={{ pointerEvents: "all", position: "absolute", background: "lightgray", borderRadius: "20px", left: 'calc(50% - 16px)', bottom: 'calc(0px - 11px)', cursor: 'pointer' }} iconProps={emojiIcon} title="Add" ariaLabel="Add" onClick={() => {
                            console.log("Bottom ADD")

                            addNode(
                                parseSerializedNode({
                                    type: {
                                        resolvedName: "GridNode"
                                    },
                                    displayName: "Doh after",
                                    isCanvas: true,
                                    hidden: false,
                                    linkedNodes: {},
                                    nodes: [],
                                    parent: parent,
                                    props: {},
                                    custom: {
                                        displayName: "Empty"
                                    },
                                }).toNode(), parent, (nodeIndex ?? getNode("ROOT").childNodes().length - 1) + 1);
                        }
                        } />}

                    </div>,
                    document.querySelector('.page-container')!
                ) : null}
            {render}
        </>
    );
};
