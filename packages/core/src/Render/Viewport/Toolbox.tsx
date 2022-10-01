import { Element, useEditor } from '@craftjs/core';

import React from 'react';
import styled from 'styled-components';
 
import { NodePicker } from '../NodePicker/NodePicker';

const ToolboxDiv = styled.div<{ enabled: boolean }>`
  transition: 0.4s cubic-bezier(0.19, 1, 0.22, 1);
  ${(props) => (!props.enabled ? `width: 0;` : '')}
  ${(props) => (!props.enabled ? `opacity: 0;` : '')}
`;

const Item = styled.a<{ move?: boolean }>`
  svg {
    width: 22px;
    height: 22px;
    fill: #707070;
  }
  ${(props) =>
        props.move &&
        `
    cursor: move;
  `}
`;

export const Toolbox = () => {
    const {
        enabled,
        connectors: { create },
    } = useEditor((state) => ({
        enabled: state.options.enabled,
    }));

    return (
        <ToolboxDiv
            enabled={enabled && enabled}
            className="toolbox transition w-12 h-full flex flex-col bg-white"
        >
            <div className="flex flex-1 flex-col items-center pt-3">
               <NodePicker />
            </div>
        </ToolboxDiv>
    );
};
