import {actionProperties, clientOrganizationProperties, globalProperties} from "../../../utils/utils.ts";
import MappingItem from "./MappingItem.tsx";

interface GlobalPropertiesMappingProps {
    expandedForms: Set<string>;
    searchTerm: string;
    onToggleForm: (formId: string) => void;
    onSelectField: (formName: string, field: string) => void;
}

function GlobalPropertiesMapping({expandedForms, searchTerm, onToggleForm, onSelectField}: GlobalPropertiesMappingProps) {
    return (
        <>
            {globalProperties.map((property) => {
                const isExpanded = expandedForms.has(property);
                const fields = property === "Action Properties"
                    ? actionProperties
                    : clientOrganizationProperties;

                return (
                    <MappingItem
                        key={property}
                        label={property}
                        fields={fields}
                        isExpanded={isExpanded}
                        searchTerm={searchTerm}
                        onToggle={() => onToggleForm(property)}
                        onSelectField={(field) => onSelectField(property, field)}
                    />
                );
            })}
        </>
    );
}

export default GlobalPropertiesMapping;