import type {FormDefinition, GraphNode} from "../../core/types.ts";
import {getAncestorForms, getAncestorNodes} from "../../core/traversal.ts";
import {useState} from "react";
import GlobalPropertiesMapping from "./mappings/GlobalPropertiesMapping.tsx";
import AncestorNodesMapping from "./mappings/AncestorNodesMapping.tsx";

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
                                <GlobalPropertiesMapping
                                    expandedForms={expandedForms}
                                    searchTerm={searchTerm}
                                    onToggleForm={toggleForm}
                                    onSelectField={handleSelectField}
                                />

                                < AncestorNodesMapping
                                    ancestorNodes={ancestorNodes}
                                    ancestorForms={ancestorForms}
                                    expandedForms={expandedForms}
                                    searchTerm={searchTerm}
                                    onToggleForm={toggleForm}
                                    onSelectField={handleSelectField}
                                />
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