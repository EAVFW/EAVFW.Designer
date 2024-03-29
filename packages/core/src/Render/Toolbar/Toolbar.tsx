import { useEditor } from '@craftjs/core';
import React from 'react';

export * from './ToolbarItem';
export * from './ToolbarSection';
export * from './ToolbarTextInput';
export * from './ToolbarDropdown';

import {
    Accordion,
    AccordionHeader,
    AccordionItem,
    AccordionPanel,

} from "@fluentui/react-components";

export const Toolbar = () => {
    const { active, related } = useEditor((state) => ({
        active: state.events.selected && state.events.selected.size > 0,
        related:
            Array.from(state.events.selected.values()).map(n => state.nodes[n].related)[0],
    }));
    console.log("active", active);
    console.log("related", related);
    return (
        <div className="py-1 h-full">
            {active && related.toolbar && <Accordion>{React.createElement(related.toolbar)}</Accordion>}
            {!active && (
                <div
                    className="px-5 py-2 flex flex-col items-center h-full justify-center text-center"
                    style={{
                        color: 'rgba(0, 0, 0, 0.5607843137254902)',
                        fontSize: '11px',
                    }}
                >
                    <h2 className="pb-1">Click on a component to start editing.</h2>
                    <h2>
                        You could also double click on the layers below to edit their names,
                        like in Photoshop
                    </h2>
                </div>
            )}
        </div>
    );
};
