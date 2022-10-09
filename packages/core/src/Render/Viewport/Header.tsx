import { useEditor } from '@craftjs/core';

import React from 'react';
import styled from 'styled-components';

import Checkmark from '../../Icons/check.svg';
import Customize from '../../Icons/customize.svg';
import RedoSvg from '../../Icons/toolbox/redo.svg';
import UndoSvg from '../../Icons/toolbox/undo.svg';




import { SerializedNode } from "@craftjs/core";
import { classNames } from '../../Utils/classNames';
import { makeStyles, Tooltip } from '@fluentui/react';

function getDescendants(
    parsedData: Record<string, SerializedNode>,
    nodeId: string
) {
    const nodes = {} as any;

    function recursiveMap(nodeId:string) {
        const node = parsedData[nodeId];

        // Add Child nodes
        node.nodes.forEach((nodeId) => recursiveMap(nodeId));

        // Add linked nodes
        Object.keys(node.linkedNodes).map((key) => {
            const nodeId = node.linkedNodes[key];
            return recursiveMap(nodeId);
        });

        nodes[nodeId] = node;
    }
    recursiveMap(nodeId);
    return nodes;
}

/**
 * `sanitizeSerializedData`
 * Starting from a `rootId`, return only the necessary 
 * nodes by traversing child and linked nodes.
 */
export default function sanitizeSerializedData(
    serializedData: string,
    rootId: string
): Record<string, SerializedNode> {
    try {
        const parsed = JSON.parse(serializedData);
        const nodes = getDescendants(parsed, rootId);
        return nodes;
    } catch (error) {
        return {};
    }
}

const HeaderDiv = styled.div`
  width: 100%;
  height: 45px;
  z-index: 99999;
  position: relative;
  padding: 0px 10px;
  background: #d4d4d4;
  display: flex;
`;

const Btn = styled.a`
  display: flex;
  align-items: center;
  padding: 5px 15px;
  border-radius: 3px;
  color: #fff;
  font-size: 13px;
  svg {
    margin-right: 6px;
    width: 12px;
    height: 12px;
    fill: #fff;
    opacity: 0.9;
  }
`;

const Item = styled.a<{ disabled?: boolean }>`
  margin-right: 10px;
  cursor: pointer;
  svg {
    width: 20px;
    height: 20px;
    fill: #707070;
  }
  ${(props) =>
    props.disabled &&
    `
    opacity:0.5;
    cursor: not-allowed;
  `}
`;

const SaveButton = () => {
    const { query } = useEditor();
    return <a onClick={() => {


        for (let id of Object.keys(query.getState().nodes)) {
            try {
                console.log(query.getState().nodes[id]);
                console.log(query.node(id));
                console.log(query.node(id).toSerializedNode());
              
               
            } catch (err) {
                console.log(err);
            }
        }

        //const nodePairs = Object.keys(query.getState().nodes).map((id: string) => [
        //    id,
        //    query.node(id).toSerializedNode(),
        //]);
        //console.log(nodePairs);
        //console.log(query.getState()) as any || console.log(query.getSerializedNodes())
        console.log(query.serialize());
        console.log(sanitizeSerializedData(query.serialize(),"ROOT"));
    }
    }>Get JSON</a>
}

export const Header = () => {
  const { enabled, canUndo, canRedo, actions } = useEditor((state, query) => ({
    enabled: state.options.enabled,
    canUndo: query.history.canUndo(),
    canRedo: query.history.canRedo(),
  }));
    
  return (
    <HeaderDiv className="header text-white transition w-full">
      <div className="items-center flex w-full px-4 justify-end">
        {enabled && (
          <div className="flex-1 flex">
            <Tooltip title="Undo" >
              <Item disabled={!canUndo} onClick={() => actions.history.undo()}>
                <UndoSvg />
              </Item>
            </Tooltip>
            <Tooltip title="Redo" >
              <Item disabled={!canRedo} onClick={() => actions.history.redo()}>
                <RedoSvg />
              </Item>
            </Tooltip>
          </div>
        )}
              <div className="flex">
                  <SaveButton />
                  <Btn
                      className={classNames([
              'transition cursor-pointer',
              {
                'bg-green-400': enabled,
                'bg-primary': !enabled,
              },
            ])}
            onClick={() => {
              actions.setOptions((options) => (options.enabled = !enabled));
            }}
          >
            {enabled ? <Checkmark /> : <Customize />}
            {enabled ? 'Finish Editing' : 'Edit'}
          </Btn>
        </div>
      </div>
    </HeaderDiv>
  );
};
