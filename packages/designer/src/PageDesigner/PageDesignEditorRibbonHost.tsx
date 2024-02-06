import { PropsWithChildren, useEffect, useState } from "react";

import { useId, useBoolean } from '@fluentui/react-hooks';
import React from "react";
import { useEditor, SerializedNodes } from "@craftjs/core";
import { ContextualMenu, DefaultButton, Dialog, DialogFooter, DialogType, Panel, PanelType, PrimaryButton, TextField } from "@fluentui/react";

import { useEAVForm } from '@eavfw/forms';
import { useModelDrivenApp, useRibbon } from '@eavfw/apps';
import jszip from "jszip";
import { saveAs } from 'file-saver';
import { gzip, ungzip } from "pako";
import defaultinitial from "./defaultPageContent";
import { Accordion } from "@fluentui/react-components";

const dialogStyles = { main: { maxWidth: 450 } };

const dragOptions = {
    moveMenuItemText: 'Move',
    closeMenuItemText: 'Close',
    menu: ContextualMenu,
    keepInBounds: true,
};


const dialogContentProps = {
    type: DialogType.normal,
    title: 'Import',
    closeButtonAriaLabel: 'Close',
    subText: 'Importer data',
};





export const PageDesignEditorRibbonHost: React.FC<{ initial?: string | SerializedNodes }> = ({ initial = defaultinitial }) => {

    const [layersVisible, setLayerVisible] = useState(true);
    const [toolbarVisible, setToolbarVisible] = useState(true);
    const [isOpen, { setTrue: openPanel, setFalse: dismissPanel }] = useBoolean(false);
    const { enabled, active, related, displayName, actions: { setOptions, selectNode, deserialize }, query: { getNodes, getSerializedNodes } } = useEditor((state) => ({
        displayName: Array.from(state.events.selected.values()).map(n => state.nodes[n].data.displayName)[0],
        enabled: state.options.enabled,
        active: state.events.selected && state.events.selected.size > 0,
        related:
            Array.from(state.events.selected.values()).map(n => state.nodes[n].related)[0],
    }));

    const [hideDialog, { toggle: toggleHideDialog }] = useBoolean(true);
    const [isDraggable, { toggle: toggleIsDraggable }] = useBoolean(true);

    const labelId: string = useId('dialogLabel');
    const subTextId: string = useId('subTextLabel');

    const modalProps = React.useMemo(
        () => ({
            titleAriaId: labelId,
            subtitleAriaId: subTextId,
            isBlocking: false,
            styles: dialogStyles,
            dragOptions: isDraggable ? dragOptions : undefined,
        }),
        [isDraggable, labelId, subTextId],
    );


    const [{ manifest, layout, id: formId, name }, { onChange: onFormDataChange }] = useEAVForm((state) => ({
        id: state.formValues.id,
        manifest: state.formValues.manifest,
        layout: state.formValues.layout,
        name: state.formValues.name
    }));


    const { addButton, removeButton, events } = useRibbon();
    useEffect(() => {
        const onClick = (e: Event) => {
            console.log("CUSTOM_FORM_DESIGNER_EXPORT Clicked", e);



            var zip = new jszip();
            zip.file("manifest.json", ungzip(new Uint8Array(atob(manifest?.data).split("").map(function (c) {
                return c.charCodeAt(0)
            })), { to: "string" }) as string);
            zip.file("layout.json", ungzip(new Uint8Array(atob(layout).split("").map(function (c) {
                return c.charCodeAt(0)
            })), { to: "string" }) as string);

            zip.generateAsync({ type: "blob" }).then((blob) => {
                saveAs(blob, `${name}.zip`);
            });



            console.log({
                manifest:
                    ungzip(new Uint8Array(atob(manifest?.data).split("").map(function (c) {
                        return c.charCodeAt(0)
                    })), { to: "string" }) as string,
                layout: ungzip(new Uint8Array(atob(layout).split("").map(function (c) {
                    return c.charCodeAt(0)
                })), { to: "string" }) as string
            });


        };
        events.on('CUSTOM_FORM_DESIGNER_EXPORT', onClick);
        () => {
            events.off('CUSTOM_FORM_DESIGNER_EXPORT', onClick)
        }
    }, [manifest, layout]);

    useEffect(() => {
        const onClick = (e: Event) => {
            console.log("CUSTOM_FORM_DESIGNER_IMPORT Clicked", e);
            toggleHideDialog();
        };
        events.on('CUSTOM_FORM_DESIGNER_IMPORT', onClick);
        () => {
            events.off('CUSTOM_FORM_DESIGNER_IMPORT', onClick)
        }
    }, []);




    useEffect(() => {
        const onClick = (e: Event) => {
            console.log("CUSTOM_FORM_DESIGNER_PUBLISH Clicked", e);

            const root = getSerializedNodes();
            console.log(root);

            let manifest = {
                entities: {
                    "Form Submission": {
                        pluralName: "Form Submissions",
                        logicalName: "formsubmission",
                        schemaName: "Form Subsmission",
                        collectionSchemaName: "Form Submissions",
                        attributes: {
                            "Id": {
                                "isPrimaryKey": true,
                                "type": {
                                    "type": "guid"
                                },
                                "displayName": "Id",
                                "schemaName": "Id",
                                "logicalName": "id"
                            },
                        }
                    }
                }
            } as any;

            let filecounter = 0;
            for (let [nodeId, entry] of Object.entries(root)) {
                const type = typeof (entry.type) === "string" ? entry.type : entry.type.resolvedName;
                console.log("Publish:", [nodeId, entry, type]);
                if (type === "DataControl") {
                    console.log(entry?.props?.form?.schema);
                } else if (type === "FileControl") {


                    const multipleFiles = entry?.props?.multipleFiles;

                    if (multipleFiles) {
                        manifest.entities[`Form File ${filecounter}`] = {
                            pluralName: `Form File ${filecounter}`,
                            logicalName: `formfile${filecounter}`,
                            schemaName: `Form File ${filecounter}`,
                            collectionSchemaName: `Form File ${filecounter}`,
                            attributes: {
                                "Id": {
                                    "isPrimaryKey": true,
                                    "type": {
                                        "type": "guid"
                                    },
                                    "displayName": "Id",
                                    "schemaName": "Id",
                                    "logicalName": "id"
                                },
                                "Form Submission": {
                                    "type": {
                                        "type": "lookup",
                                        "referenceType": `Form Submission`,
                                        "foreignKey": {
                                            "principalTable": "formsubmission",
                                            "principalColumn": "id",
                                            "principalNameColumn": "name",
                                            "name": "file"
                                        }
                                    },
                                    "locale": {
                                        "1030": {
                                            "displayName": "File"
                                        },
                                        "1033": {
                                            "displayName": "Fil"
                                        }
                                    },
                                    "displayName": `File ${filecounter}`,
                                    "schemaName": `File${filecounter}Id`,
                                    "logicalName": `file${filecounter}id`
                                },
                                "Document": {
                                    "isPrimaryField": true,
                                    "type": {
                                        "type": "lookup",
                                        "referenceType": `KFST:Document`,
                                        "foreignKey": {
                                            "principalTable": "document",
                                            "principalColumn": "id",
                                            "principalNameColumn": "name",
                                            "name": "file"
                                        }
                                    },
                                    "locale": {
                                        "1030": {
                                            "displayName": "File"
                                        },
                                        "1033": {
                                            "displayName": "Fil"
                                        }
                                    },
                                    "displayName": `File ${filecounter}`,
                                    "schemaName": `File${filecounter}Id`,
                                    "logicalName": `file${filecounter}id`
                                }
                            }
                        }

                    } else {
                        manifest.entities['Form Submission'].attributes[`File ${filecounter}`] = {

                            "type": {
                                "type": "lookup",
                                "referenceType": `KFST:Document`,
                                "foreignKey": {
                                    "principalTable": "document",
                                    "principalColumn": "id",
                                    "principalNameColumn": "name",
                                    "name": "file"
                                }
                            },
                            "locale": {
                                "1030": {
                                    "displayName": "File"
                                },
                                "1033": {
                                    "displayName": "File"
                                }
                            },
                            "displayName": `File ${filecounter}`,
                            "schemaName": `File${filecounter}Id`,
                            "logicalName": `file${filecounter}id`
                        }
                    }


                    console.log(entry?.props);
                    //  filecounter++;
                } else if (type === "DropdownControl") {
                    console.log(entry?.props);
                }
            }


            // console.log(escape(lzstring.compressToUTF16(JSON.stringify(manifest))));
            onFormDataChange(props => { props["manifest"] = btoa(String.fromCharCode.apply(null, Array.from(gzip(JSON.stringify(manifest))))) })
            //const {
            //    value
            //} = useEAVForm((state) => ({
            //    value: state.formData[attribute!]
            //}));

        };

        events.on('CUSTOM_FORM_DESIGNER_PUBLISH', onClick);
        () => {
            events.off('CUSTOM_FORM_DESIGNER_PUBLISH', onClick)
        }
    }, []);

    const [resetTrigger, setResetTrigger] = useState(new Date().toISOString());
    useEffect(() => {

        console.log("Adding Reset Button");
        addButton({
            key: 'resetLayout',
            text: "Reset",
            iconProps: { iconName: 'Clear' },
            onClick: (e, i) => {
                //console.log("LOL");
                //const content = formData[column.logicalName.slice(0, -2)] ?? { path: "page.json", container: "pages", contenttype: "application/json" };
                //content.data = lz.encodeBase64(lz.compress(initial));
                //onChange(isLookup(column.type) ? content : content.data);

                deserialize(initial);
            },
        });



        return () => {
            console.log("Removing Reset Button");
            removeButton('resetLayout');

        }
    }, []);
    //onDismiss = {() => setOptions((options) => {
    //    options.enabled = false;
    //})}

    const [stagedImportManifest, setStagedImportManifest] = useState(null as any as string);
    const [stagedImportLayout, setStagedImportLayout] = useState(null as any as string);

    const clearImportDialog = React.useCallback(() => {
        setStagedImportManifest(null as any as string);
        setStagedImportLayout(null as any as string);
        toggleHideDialog();
    }, [setStagedImportLayout, setStagedImportManifest, toggleHideDialog])

    const canImportManifestArchive = React.useCallback(() => {
        return stagedImportManifest && stagedImportLayout;
    }, [stagedImportLayout, stagedImportManifest]);

    return <>
        <Dialog
            hidden={hideDialog}
            onDismiss={clearImportDialog}
            dialogContentProps={dialogContentProps}
            modalProps={modalProps}
        >
            <TextField
                label="Basic controlled TextField"
                type="file"
                onChange={(e, v) => {
                    console.log(e); console.log(v);
                    const input = e.target as HTMLInputElement;
                    const files = Array.from(input.files!)
                    console.log("files:", files);
                    const file = files[0];
                    if (file) {
                        jszip.loadAsync(file).then((zip) => {
                            console.log("files:", zip);
                            Object.keys(zip.files).forEach((filename) => {
                                zip.files[filename].async('string').then((fileData) => {
                                    if (filename == "manifest.json") {
                                        setStagedImportManifest(fileData);
                                    } else if (filename == "layout.json") {
                                        setStagedImportLayout(fileData);
                                    }
                                })
                            })
                        })
                    }

                }}
            />
            <DialogFooter>
                <PrimaryButton disabled={!canImportManifestArchive()} onClick={(e) => {
                    if (stagedImportLayout && stagedImportManifest) {
                        if (layout !== initial) {
                            const isOk = confirm(
                                "Importing will cause you to lose any customizations you have made to this form. Are you sure you want to import?");
                            if (!isOk) return;
                        }
                        deserialize(stagedImportLayout);
                        onFormDataChange(props => {

                            const content = manifest ?? { path: `/${formId}/manifest.json`, container: "manifests", contenttype: "application/json" };
                            content.compressed = true;
                            content.data = btoa(String.fromCharCode.apply(null,
                                Array.from(gzip(stagedImportManifest))));
                            //onChange(isLookup(column.type) ? content : content.data);


                            props["manifest"] = content;
                            props["layout"] = btoa(String.fromCharCode.apply(null,
                                Array.from(gzip(stagedImportLayout))));
                        });
                        clearImportDialog();
                    }
                }} text="Import" />
                <DefaultButton onClick={clearImportDialog} text="Cancel" />
            </DialogFooter>
        </Dialog>
        <Panel
            headerText={displayName}
            isOpen={(false && active && !!related.toolbar)}
            
            onDismiss={() => selectNode()}
            isBlocking={false}
            // You MUST provide this prop! Otherwise screen readers will just say "button" with no label.
            closeButtonAriaLabel="Close"
        >
            <Accordion>
                {active && related.toolbar && React.createElement(related.toolbar)}
                {active && related.visible && React.createElement(related.visible as React.FunctionComponent)}
            </Accordion>


        </Panel>
        </>;

}