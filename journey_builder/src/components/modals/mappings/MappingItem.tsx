import {ChevronDown, ChevronRight} from "lucide-react";

interface MappingItemProps {
    label: string;
    fields: string[];
    isExpanded: boolean;
    searchTerm: string;
    onToggle: () => void;
    onSelectField: (field: string) => void;
}

function MappingItem({label, fields, isExpanded, searchTerm, onToggle, onSelectField}: MappingItemProps) {
    const filteredFields = fields.filter(field =>
        !searchTerm || field.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div
                className="px-3 py-2 hover:bg-blue-50 rounded cursor-pointer flex items-center gap-2"
                onClick={onToggle}
            >
                {isExpanded ? (
                    <ChevronDown size={16} />
                ) : (
                    <ChevronRight size={16} />
                )}
                <span className="text-sm font-medium">{label}</span>
            </div>

            {isExpanded && (
                <div className="ml-6 space-y-1">
                    {filteredFields.map((field) => (
                        <div
                            key={field}
                            className="px-3 py-2 hover:bg-blue-50 rounded cursor-pointer text-sm text-gray-700"
                            onClick={() => onSelectField(field)}
                        >
                            {field}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MappingItem;