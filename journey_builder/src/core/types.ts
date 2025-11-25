import type { XYPosition } from "@xyflow/react";

interface SlaDuration {
    number: number;
    unit: string;
}

interface NodeData {
    id: string;
    component_key: string;
    component_type: string;
    component_id: string;
    name: string;
    prerequisites: Array<string>;
    permitted_roles: Array<string>;
    sla_duration: SlaDuration
    approval_required: boolean;
    approval_roles: Array<string>;
}

interface FormFieldProperty {
    "avantos-type": string;
    title: string;
    type: string;
    items?: {
        type: string;
        enum: Array<string>;
    }
    format?: string;
    uniqueItems?: boolean;
    enum?: never;
}

interface FieldSchema {
    type: string;
    properties: Record<string, FormFieldProperty>
    required: Array<string>;
}

interface UISchema {
    type: string;
    elements: Array<UISchemaElement>
}

interface UISchemaElement {
    type: string;
    scope: string;
    label: string;
    options?: {
        format: string;
    }
}

interface DynamicFieldProperties {
    selector_field: string;
    payload_fields: Record<string, {
        type: string;
        value: string;
    }>
    endpoint_id: string;
}

export interface GraphNode {
    id: string;
    type: string;
    position: XYPosition;
    data: NodeData;
}

export interface GraphEdge {
    source: string;
    target: string;
}

export interface FormDefinition {
    id: string;
    name: string;
    description: string;
    is_reusable: boolean;
    field_schema: FieldSchema;
    ui_schema: UISchema;
    dynamic_field_config: Record<string, DynamicFieldProperties>;
}

export interface BlueprintResponse {
    id: string;
    tenant_id: string;
    name: string;
    description: string;
    category: string;
    nodes: GraphNode[];
    edges: GraphEdge[];
    forms: FormDefinition[];
    branches: Array<string>;
    triggers: Array<string>;
}