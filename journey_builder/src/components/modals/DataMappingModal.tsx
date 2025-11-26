import { globalProperties } from "../../utils/utils";
import type { FormDefinition, GraphNode } from "../../core/types.ts";
import { getAncestorForms, getAncestorNodes } from "../../core/traversal.ts";
import { useState } from "react";

interface DataMappingModalProps {
    id: string;
    nodes: GraphNode[];
    forms: FormDefinition[];
}

function DataMappingModal({ id, nodes, forms }: DataMappingModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const ancestorNodes = getAncestorNodes(id, nodes);
    const ancestorForms = getAncestorForms(ancestorNodes, forms);

    return (
        <>
            <div className="row border border-b-2 border-light">
                <h1>Select data element to map</h1>
            </div>
            <div>
                <div>
                    <h3>Available data</h3>
                    <search>Search</search>
                    <ul>
                        {globalProperties.map((properties) => {
                            return <li key={properties}>
                                {properties}
                            </li>
                        })}
                        {ancestorNodes.map((node) => {
                            return (
                                <li key={node.id} onClick={() => setIsOpen((prevState) => !prevState)}>{node.data.name}
                                    {isOpen && ancestorForms.map((form) => {
                                        const formFields = Object.keys(form.field_schema.properties);

                                        return <li key={form.id}>
                                            {formFields.map((field) => (
                                                <li key={field}>{field}</li>
                                            ))}
                                        </li>
                                    })}

                                </li>)
                        })}

                    </ul>
                </div>

            </div>
        </>
    )
}

export default DataMappingModal;