import { makeStyles,shorthands } from '@griffel/react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNode, useEditor } from '@craftjs/core';
import { debounce } from 'debounce';
import { Resizable } from 're-resizable';
import {
    isPercentage,
    pxToPercent,
    percentToPx,
    getElementDimensions,
    classNames
} from '@eavfw/designer-core';

const useStyles = makeStyles({
    indicators: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        '& span': {
            position: 'absolute',
            width: '10px',
            height: '10px',
            backgroundColor: '#fff',
            ...shorthands.borderRadius( '100%'),
            display: 'block',
            boxShadow: '0px 0px 12px -1px rgba(0, 0, 0, 0.25)',
            zIndex: 99999,
            pointerEvents: 'none',
            ...shorthands.border('2px', 'solid','#36a9e0'),
        },
        '& span:nth-child(1)': {
            left: '-5px',
            top: '-5px',
        },
        '& span:nth-child(2)': {
            right: '-5px',
            top: '-5px',
            display: 'block',
        },
        '& span:nth-child(3)': {
            left: '-5px',
            bottom: '-5px',
        },
        '& span:nth-child(4)': {
            bottom: '-5px',
            right: '-5px',
            display: 'block',
        },
    },
    rowBound: {
        '& span:nth-child(1)': {
            left: '50%',
            top: '-5px',
            transform: 'translateX(-50%)',
        },
        '& span:nth-child(2)': {
            display: 'none',
        },
        '& span:nth-child(3)': {
            left: '50%',
            bottom: '-5px',
            transform: 'translateX(-50%)',
        },
        '& span:nth-child(4)': {
            display: 'none',
        },
    },
    columnBound: {
        '& span:nth-child(1)': {
            top: '50%',
            left: '-5px',
            transform: 'translateY(-50%)',
        },
        '& span:nth-child(2)': {
            display: 'none',
        },
        '& span:nth-child(3)': {
            bottom: '50%',
            left: '-5px',
            transform: 'translateY(-50%)',
        },
        '& span:nth-child(4)': {
            display: 'none',
        },
    },
});

const Indicators = ({ bound }: { bound?: 'row' | 'column' }) => {
    const styles = useStyles();
    const className = `${styles.indicators} ${bound === 'row' ? styles.rowBound : ''} ${bound === 'column' ? styles.columnBound : ''}`;
    return (
        <div className={className}>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
        </div>
    );
};

export const Resizer = ({ propKey, children, ...props }: any) => {
    const {
        id,
        actions: { setProp },
        connectors: { connect },
        fillSpace,
        nodeWidth,
        nodeHeight,
        parent,
        active,
        inNodeContext,
    } = useNode((node) => ({
        parent: node.data.parent,
        active: node.events.selected,
        nodeWidth: node.data.props[propKey.width],
        nodeHeight: node.data.props[propKey.height],
        fillSpace: node.data.props.fillSpace,
    }));

    const { isRootNode, parentDirection } = useEditor((state, query) => {
        return {
            parentDirection:
                parent &&
                state.nodes[parent] &&
                state.nodes[parent].data.props.flexDirection,
            isRootNode: query.node(id).isRoot(),
        };
    });

    const resizable = useRef<Resizable>(null!);
    const isResizing = useRef<Boolean>(false);
    const editingDimensions = useRef<any>(null);
    const nodeDimensions = useRef<any>(null);
    nodeDimensions.current = { width: nodeWidth, height: nodeHeight };

    const [internalDimensions, setInternalDimensions] = useState({
        width: nodeWidth,
        height: nodeHeight,
    });

    const updateInternalDimensionsInPx = useCallback(() => {
        const { width: nodeWidth, height: nodeHeight } = nodeDimensions.current;
        const dim = getElementDimensions(resizable.current.resizable?.parentElement!);
        const width = percentToPx(
            nodeWidth,
            resizable.current &&
            dim.width
        );
        const height = percentToPx(
            nodeHeight,
            resizable.current &&
            dim.height
        );

        setInternalDimensions({
            width,
            height,
        });
    }, []);

    const updateInternalDimensionsWithOriginal = useCallback(() => {
        const { width: nodeWidth, height: nodeHeight } = nodeDimensions.current;
        setInternalDimensions({
            width: nodeWidth,
            height: nodeHeight,
        });
    }, []);

    const getUpdatedDimensions = (width: string | number, height: string | number) => {
        const dom = resizable.current.resizable;
        if (!dom) return;

        const currentWidth = parseInt(editingDimensions.current.width),
            currentHeight = parseInt(editingDimensions.current.height);

        return {
            width: currentWidth + parseInt(width.toString()),
            height: currentHeight + parseInt(height.toString()),
        };
    };

    useEffect(() => {
        if (!isResizing.current) updateInternalDimensionsWithOriginal();
    }, [nodeWidth, nodeHeight, updateInternalDimensionsWithOriginal]);

    useEffect(() => {
        const listener = debounce(updateInternalDimensionsWithOriginal, 1);
        window.addEventListener('resize', listener);

        return () => {
            window.removeEventListener('resize', listener);
        };
    }, [updateInternalDimensionsWithOriginal]);

    return (
        <Resizable
            enable={[
                'top',
                'left',
                'bottom',
                'right',
                'topLeft',
                'topRight',
                'bottomLeft',
                'bottomRight',
            ].reduce((acc: any, key) => {
                acc[key] = active && inNodeContext;
                return acc;
            }, {})}
            className={classNames([
                {
                    'm-auto': isRootNode,
                    flex: true,
                },
            ])}
            ref={(ref) => {
                if (ref) {
                    resizable.current = ref;
                    connect(resizable.current.resizable!);
                }
            }}
            size={internalDimensions}
            onResizeStart={(e) => {
                updateInternalDimensionsInPx();
                e.preventDefault();
                e.stopPropagation();
                const dom = resizable.current.resizable;
                if (!dom) return;
                editingDimensions.current = {
                    width: dom.getBoundingClientRect().width,
                    height: dom.getBoundingClientRect().height,
                };
                isResizing.current = true;
            }}
            onResize={(_, __, ___, d) => {
                const dom = resizable.current.resizable;
                let { width, height }: any = getUpdatedDimensions(d.width, d.height);
                if (isPercentage(nodeWidth))
                    width =
                        pxToPercent(width, getElementDimensions(dom?.parentElement!).width) +
                        '%';
                else width = `${width}px`;

                if (isPercentage(nodeHeight))
                    height =
                        pxToPercent(
                            height,
                            getElementDimensions(dom?.parentElement!).height
                        ) + '%';
                else height = `${height}px`;

                if (isPercentage(width) && dom?.parentElement?.style.width === 'auto') {
                    width = editingDimensions.current.width + d.width + 'px';
                }

                if (isPercentage(height) && dom?.parentElement?.style.height === 'auto') {
                    height = editingDimensions.current.height + d.height + 'px';
                }

                setProp((prop: any) => {
                    prop[propKey.width] = width;
                    prop[propKey.height] = height;
                }, 500);
            }}
            onResizeStop={() => {
                isResizing.current = false;
                updateInternalDimensionsWithOriginal();
            }}
            {...props}
        >
            {children}
            {active && (
                <Indicators bound={fillSpace === 'yes' ? parentDirection : undefined} />
            )}
        </Resizable>
    );
};
