import type { FormDefinition, GraphNode } from "../../core/types.ts";
import { Database } from "lucide-react";

interface PrefillModalProps {
    id: string;
    nodes: GraphNode[];
    form: FormDefinition;
    onClose: () => void;
}

function PrefillModal({ form, onClose }: PrefillModalProps) {
    const formFields = Object.keys(form.field_schema.properties);

    return (
        <>
            <div
                className="fixed inset-0 bg-gray-900/80 z-40"
                onClick={onClose}
            />

            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">

                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                        <div className="text-left">
                            <h2 className="text-lg font-semibold">Prefill Configuration</h2>
                            <p className="text-sm text-gray-500">Prefill fields for this form</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="p-4 overflow-y-auto max-h-[60vh]">
                        <ul className="space-y-2">
                            {formFields.map((field) => (
                                <li
                                    key={field}
                                    className="p-3 border border-gray-200 rounded hover:border-blue-400 flex items-center gap-3"
                                >
                                    <Database size={20} className="text-gray-400" />
                                    <span className="text-gray-600">{field}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="p-4 border-t border-gray-200 flex justify-end gap-2">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                        >
                            Cancel
                        </button>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default PrefillModal;