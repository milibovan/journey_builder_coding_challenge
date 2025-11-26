import type { FormDefinition, GraphNode, MappedFields } from "../../core/types.ts";
import { Database, XCircle } from "lucide-react";
import { useState } from "react";
import DataMappingModal from "./DataMappingModal.tsx";

interface PrefillModalProps {
    id: string;
    nodes: GraphNode[];
    forms: FormDefinition[];
    form: FormDefinition;
    onClose: () => void;
    onSave: (prefilledFields: MappedFields[]) => void;
}

function PrefillModal({ id, nodes, forms, form, onClose, onSave }: PrefillModalProps) {
    const formFields = Object.keys(form.field_schema.properties);
    const node = nodes.find((node) => node.id === id);
    const initialPrefilledFields: MappedFields[] = node?.data.input_mapping?.fields || [];
    const [prefilledFields, setPrefilledFields] = useState<MappedFields[]>(initialPrefilledFields);
    const [selectedFieldForMapping, setSelectedFieldForMapping] = useState<string | null>(null);

    const handleSelectMapping = (fieldName: string, sourceForm: string, sourceField: string) => {
        setPrefilledFields(prev => [
            ...prev.filter(f => f.fieldName !== fieldName),
            { fieldName, sourceForm, sourceField }
        ]);
        setSelectedFieldForMapping(null);
    };

    const handleRemoveMapping = (fieldName: string) => {
        setPrefilledFields(prev => prev.filter(f => f.fieldName !== fieldName));
    };

    const handleSave = () => {
        onSave(prefilledFields);
        onClose();
    };

    return (
        <>
            <div
                className="fixed inset-0 bg-gray-900/80 z-40"
                onClick={onClose}
            />

            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div
                    className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
                    onClick={(e) => e.stopPropagation()} // ✅ Prevent closing when clicking inside modal
                >

                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                        <div className="text-left">
                            <h2 className="text-lg font-semibold">Prefill</h2>
                            <p className="text-sm text-gray-500">Prefill fields for this form</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 text-xl"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="p-4 overflow-y-auto max-h-[60vh]">
                        <ul className="space-y-2">
                            {formFields.map((field) => {
                                const mapping = prefilledFields.find(f => f.fieldName === field);
                                const isPrefilled = !!mapping;

                                return (
                                    <li
                                        key={field}
                                        className={`
                                            p-3 border hover:border-blue-400 
                                            flex items-center gap-3 cursor-pointer
                                            ${isPrefilled
                                                ? 'bg-blue-50 border-blue-300 rounded'
                                                : 'bg-white border-gray-200 rounded'
                                            }
                                        `}
                                        onClick={() => !isPrefilled && setSelectedFieldForMapping(field)}
                                    >
                                        <Database size={20} className="text-gray-400" />
                                        <div className="flex-1">
                                            <span
                                                className={isPrefilled ? "text-gray-900 font-medium" : "text-gray-600"}>
                                                {field}
                                            </span>
                                            {isPrefilled && mapping && (
                                                <div className="text-xs text-gray-500 mt-1">
                                                    {mapping.sourceForm}.{mapping.sourceField}
                                                </div>
                                            )}
                                        </div>
                                        {isPrefilled && (
                                            <XCircle
                                                size={20}
                                                className="text-gray-400 hover:text-red-500"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRemoveMapping(field);
                                                }}
                                            />
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    <div className="p-4 border-t border-gray-200 flex justify-end gap-2">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                        >
                            Cancel
                        </button>
                        <button
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            onClick={handleSave}
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>

            {selectedFieldForMapping && (
                <DataMappingModal
                    id={id}
                    nodes={nodes}
                    forms={forms}
                    fieldName={selectedFieldForMapping}
                    onSelect={handleSelectMapping}
                    onClose={() => setSelectedFieldForMapping(null)}
                />
            )}
        </>
    );
}

export default PrefillModal;