import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import DataMappingModal from '../DataMappingModal';
import type { FormDefinition, GraphNode } from '../../../core/types';

describe('DataMappingModal Component', () => {
    const mockOnSelect = vi.fn();
    const mockOnClose = vi.fn();

    const mockForm: FormDefinition = {
        id: 'form1',
        name: 'Previous Form',
        description: 'Previous form',
        is_reusable: false,
        field_schema: {
            type: 'object',
            properties: {
                name: {
                    'avantos-type': 'text',
                    title: 'Name',
                    type: 'string'
                },
                age: {
                    'avantos-type': 'number',
                    title: 'Age',
                    type: 'number'
                }
            },
            required: []
        },
        ui_schema: {
            type: 'VerticalLayout',
            elements: []
        },
        dynamic_field_config: {}
    };

    const mockNodes: GraphNode[] = [
        {
            id: 'node1',
            type: 'default',
            position: { x: 0, y: 0 },
            data: {
                id: 'node1',
                component_key: 'key1',
                component_type: 'type1',
                component_id: 'form1',
                name: 'Previous Node',
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
                name: 'Current Node',
                prerequisites: ['node1'],
                permitted_roles: [],
                sla_duration: { number: 1, unit: 'day' },
                approval_required: false,
                approval_roles: [],
                input_mapping: { fields: [] }
            }
        }
    ];

    const mockForms: FormDefinition[] = [mockForm];

    beforeEach(() => {
        mockOnSelect.mockClear();
        mockOnClose.mockClear();
    });

    it('should render modal with correct title', () => {
        render(
            <DataMappingModal
                id="node2"
                nodes={mockNodes}
                forms={mockForms}
                fieldName="email"
                onSelect={mockOnSelect}
                onClose={mockOnClose}
            />
        );

        expect(screen.getByText('Select data element to map')).toBeInTheDocument();
    });

    it('should render available data section', () => {
        render(
            <DataMappingModal
                id="node2"
                nodes={mockNodes}
                forms={mockForms}
                fieldName="email"
                onSelect={mockOnSelect}
                onClose={mockOnClose}
            />
        );

        expect(screen.getByText('Available data')).toBeInTheDocument();
    });

    it('should render search input', () => {
        render(
            <DataMappingModal
                id="node2"
                nodes={mockNodes}
                forms={mockForms}
                fieldName="email"
                onSelect={mockOnSelect}
                onClose={mockOnClose}
            />
        );

        const searchInput = screen.getByPlaceholderText('Search');
        expect(searchInput).toBeInTheDocument();
    });

    it('should call onClose when cancel button is clicked', () => {
        render(
            <DataMappingModal
                id="node2"
                nodes={mockNodes}
                forms={mockForms}
                fieldName="email"
                onSelect={mockOnSelect}
                onClose={mockOnClose}
            />
        );

        const cancelButton = screen.getByRole('button', { name: /cancel/i });
        fireEvent.click(cancelButton);

        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should call onClose when backdrop is clicked', () => {
        const { container } = render(
            <DataMappingModal
                id="node2"
                nodes={mockNodes}
                forms={mockForms}
                fieldName="email"
                onSelect={mockOnSelect}
                onClose={mockOnClose}
            />
        );

        const backdrop = container.querySelector('.bg-gray-900\\/80');
        expect(backdrop).toBeTruthy();
        fireEvent.click(backdrop!);

        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should render ancestor nodes', () => {
        render(
            <DataMappingModal
                id="node2"
                nodes={mockNodes}
                forms={mockForms}
                fieldName="email"
                onSelect={mockOnSelect}
                onClose={mockOnClose}
            />
        );

        expect(screen.getByText('Previous Node')).toBeInTheDocument();
    });

    it('should expand form when clicked', () => {
        render(
            <DataMappingModal
                id="node2"
                nodes={mockNodes}
                forms={mockForms}
                fieldName="email"
                onSelect={mockOnSelect}
                onClose={mockOnClose}
            />
        );

        const formLabel = screen.getByText('Previous Node');
        fireEvent.click(formLabel);

        expect(screen.getByText('name')).toBeInTheDocument();
        expect(screen.getByText('age')).toBeInTheDocument();
    });

    it('should call onSelect with correct parameters when field is selected', () => {
        render(
            <DataMappingModal
                id="node2"
                nodes={mockNodes}
                forms={mockForms}
                fieldName="email"
                onSelect={mockOnSelect}
                onClose={mockOnClose}
            />
        );

        // Expand the form first
        const formLabel = screen.getByText('Previous Node');
        fireEvent.click(formLabel);

        // Click on a field
        const nameField = screen.getByText('name');
        fireEvent.click(nameField);

        expect(mockOnSelect).toHaveBeenCalledWith('email', 'Previous Node', 'name');
    });

    it('should filter fields based on search term', () => {
        render(
            <DataMappingModal
                id="node2"
                nodes={mockNodes}
                forms={mockForms}
                fieldName="email"
                onSelect={mockOnSelect}
                onClose={mockOnClose}
            />
        );

        // Expand the form
        const formLabel = screen.getByText('Previous Node');
        fireEvent.click(formLabel);

        // Both fields should be visible initially
        expect(screen.getByText('name')).toBeInTheDocument();
        expect(screen.getByText('age')).toBeInTheDocument();

        // Search for 'name'
        const searchInput = screen.getByPlaceholderText('Search');
        fireEvent.change(searchInput, { target: { value: 'name' } });

        // Only 'name' should be visible
        expect(screen.getByText('name')).toBeInTheDocument();
        expect(screen.queryByText('age')).not.toBeInTheDocument();
    });

    it('should toggle form expansion on multiple clicks', () => {
        render(
            <DataMappingModal
                id="node2"
                nodes={mockNodes}
                forms={mockForms}
                fieldName="email"
                onSelect={mockOnSelect}
                onClose={mockOnClose}
            />
        );

        const formLabel = screen.getByText('Previous Node');

        // First click - expand
        fireEvent.click(formLabel);
        expect(screen.getByText('name')).toBeInTheDocument();

        // Second click - collapse
        fireEvent.click(formLabel);
        expect(screen.queryByText('name')).not.toBeInTheDocument();

        // Third click - expand again
        fireEvent.click(formLabel);
        expect(screen.getByText('name')).toBeInTheDocument();
    });

    it('should handle nodes with no ancestors', () => {
        render(
            <DataMappingModal
                id="node1"
                nodes={mockNodes}
                forms={mockForms}
                fieldName="email"
                onSelect={mockOnSelect}
                onClose={mockOnClose}
            />
        );

        // Should still render global properties
        expect(screen.getByText('Action Properties')).toBeInTheDocument();

        // But 'Previous Node' should not be in ancestors (it's the selected node)
        const previousNodes = screen.queryAllByText('Previous Node');
        expect(previousNodes.length).toBe(0);
    });

    it('should maintain search term state across form expansions', () => {
        render(
            <DataMappingModal
                id="node2"
                nodes={mockNodes}
                forms={mockForms}
                fieldName="email"
                onSelect={mockOnSelect}
                onClose={mockOnClose}
            />
        );

        // Set search term
        const searchInput = screen.getByPlaceholderText('Search');
        fireEvent.change(searchInput, { target: { value: 'age' } });

        // Expand form
        const formLabel = screen.getByText('Previous Node');
        fireEvent.click(formLabel);

        // Only 'age' should be visible
        expect(screen.queryByText('name')).not.toBeInTheDocument();
        expect(screen.getByText('age')).toBeInTheDocument();

        // Collapse and re-expand
        fireEvent.click(formLabel);
        fireEvent.click(formLabel);

        // Search filter should still apply
        expect(screen.queryByText('name')).not.toBeInTheDocument();
        expect(screen.getByText('age')).toBeInTheDocument();
    });

    it('should have proper z-index layering', () => {
        const { container } = render(
            <DataMappingModal
                id="node2"
                nodes={mockNodes}
                forms={mockForms}
                fieldName="email"
                onSelect={mockOnSelect}
                onClose={mockOnClose}
            />
        );

        const backdrop = container.querySelector('.z-\\[60\\]');
        const modal = container.querySelector('.z-\\[70\\]');

        expect(backdrop).toBeInTheDocument();
        expect(modal).toBeInTheDocument();
    });
});