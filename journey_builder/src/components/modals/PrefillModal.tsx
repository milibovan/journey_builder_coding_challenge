import type {FormDefinition, GraphNode} from "../../core/types.ts";

interface PrefillModalProps {
    id: string;
    nodes: GraphNode[];
    form: FormDefinition;
}

function PrefillModal({id, form}: PrefillModalProps) {
    const fields = Object.keys(form.field_schema.properties);

    return (<div>
        <p>Prefill id: {id}</p>
        <ul>
            {fields && fields.map((field) => {
                return (
                    <li key={field}>{field}</li>
                )
            })}
        </ul>

    </div>)
}

export default PrefillModal;