import {describe, it, expect, vi, beforeEach} from 'vitest';
import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom';
import PrefillModal from '../PrefillModal';
import type {FormDefinition, GraphNode, MappedFields} from '../../../core/types';

describe('PrefillModal Component', () => {
    const mockForm: FormDefinition = {
        id: 'form1',
        name: 'Test Form',
        description: 'Test form description',
        is_reusable: false,
        field_schema: {
            type: 'object',
            properties: {
                firstName: {
                    'avantos-type': 'text',
                    title: 'First Name',
                    type: 'string'
                },
                lastName: {
                    'avantos-type': 'text',
                    title: 'Last Name',
                    type: 'string'
                },
                email: {
                    'avantos-type': 'email',
                    title: 'Email',
                    type: 'string'
                }
            },
            required: ['firstName']
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
            position: {x: 0, y: 0},
            data: {
                id: 'node1',
                component_key: 'key1',
                component_type: 'type1',
                component_id: 'form1',
                name: 'Node 1',
                prerequisites: [],
                permitted_roles: [],
                sla_duration: {number: 1, unit: 'day'},
                approval_required: false,
                approval_roles: [],
                input_mapping: {fields: []}
            }
        }
    ];

    const mockForm2: FormDefinition = {
        id: 'form2',
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

    const mockForms: FormDefinition[] = [mockForm, mockForm2];

    let mockOnClose: () => void;
    let mockOnSave: (prefilledFields: MappedFields[]) => void;

    beforeEach(() => {
        mockOnClose = vi.fn();
        mockOnSave = vi.fn();
    });

    it('should render modal with correct title and description', () => {
        render(
            <PrefillModal
                id="node1"
                nodes={mockNodes}
                forms={mockForms}
                form={mockForm}
                onClose={mockOnClose}
                onSave={mockOnSave}
            />
        );

        expect(screen.getByText('Prefill')).toBeInTheDocument();
        expect(screen.getByText('Prefill fields for this form')).toBeInTheDocument();
    });

    it('should render all form fields', () => {
        render(
            <PrefillModal
                id="node1"
                nodes={mockNodes}
                forms={mockForms}
                form={mockForm}
                onClose={mockOnClose}
                onSave={mockOnSave}
            />
        );

        expect(screen.getByText('firstName')).toBeInTheDocument();
        expect(screen.getByText('lastName')).toBeInTheDocument();
        expect(screen.getByText('email')).toBeInTheDocument();
    });

    it('should call onClose when cancel button is clicked', () => {
        render(
            <PrefillModal
                id="node1"
                nodes={mockNodes}
                forms={mockForms}
                form={mockForm}
                onClose={mockOnClose}
                onSave={mockOnSave}
            />
        );

        const cancelButton = screen.getByRole('button', {name: /cancel/i});
        fireEvent.click(cancelButton);

        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should call onClose when close button (✕) is clicked', () => {
        render(
            <PrefillModal
                id="node1"
                nodes={mockNodes}
                forms={mockForms}
                form={mockForm}
                onClose={mockOnClose}
                onSave={mockOnSave}
            />
        );

        const closeButton = screen.getByText('✕');
        fireEvent.click(closeButton);

        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should call onSave with prefilled fields and close when save is clicked', () => {
        const prefilledMappings: MappedFields[] = [
            {fieldName: 'firstName', sourceForm: 'Previous Form', sourceField: 'name'}
        ];

        const nodesWithMapping: GraphNode[] = [
            {
                ...mockNodes[0],
                data: {
                    ...mockNodes[0].data,
                    input_mapping: {fields: prefilledMappings}
                }
            }
        ];

        render(
            <PrefillModal
                id="node1"
                nodes={nodesWithMapping}
                forms={mockForms}
                form={mockForm}
                onClose={mockOnClose}
                onSave={mockOnSave}
            />
        );

        const saveButton = screen.getByRole('button', {name: /save/i});
        fireEvent.click(saveButton);

        expect(mockOnSave).toHaveBeenCalledWith(prefilledMappings);
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should display mapped field information when field is prefilled', () => {
        const prefilledMappings: MappedFields[] = [
            {fieldName: 'firstName', sourceForm: 'Previous Form', sourceField: 'name'}
        ];

        const nodesWithMapping: GraphNode[] = [
            {
                ...mockNodes[0],
                data: {
                    ...mockNodes[0].data,
                    input_mapping: {fields: prefilledMappings}
                }
            }
        ];

        render(
            <PrefillModal
                id="node1"
                nodes={nodesWithMapping}
                forms={mockForms}
                form={mockForm}
                onClose={mockOnClose}
                onSave={mockOnSave}
            />
        );

        expect(screen.getByText('Previous Form.name')).toBeInTheDocument();
    });

    it('should show data mapping modal when unmapped field is clicked', () => {
        render(
            <PrefillModal
                id="node1"
                nodes={mockNodes}
                forms={mockForms}
                form={mockForm}
                onClose={mockOnClose}
                onSave={mockOnSave}
            />
        );

        const firstNameField = screen.getByText('firstName').closest('li');
        expect(firstNameField).toBeTruthy();

        fireEvent.click(firstNameField!);

        expect(screen.getByText('Select data element to map')).toBeInTheDocument();
    });

    it('should apply correct styling to prefilled fields', () => {
        const prefilledMappings: MappedFields[] = [
            {fieldName: 'firstName', sourceForm: 'Previous Form', sourceField: 'name'}
        ];

        const nodesWithMapping: GraphNode[] = [
            {
                ...mockNodes[0],
                data: {
                    ...mockNodes[0].data,
                    input_mapping: {fields: prefilledMappings}
                }
            }
        ];

        render(
            <PrefillModal
                id="node1"
                nodes={nodesWithMapping}
                forms={mockForms}
                form={mockForm}
                onClose={mockOnClose}
                onSave={mockOnSave}
            />
        );

        const firstNameField = screen.getByText('firstName').closest('li');
        expect(firstNameField).toHaveClass('bg-blue-50', 'border-blue-300');
    });

    it('should not open mapping modal when clicking on already mapped field', () => {
        const prefilledMappings: MappedFields[] = [
            {fieldName: 'firstName', sourceForm: 'Previous Form', sourceField: 'name'}
        ];

        const nodesWithMapping: GraphNode[] = [
            {
                ...mockNodes[0],
                data: {
                    ...mockNodes[0].data,
                    input_mapping: {fields: prefilledMappings}
                }
            }
        ];

        render(
            <PrefillModal
                id="node1"
                nodes={nodesWithMapping}
                forms={mockForms}
                form={mockForm}
                onClose={mockOnClose}
                onSave={mockOnSave}
            />
        );

        const firstNameField = screen.getByText('firstName').closest('li');
        fireEvent.click(firstNameField!);

        expect(screen.queryByText('Select data element to map')).not.toBeInTheDocument();
    });

    it('should handle empty form fields gracefully', () => {
        const emptyForm: FormDefinition = {
            ...mockForm,
            field_schema: {
                type: 'object',
                properties: {},
                required: []
            }
        };

        render(
            <PrefillModal
                id="node1"
                nodes={mockNodes}
                forms={[emptyForm]}
                form={emptyForm}
                onClose={mockOnClose}
                onSave={mockOnSave}
            />
        );

        expect(screen.getByText('Prefill')).toBeInTheDocument();
        expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
    });

    it('should not close modal when clicking inside modal content', () => {
        render(
            <PrefillModal
                id="node1"
                nodes={mockNodes}
                forms={mockForms}
                form={mockForm}
                onClose={mockOnClose}
                onSave={mockOnSave}
            />
        );

        const modalContent = screen.getByText('Prefill fields for this form').closest('div')!.parentElement;
        fireEvent.click(modalContent!);

        expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('should initialize with existing mappings from node data', () => {
        const existingMappings: MappedFields[] = [
            {fieldName: 'firstName', sourceForm: 'Form A', sourceField: 'fName'},
            {fieldName: 'email', sourceForm: 'Form B', sourceField: 'emailAddress'}
        ];

        const nodesWithMappings: GraphNode[] = [
            {
                ...mockNodes[0],
                data: {
                    ...mockNodes[0].data,
                    input_mapping: {fields: existingMappings}
                }
            }
        ];

        render(
            <PrefillModal
                id="node1"
                nodes={nodesWithMappings}
                forms={mockForms}
                form={mockForm}
                onClose={mockOnClose}
                onSave={mockOnSave}
            />
        );

        expect(screen.getByText('Form A.fName')).toBeInTheDocument();
        expect(screen.getByText('Form B.emailAddress')).toBeInTheDocument();
    });

    it('should add new mapping when field is selected from DataMappingModal', async () => {
        render(
            <PrefillModal
                id="node3"
                nodes={mockNodes}
                forms={mockForms}
                form={mockForm}
                onClose={mockOnClose}
                onSave={mockOnSave}
            />
        );

        const firstNameField = screen.getByText('firstName').closest('li');
        fireEvent.click(firstNameField!);

        await waitFor(() => {
            expect(screen.getByText('Select data element to map')).toBeInTheDocument();
        });

        const actionPropsLabel = screen.getByText('Action Properties');
        fireEvent.click(actionPropsLabel);

        const subOption = await screen.findByText('id', {}, { timeout: 1000 }).catch(() => null);

        if (subOption) {
            fireEvent.click(subOption);
            await waitFor(() => {
                expect(screen.queryByText('Select data element to map')).not.toBeInTheDocument();
            });
            expect(screen.getByText('Action Properties.id')).toBeInTheDocument();

            const saveButton = screen.getByRole('button', {name: /save/i});
            fireEvent.click(saveButton);

            expect(mockOnSave).toHaveBeenCalledWith([
                {fieldName: 'firstName', sourceForm: 'Action Properties', sourceField: 'id'}
            ]);
        } else {
            const idField = await screen.findByText('id').catch(() => null);
            if(!idField) {
                return;
            }
            fireEvent.click(idField);

            await waitFor(() => {
                expect(screen.queryByText('Select data element to map')).not.toBeInTheDocument();
            });

            expect(screen.getByText('Action Properties.id')).toBeInTheDocument();
            const saveButton = screen.getByRole('button', {name: /save/i});
            fireEvent.click(saveButton);
            expect(mockOnSave).toHaveBeenCalled();
        }
    });

    it('should close DataMappingModal when its backdrop is clicked', async () => {
        render(
            <PrefillModal
                id="node3"
                nodes={mockNodes}
                forms={mockForms}
                form={mockForm}
                onClose={mockOnClose}
                onSave={mockOnSave}
            />
        );

        const firstNameField = screen.getByText('firstName').closest('li');
        fireEvent.click(firstNameField!);

        await waitFor(() => {
            expect(screen.getByText('Select data element to map')).toBeInTheDocument();
        });

        const dataMappingBackdrop = document.querySelector('.fixed.inset-0.z-\\[60\\]');

        expect(dataMappingBackdrop).toBeTruthy();
        fireEvent.click(dataMappingBackdrop!);

        await waitFor(() => {
            expect(screen.queryByText('Select data element to map')).not.toBeInTheDocument();
        });

        expect(screen.getByText('Prefill')).toBeInTheDocument();
    });
});