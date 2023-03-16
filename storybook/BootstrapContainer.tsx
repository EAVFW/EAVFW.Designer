import { PropsWithChildren, useEffect } from "react";
import { FreshNode, useEditor, useNode, UserComponent } from "@craftjs/core";
import { registerNode } from "@eavfw/designer-core";
import { ToolbarTextInput } from "@eavfw/designer-core/src/Render/Toolbar/ToolbarTextInput";
import { ToolbarItem } from "@eavfw/designer-core/src/Render/Toolbar/ToolbarItem";
import { GridNode } from "@eavfw/designer-nodes";






type BootstrapSection = {
    preheader: string
    header: string
    sectionintro: string
}
const BoostrapSectionSettings: React.FC<BootstrapSection> = ({ }) => {

    return <>
        <ToolbarItem multiline={true} propKey="preheader" type="text" label="Pre Header" />
        <ToolbarItem multiline={true} propKey="header" type="text" label="Section Header" />
        <ToolbarItem multiline={true} propKey="sectionintro" type="text" label="Section Intro" />
    </>;
}

export const BootstrapSection: UserComponent<PropsWithChildren<BootstrapSection>> = ({ children, header, preheader, sectionintro }) => {

    const {
        id,
        connectors: { connect },
        isSelected,
        actions: { setProp }
    } = useNode((node) => ({
        isSelected: node.events.selected,
        id: node.id
    }));

    const { enabled, childs, query: { parseFreshNode }, actions: { add: addNode } } = useEditor((state) => ({ enabled: state.options.enabled, childs: Object.values(state.nodes).filter(n => n.data.parent === id) }));
    useEffect(() => {
        if (childs.length === 0) {

            const childNodeData = {
                data: {
                    type: GridNode,
                    displayName: "Section Content",
                    isCanvas: true,
                    custom: {
                        displayName: "Section Content"
                    },
                },

            } as FreshNode;
            const childNode = parseFreshNode(childNodeData).toNode();

            addNode(childNode, id, 0);
        }
    }, [])
    console.log("Childs", childs);

    return (<section ref={connect as any} className="section-space pt0 white-bg black-bg-0">
        <div className="container">
            <div className="row justify-content-between align-end">
                <div className="col-lg-5">
                    <div className="about-conent paragraph">
                        <span className="scriptheading dashbefore mb15 wow fadeIn" data-wow-delay=".2s" data-wow-duration="1500ms">{preheader}</span>
                        <h2 className="wow fadeIn" data-wow-delay=".4s" data-wow-duration="1500ms">{header}</h2>
                    </div>
                </div>
                <div className="col-lg-6 mmt40">
                    <div className="about-conent paragraph">
                        <p className="wow fadeIn" data-wow-delay=".2s" data-wow-duration="1500ms">{sectionintro}</p>
                    </div>
                </div>
            </div>
            <div className="row mt30 demo-three">
                {children}
            </div>
        </div>
    </section>
    )

};

BootstrapSection.craft = {
    displayName: 'Bootstrap Section',
    defaultProps: {
        preheader: "WELCOME TO EAVFW",
        sectionintro: "Abit longer text",
        header: "EAVFW is awesome, dont you think"
    },
    custom: {
        target: "components",
        nest: false,
        renderNode: {
            canAddLeft: false,
            canAddRight: false,
            canAddTop: true,
            canAddBottom: true
        }
    },
    rules: {
        canDrag: () => true,
    },
    related: {
        toolbar: BoostrapSectionSettings,
    },
};

registerNode("BootstrapSection", BootstrapSection);