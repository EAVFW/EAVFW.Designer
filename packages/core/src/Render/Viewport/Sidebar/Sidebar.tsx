import { useEditor } from '@craftjs/core';
import { Layers } from '@craftjs/layers';
import React, { useState } from 'react';
import { makeStyles, shorthands } from '@fluentui/react-components';
import { SidebarItem } from './SidebarItem';
import CustomizeIcon from '../../../Icons/customize.svg';
import LayerIcon from '../../../Icons/layers.svg';
import { Toolbar } from '../../Toolbar/Toolbar';

const useStyles = makeStyles({
    sidebarDiv: {
        width: '280px',
        backgroundColor: '#fff',
        ... shorthands.transition( 'margin-right','0.3s','opacity','0.3s'),
    },
    hidden: {
        opacity: 0,
        marginRight: '-280px',
    },
    visible: {
        opacity: 1,
        marginRight: '0px',
    },
});

export const Sidebar = () => {
    const [layersVisible, setLayerVisible] = useState(true);
    const [toolbarVisible, setToolbarVisible] = useState(true);
    const { enabled } = useEditor((state) => ({
        enabled: state.options.enabled,
    }));

    const styles = useStyles();

    return (
        <div className={`${styles.sidebarDiv} ${enabled ? styles.visible : styles.hidden}`}>
            <div className="flex flex-col h-full">
                <SidebarItem
                    icon={CustomizeIcon}
                    title="Customize"
                    height={!layersVisible ? 'full' : '55%'}
                    visible={toolbarVisible}
                    onChange={(val) => setToolbarVisible(val)}
                >
                    <Toolbar />
                </SidebarItem>
                <SidebarItem
                    icon={LayerIcon}
                    title="Layers"
                    height={!toolbarVisible ? 'full' : '45%'}
                    visible={layersVisible}
                    onChange={(val) => setLayerVisible(val)}
                >
                    <div className="">
                        <Layers expandRootOnLoad={true} />
                    </div>
                </SidebarItem>
            </div>
        </div>
    );
};