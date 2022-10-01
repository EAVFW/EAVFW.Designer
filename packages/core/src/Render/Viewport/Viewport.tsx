import { useEditor } from '@craftjs/core';
import { makeStyles, UseStylesOptions } from '@fluentui/react';

import React, { PropsWithChildren, useEffect } from 'react';
import styled from 'styled-components';
import { classNames } from '../../Utils/classNames';


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
const useStyle = makeStyles((options) => ({
    viewport: {
        position: "relative",

    },
    view: {
        display: "flex",
        height: "100%",
        width: "100%",
        position: "relative",
        flexDirection: "row",
        overflow: "hidden"
    },
    page: {
        flexDirection: 'column',
        flex: '1 1 0%',
        height: '100%',
        display:'flex'
    },
    renderer: {
        overflow: 'hidden',
        flex: '1 1 0%',
        height: '100%',
        width:'100%',
    },
    rendereEnabled: {
        background: options.palette.blackTranslucent40
    },
    content: {
        paddingBottom: "2rem",
        paddingTop: "2rem",
        alignItems: 'center',
        flexDirection: 'column',
        position: "relative",
        display:'flex'
        
	}
}));
 


export const Viewport: React.FC<PropsWithChildren<ViewPortProps>> = ({ children, showToolbox = true, showSidebar = true, showHeader = true }) => {
    const {
        enabled,
        connectors,
        actions: { setOptions },
    } = useEditor((state) => ({
        enabled: state.options.enabled as boolean,
    }));

    const style = useStyle();


    return (
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
    );
};
