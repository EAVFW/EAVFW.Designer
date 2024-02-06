import { useNode } from "@craftjs/core"
import { Field, Input } from "@fluentui/react-components"


export const ToolbarNameItem = ({ label }: { label: string }) => {

    const { name, actions: { setCustom } } = useNode(n => ({ name: n.data.custom.displayName }))
    return (
        <Field orientation="horizontal" label={label}>
            <Input value={name} onChange={(e, d) => {
                setCustom((custom: any) => {
                    custom.displayName = d.value;
                }, 300)
            }} />
        </Field>
    )

}