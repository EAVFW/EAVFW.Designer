import { NodePicker } from "@eavfw/designer-core/src/Render/NodePicker/NodePicker";
import { ToolbarSection } from "@eavfw/designer-core/src/Render/Toolbar/ToolbarSection";
import React from "react";

import { GridNodeLayoutSelector } from "./GridNodeLayoutSelector";

export const GridNodeSettings = () => {
    return (
        <>
            <ToolbarSection title="Layouts" props={["grid", "gridId"]} summary={({ grid, gridId }: any) => gridId}>
                <GridNodeLayoutSelector />
            </ToolbarSection>

            <ToolbarSection title="Controls" props={["grid", "gridId"]} summary={({ grid, gridId }: any) => gridId}>
                <NodePicker />
            </ToolbarSection>
           
        </>
    );
};