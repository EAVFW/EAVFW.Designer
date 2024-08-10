import { useEditor } from '@craftjs/core';
import { makeStyles, tokens, shorthands } from '@fluentui/react-components';

import React, { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react';

import { classNames } from '../../Utils/classNames';
import { Dismiss24Regular } from "@fluentui/react-icons";
import {
    DrawerBody,
    DrawerHeader,
    DrawerHeaderTitle,
    Drawer,
    DrawerProps,
    Button,
    Label,
    Radio, Accordion,
    RadioGroup,
    useId,
} from "@fluentui/react-components";


import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Toolbox } from './Toolbox';
export type ViewPortProps = {
    showToolbox?: boolean;
    showHeader?: boolean;
    showSidebar?: boolean;
}
type styleProps = {
    enabled: boolean;
}
const useStyle = makeStyles({
    viewport: {
        position: "relative",
        height: "100%",
        flexGrow: 1
    },
    view: {
        display: "flex",
        height: "100%",
        width: "100%",
        position: "relative",
        flexDirection: "row",
        ...shorthands.overflow("hidden")
    },
    page: {
        flexDirection: 'column',
        ...shorthands.flex('1', '1', '0%'),
        height: '100%',
        flexGrow: 1,
        display: 'flex'
    },
    renderer: {
        ...shorthands.overflow("hidden"),
        ...shorthands.flex('1', '1', '0%'),
        height: '100%',
        width: '100%',
    },
    rendereEnabled: {
        backgroundColor: tokens.colorNeutralBackground6
    },
    content: {
        paddingBottom: "2rem",
        paddingTop: "2rem",
        alignItems: 'center',
        flexDirection: 'column',
        position: "relative",
        display: 'flex'

    }
});



export const SettingsDrawer = () => {

    const { enabled, connectors, active, related, displayName, actions: { setOptions, selectNode, deserialize }, query: { getNodes, getSerializedNodes } } = useEditor((state) => ({
        displayName: Array.from(state.events.selected.values()).map(n => state.nodes[n].data.displayName)[0],
        enabled: state.options.enabled,
        active: state.events.selected && state.events.selected.size > 0,
        related:
            Array.from(state.events.selected.values()).map(n => state.nodes[n].related)[0],
    }));

    return (
        <Drawer size="medium" style={{
            position: "absolute",
            bottom: 0,
            top: 0,
            zIndex:40
        }}
            type="inline"
            position="end"
            separator
            open={(enabled && !!related && !!related.toolbar)}

        >
            <DrawerHeader>
                <DrawerHeaderTitle
                    action={
                        <Button
                            appearance="subtle"
                            aria-label="Close"
                            icon={<Dismiss24Regular />}
                            onClick={() => selectNode()}
                        />
                    }
                >
                    Default Drawer
                </DrawerHeaderTitle>
            </DrawerHeader>

            <DrawerBody>
                <Accordion>
                    {related && related.toolbar && React.createElement(related.toolbar)}
                    {related && related.visible && React.createElement(related.visible as React.FunctionComponent)}
                </Accordion>
            </DrawerBody>
        </Drawer>)
}

export const Viewport: React.FC<PropsWithChildren<ViewPortProps>> = ({ children, showToolbox = true, showSidebar = true, showHeader = true }) => {
    //const {
    //    enabled,
    //    connectors,
    //    actions: { setOptions },
    //} = useEditor((state) => ({
    //    enabled: state.options.enabled as boolean,
    //}));

    const style = useStyle();
    const { enabled, connectors, active, related, displayName, actions: { setOptions, selectNode, deserialize }, query: { getNodes, getSerializedNodes } } = useEditor((state) => ({
        displayName: Array.from(state.events.selected.values()).map(n => state.nodes[n].data.displayName)[0],
        enabled: state.options.enabled,
        active: state.events.selected && state.events.selected.size > 0,
        related:
            Array.from(state.events.selected.values()).map(n => state.nodes[n].related)[0],
    }));


    return (<>
        <div className={style.viewport}>
            <div className={style.view}>
                {showToolbox && <Toolbox />}
                <div className={classNames('page-container', style.page)}>
                    {showHeader && <Header />}
                    <div
                        className={classNames([
                            'craftjs-renderer transition',
                            style.renderer,
                            {
                                [style.rendereEnabled]: enabled,
                            },
                        ])}
                        ref={(ref) => connectors.select(connectors.hover(ref!, null!), null!)}
                    >

                        <div className={style.content}>
                            {children}
                        </div>


                    </div>
                </div>
                {showSidebar && <Sidebar />}
            </div>


        </div>


    </>
    );
};
