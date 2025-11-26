import MappingItem from "./MappingItem.tsx";
import type {FormDefinition, GraphNode} from "../../../core/types.ts";

interface AncestorNodesMappingProps {
    ancestorNodes: GraphNode[];
    ancestorForms: FormDefinition[];
    expandedForms: Set<string>;
    searchTerm: string;
    onToggleForm: (formId: string) => void;
    onSelectField: (formName: string, field: string) => void;
}

function AncestorNodesMapping({ancestorNodes, ancestorForms, expandedForms, searchTerm, onToggleForm, onSelectField}: AncestorNodesMappingProps) {
    return (
        <>
            {ancestorNodes.map((node) => {
                const form = ancestorForms.find(f => f.id === node.data.component_id);
                if (!form) return null;

                const isExpanded = expandedForms.has(node.id);
                const formFields = Object.keys(form.field_schema.properties);

                return (
                    <MappingItem
                        key={node.id}
                        label={node.data.name}
                        fields={formFields}
                        isExpanded={isExpanded}
                        searchTerm={searchTerm}
                        onToggle={() => onToggleForm(node.id)}
                        onSelectField={(field) => onSelectField(node.data.name, field)}
                    />
                );
            })}
        </>
    );
}

export default AncestorNodesMapping;