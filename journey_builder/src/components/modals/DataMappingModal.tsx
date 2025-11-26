import {globalProperties, actionProperties, clientOrganizationProperties} from "../../utils/utils";
import type {FormDefinition, GraphNode} from "../../core/types.ts";
import {getAncestorForms, getAncestorNodes} from "../../core/traversal.ts";
import {useState} from "react";
import {ChevronDown, ChevronRight} from "lucide-react";

interface DataMappingModalProps {
    id: string;
    nodes: GraphNode[];
    forms: FormDefinition[];
    fieldName: string;
    onSelect: (fieldName: string, sourceForm: string, sourceField: string) => void;
    onClose: () => void;
}

function DataMappingModal({id, nodes, forms, fieldName, onSelect, onClose}: DataMappingModalProps) {
    const [expandedForms, setExpandedForms] = useState<Set<string>>(new Set());
    const [searchTerm, setSearchTerm] = useState("");

    const ancestorNodes = getAncestorNodes(id, nodes);
    const ancestorForms = getAncestorForms(ancestorNodes, forms);

    const toggleForm = (formId: string) => {
        setExpandedForms(prev => {
            const newSet = new Set(prev);
            if (newSet.has(formId)) {
                newSet.delete(formId);
            } else {
                newSet.add(formId);
            }
            return newSet;
        });
    };

    const handleSelectField = (formName: string, field: string) => {
        onSelect(fieldName, formName, field);
    };

    return (
        <>
            <div
                className="fixed inset-0 bg-gray-900/80 z-[60]"
                onClick={onClose}
            />

            <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">

                    <div className="p-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold">Select data element to map</h2>
                    </div>

                    {/* Full width content */}
                    <div className="flex-1 overflow-y-auto">
                        <div className="p-4">
                            <h3 className="font-semibold mb-3">Available data</h3>

                            <input
                                type="text"
                                placeholder="Search"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded mb-4 focus:outline-none focus:border-blue-500"
                            />

                            <div className="space-y-1">
                                {/* Global Properties */}
                                {globalProperties.map((property) => {
                                    const isExpanded = expandedForms.has(property);
                                    const fields = property === "Action Properties"
                                        ? actionProperties
                                        : clientOrganizationProperties;

                                    return (
                                        <div key={property}>
                                            <div
                                                className="px-3 py-2 hover:bg-blue-50 rounded cursor-pointer flex items-center gap-2"
                                                onClick={() => toggleForm(property)}
                                            >
                                                {isExpanded ? (
                                                    <ChevronDown size={16} />
                                                ) : (
                                                    <ChevronRight size={16} />
                                                )}
                                                <span className="text-sm font-medium">{property}</span>
                                            </div>

                                            {isExpanded && (
                                                <div className="ml-6 space-y-1">
                                                    {fields
                                                        .filter(field =>
                                                            !searchTerm ||
                                                            field.toLowerCase().includes(searchTerm.toLowerCase())
                                                        )
                                                        .map((field) => (
                                                            <div
                                                                key={field}
                                                                className="px-3 py-2 hover:bg-blue-50 rounded cursor-pointer text-sm text-gray-700"
                                                                onClick={() => handleSelectField(property, field)}
                                                            >
                                                                {field}
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}

                                {/* Ancestor Forms */}
                                {ancestorNodes.map((node) => {
                                    const form = ancestorForms.find(f => f.id === node.data.component_id);
                                    if (!form) return null;

                                    const isExpanded = expandedForms.has(node.id);
                                    const formFields = Object.keys(form.field_schema.properties);

                                    return (
                                        <div key={node.id}>
                                            <div
                                                className="px-3 py-2 hover:bg-blue-50 rounded cursor-pointer flex items-center gap-2"
                                                onClick={() => toggleForm(node.id)}
                                            >
                                                {isExpanded ? (
                                                    <ChevronDown size={16} />
                                                ) : (
                                                    <ChevronRight size={16} />
                                                )}
                                                <span className="text-sm font-medium">{node.data.name}</span>
                                            </div>

                                            {isExpanded && (
                                                <div className="ml-6 space-y-1">
                                                    {formFields
                                                        .filter(field =>
                                                            !searchTerm ||
                                                            field.toLowerCase().includes(searchTerm.toLowerCase())
                                                        )
                                                        .map((field) => (
                                                            <div
                                                                key={field}
                                                                className="px-3 py-2 hover:bg-blue-50 rounded cursor-pointer text-sm text-gray-700"
                                                                onClick={() => handleSelectField(node.data.name, field)}
                                                            >
                                                                {field}
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="p-4 border-t border-gray-200 flex justify-end gap-2">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                        >
                            CANCEL
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default DataMappingModal;