import { describe, it, expect } from 'vitest';
import { getAncestorNodes, getAncestorForms } from '../traversal.ts';
import type { GraphNode, FormDefinition } from '../types.ts';

describe('Graph Traversal Logic', () => {
    describe('getAncestorNodes', () => {
        it('should return empty array when node is not found', () => {
            const nodes: GraphNode[] = [
                {
                    id: 'node1',
                    type: 'default',
                    position: { x: 0, y: 0 },
                    data: {
                        id: 'node1',
                        component_key: 'key1',
                        component_type: 'type1',
                        component_id: 'comp1',
                        name: 'Node 1',
                        prerequisites: [],
                        permitted_roles: [],
                        sla_duration: { number: 1, unit: 'day' },
                        approval_required: false,
                        approval_roles: [],
                        input_mapping: { fields: [] }
                    }
                }
            ];

            const result = getAncestorNodes('nonexistent', nodes);
            expect(result).toEqual([]);
        });

        it('should return empty array when node has no prerequisites', () => {
            const nodes: GraphNode[] = [
                {
                    id: 'node1',
                    type: 'default',
                    position: { x: 0, y: 0 },
                    data: {
                        id: 'node1',
                        component_key: 'key1',
                        component_type: 'type1',
                        component_id: 'comp1',
                        name: 'Node 1',
                        prerequisites: [],
                        permitted_roles: [],
                        sla_duration: { number: 1, unit: 'day' },
                        approval_required: false,
                        approval_roles: [],
                        input_mapping: { fields: [] }
                    }
                }
            ];

            const result = getAncestorNodes('node1', nodes);
            expect(result).toEqual([]);
        });

        it('should return direct ancestor nodes', () => {
            const nodes: GraphNode[] = [
                {
                    id: 'node1',
                    type: 'default',
                    position: { x: 0, y: 0 },
                    data: {
                        id: 'node1',
                        component_key: 'key1',
                        component_type: 'type1',
                        component_id: 'comp1',
                        name: 'Node 1',
                        prerequisites: [],
                        permitted_roles: [],
                        sla_duration: { number: 1, unit: 'day' },
                        approval_required: false,
                        approval_roles: [],
                        input_mapping: { fields: [] }
                    }
                },
                {
                    id: 'node2',
                    type: 'default',
                    position: { x: 100, y: 0 },
                    data: {
                        id: 'node2',
                        component_key: 'key2',
                        component_type: 'type2',
                        component_id: 'comp2',
                        name: 'Node 2',
                        prerequisites: ['node1'],
                        permitted_roles: [],
                        sla_duration: { number: 1, unit: 'day' },
                        approval_required: false,
                        approval_roles: [],
                        input_mapping: { fields: [] }
                    }
                }
            ];

            const result = getAncestorNodes('node2', nodes);
            expect(result).toHaveLength(1);
            expect(result[0].id).toBe('node1');
        });

        it('should return multiple ancestor nodes in correct order', () => {
            const nodes: GraphNode[] = [
                {
                    id: 'node1',
                    type: 'default',
                    position: { x: 0, y: 0 },
                    data: {
                        id: 'node1',
                        component_key: 'key1',
                        component_type: 'type1',
                        component_id: 'comp1',
                        name: 'Node 1',
                        prerequisites: [],
                        permitted_roles: [],
                        sla_duration: { number: 1, unit: 'day' },
                        approval_required: false,
                        approval_roles: [],
                        input_mapping: { fields: [] }
                    }
                },
                {
                    id: 'node2',
                    type: 'default',
                    position: { x: 100, y: 0 },
                    data: {
                        id: 'node2',
                        component_key: 'key2',
                        component_type: 'type2',
                        component_id: 'comp2',
                        name: 'Node 2',
                        prerequisites: [],
                        permitted_roles: [],
                        sla_duration: { number: 1, unit: 'day' },
                        approval_required: false,
                        approval_roles: [],
                        input_mapping: { fields: [] }
                    }
                },
                {
                    id: 'node3',
                    type: 'default',
                    position: { x: 200, y: 0 },
                    data: {
                        id: 'node3',
                        component_key: 'key3',
                        component_type: 'type3',
                        component_id: 'comp3',
                        name: 'Node 3',
                        prerequisites: ['node1', 'node2'],
                        permitted_roles: [],
                        sla_duration: { number: 1, unit: 'day' },
                        approval_required: false,
                        approval_roles: [],
                        input_mapping: { fields: [] }
                    }
                }
            ];

            const result = getAncestorNodes('node3', nodes);
            expect(result).toHaveLength(2);
            expect(result.map(n => n.id)).toContain('node1');
            expect(result.map(n => n.id)).toContain('node2');
        });

        it('should handle nested prerequisites correctly', () => {
            const nodes: GraphNode[] = [
                {
                    id: 'node1',
                    type: 'default',
                    position: { x: 0, y: 0 },
                    data: {
                        id: 'node1',
                        component_key: 'key1',
                        component_type: 'type1',
                        component_id: 'comp1',
                        name: 'Node 1',
                        prerequisites: [],
                        permitted_roles: [],
                        sla_duration: { number: 1, unit: 'day' },
                        approval_required: false,
                        approval_roles: [],
                        input_mapping: { fields: [] }
                    }
                },
                {
                    id: 'node2',
                    type: 'default',
                    position: { x: 100, y: 0 },
                    data: {
                        id: 'node2',
                        component_key: 'key2',
                        component_type: 'type2',
                        component_id: 'comp2',
                        name: 'Node 2',
                        prerequisites: ['node1'],
                        permitted_roles: [],
                        sla_duration: { number: 1, unit: 'day' },
                        approval_required: false,
                        approval_roles: [],
                        input_mapping: { fields: [] }
                    }
                },
                {
                    id: 'node3',
                    type: 'default',
                    position: { x: 200, y: 0 },
                    data: {
                        id: 'node3',
                        component_key: 'key3',
                        component_type: 'type3',
                        component_id: 'comp3',
                        name: 'Node 3',
                        prerequisites: ['node2'],
                        permitted_roles: [],
                        sla_duration: { number: 1, unit: 'day' },
                        approval_required: false,
                        approval_roles: [],
                        input_mapping: { fields: [] }
                    }
                }
            ];

            const result = getAncestorNodes('node3', nodes);
            expect(result).toHaveLength(2);
            expect(result.map(n => n.id)).toContain('node1');
            expect(result.map(n => n.id)).toContain('node2');
        });

        it('should handle circular dependencies without infinite loop', () => {
            const nodes: GraphNode[] = [
                {
                    id: 'node1',
                    type: 'default',
                    position: { x: 0, y: 0 },
                    data: {
                        id: 'node1',
                        component_key: 'key1',
                        component_type: 'type1',
                        component_id: 'comp1',
                        name: 'Node 1',
                        prerequisites: ['node2'],
                        permitted_roles: [],
                        sla_duration: { number: 1, unit: 'day' },
                        approval_required: false,
                        approval_roles: [],
                        input_mapping: { fields: [] }
                    }
                },
                {
                    id: 'node2',
                    type: 'default',
                    position: { x: 100, y: 0 },
                    data: {
                        id: 'node2',
                        component_key: 'key2',
                        component_type: 'type2',
                        component_id: 'comp2',
                        name: 'Node 2',
                        prerequisites: ['node1'],
                        permitted_roles: [],
                        sla_duration: { number: 1, unit: 'day' },
                        approval_required: false,
                        approval_roles: [],
                        input_mapping: { fields: [] }
                    }
                }
            ];

            const result = getAncestorNodes('node1', nodes);
            expect(result).toHaveLength(1);
            expect(result[0].id).toBe('node2');
        });

        it('should not include duplicate nodes in result', () => {
            const nodes: GraphNode[] = [
                {
                    id: 'node1',
                    type: 'default',
                    position: { x: 0, y: 0 },
                    data: {
                        id: 'node1',
                        component_key: 'key1',
                        component_type: 'type1',
                        component_id: 'comp1',
                        name: 'Node 1',
                        prerequisites: [],
                        permitted_roles: [],
                        sla_duration: { number: 1, unit: 'day' },
                        approval_required: false,
                        approval_roles: [],
                        input_mapping: { fields: [] }
                    }
                },
                {
                    id: 'node2',
                    type: 'default',
                    position: { x: 100, y: 0 },
                    data: {
                        id: 'node2',
                        component_key: 'key2',
                        component_type: 'type2',
                        component_id: 'comp2',
                        name: 'Node 2',
                        prerequisites: ['node1'],
                        permitted_roles: [],
                        sla_duration: { number: 1, unit: 'day' },
                        approval_required: false,
                        approval_roles: [],
                        input_mapping: { fields: [] }
                    }
                },
                {
                    id: 'node3',
                    type: 'default',
                    position: { x: 150, y: 100 },
                    data: {
                        id: 'node3',
                        component_key: 'key3',
                        component_type: 'type3',
                        component_id: 'comp3',
                        name: 'Node 3',
                        prerequisites: ['node1'],
                        permitted_roles: [],
                        sla_duration: { number: 1, unit: 'day' },
                        approval_required: false,
                        approval_roles: [],
                        input_mapping: { fields: [] }
                    }
                },
                {
                    id: 'node4',
                    type: 'default',
                    position: { x: 200, y: 0 },
                    data: {
                        id: 'node4',
                        component_key: 'key4',
                        component_type: 'type4',
                        component_id: 'comp4',
                        name: 'Node 4',
                        prerequisites: ['node2', 'node3'],
                        permitted_roles: [],
                        sla_duration: { number: 1, unit: 'day' },
                        approval_required: false,
                        approval_roles: [],
                        input_mapping: { fields: [] }
                    }
                }
            ];

            const result = getAncestorNodes('node4', nodes);
            const nodeIds = result.map(n => n.id);
            const uniqueIds = new Set(nodeIds);

            expect(nodeIds.length).toBe(uniqueIds.size);
            expect(result).toHaveLength(3);
        });
    });

    describe('getAncestorForms', () => {
        it('should return empty array when no nodes provided', () => {
            const forms: FormDefinition[] = [
                {
                    id: 'form1',
                    name: 'Form 1',
                    description: 'Test form',
                    is_reusable: false,
                    field_schema: {
                        type: 'object',
                        properties: {},
                        required: []
                    },
                    ui_schema: {
                        type: 'VerticalLayout',
                        elements: []
                    },
                    dynamic_field_config: {}
                }
            ];

            const result = getAncestorForms([], forms);
            expect(result).toEqual([]);
        });

        it('should return empty array when no forms match', () => {
            const nodes: GraphNode[] = [
                {
                    id: 'node1',
                    type: 'default',
                    position: { x: 0, y: 0 },
                    data: {
                        id: 'node1',
                        component_key: 'key1',
                        component_type: 'type1',
                        component_id: 'nonexistent',
                        name: 'Node 1',
                        prerequisites: [],
                        permitted_roles: [],
                        sla_duration: { number: 1, unit: 'day' },
                        approval_required: false,
                        approval_roles: [],
                        input_mapping: { fields: [] }
                    }
                }
            ];

            const forms: FormDefinition[] = [
                {
                    id: 'form1',
                    name: 'Form 1',
                    description: 'Test form',
                    is_reusable: false,
                    field_schema: {
                        type: 'object',
                        properties: {},
                        required: []
                    },
                    ui_schema: {
                        type: 'VerticalLayout',
                        elements: []
                    },
                    dynamic_field_config: {}
                }
            ];

            const result = getAncestorForms(nodes, forms);
            expect(result).toEqual([]);
        });

        it('should return matching forms for given nodes', () => {
            const nodes: GraphNode[] = [
                {
                    id: 'node1',
                    type: 'default',
                    position: { x: 0, y: 0 },
                    data: {
                        id: 'node1',
                        component_key: 'key1',
                        component_type: 'type1',
                        component_id: 'form1',
                        name: 'Node 1',
                        prerequisites: [],
                        permitted_roles: [],
                        sla_duration: { number: 1, unit: 'day' },
                        approval_required: false,
                        approval_roles: [],
                        input_mapping: { fields: [] }
                    }
                }
            ];

            const forms: FormDefinition[] = [
                {
                    id: 'form1',
                    name: 'Form 1',
                    description: 'Test form',
                    is_reusable: false,
                    field_schema: {
                        type: 'object',
                        properties: {
                            field1: {
                                'avantos-type': 'text',
                                title: 'Field 1',
                                type: 'string'
                            }
                        },
                        required: []
                    },
                    ui_schema: {
                        type: 'VerticalLayout',
                        elements: []
                    },
                    dynamic_field_config: {}
                }
            ];

            const result = getAncestorForms(nodes, forms);
            expect(result).toHaveLength(1);
            expect(result[0].id).toBe('form1');
        });

        it('should return multiple forms for multiple nodes', () => {
            const nodes: GraphNode[] = [
                {
                    id: 'node1',
                    type: 'default',
                    position: { x: 0, y: 0 },
                    data: {
                        id: 'node1',
                        component_key: 'key1',
                        component_type: 'type1',
                        component_id: 'form1',
                        name: 'Node 1',
                        prerequisites: [],
                        permitted_roles: [],
                        sla_duration: { number: 1, unit: 'day' },
                        approval_required: false,
                        approval_roles: [],
                        input_mapping: { fields: [] }
                    }
                },
                {
                    id: 'node2',
                    type: 'default',
                    position: { x: 100, y: 0 },
                    data: {
                        id: 'node2',
                        component_key: 'key2',
                        component_type: 'type2',
                        component_id: 'form2',
                        name: 'Node 2',
                        prerequisites: [],
                        permitted_roles: [],
                        sla_duration: { number: 1, unit: 'day' },
                        approval_required: false,
                        approval_roles: [],
                        input_mapping: { fields: [] }
                    }
                }
            ];

            const forms: FormDefinition[] = [
                {
                    id: 'form1',
                    name: 'Form 1',
                    description: 'Test form 1',
                    is_reusable: false,
                    field_schema: {
                        type: 'object',
                        properties: {},
                        required: []
                    },
                    ui_schema: {
                        type: 'VerticalLayout',
                        elements: []
                    },
                    dynamic_field_config: {}
                },
                {
                    id: 'form2',
                    name: 'Form 2',
                    description: 'Test form 2',
                    is_reusable: false,
                    field_schema: {
                        type: 'object',
                        properties: {},
                        required: []
                    },
                    ui_schema: {
                        type: 'VerticalLayout',
                        elements: []
                    },
                    dynamic_field_config: {}
                }
            ];

            const result = getAncestorForms(nodes, forms);
            expect(result).toHaveLength(2);
            expect(result.map(f => f.id)).toContain('form1');
            expect(result.map(f => f.id)).toContain('form2');
        });

        it('should handle nodes with missing form references', () => {
            const nodes: GraphNode[] = [
                {
                    id: 'node1',
                    type: 'default',
                    position: { x: 0, y: 0 },
                    data: {
                        id: 'node1',
                        component_key: 'key1',
                        component_type: 'type1',
                        component_id: 'form1',
                        name: 'Node 1',
                        prerequisites: [],
                        permitted_roles: [],
                        sla_duration: { number: 1, unit: 'day' },
                        approval_required: false,
                        approval_roles: [],
                        input_mapping: { fields: [] }
                    }
                },
                {
                    id: 'node2',
                    type: 'default',
                    position: { x: 100, y: 0 },
                    data: {
                        id: 'node2',
                        component_key: 'key2',
                        component_type: 'type2',
                        component_id: 'nonexistent',
                        name: 'Node 2',
                        prerequisites: [],
                        permitted_roles: [],
                        sla_duration: { number: 1, unit: 'day' },
                        approval_required: false,
                        approval_roles: [],
                        input_mapping: { fields: [] }
                    }
                }
            ];

            const forms: FormDefinition[] = [
                {
                    id: 'form1',
                    name: 'Form 1',
                    description: 'Test form',
                    is_reusable: false,
                    field_schema: {
                        type: 'object',
                        properties: {},
                        required: []
                    },
                    ui_schema: {
                        type: 'VerticalLayout',
                        elements: []
                    },
                    dynamic_field_config: {}
                }
            ];

            const result = getAncestorForms(nodes, forms);
            expect(result).toHaveLength(1);
            expect(result[0].id).toBe('form1');
        });
    });
});
