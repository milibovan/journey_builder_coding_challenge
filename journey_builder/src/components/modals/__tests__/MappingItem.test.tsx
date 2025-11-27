import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MappingItem from '../mappings/MappingItem';

describe('MappingItem Component', () => {
    const mockOnToggle = vi.fn();
    const mockOnSelectField = vi.fn();

    const defaultProps = {
        label: 'Test Form',
        fields: ['field1', 'field2', 'field3'],
        isExpanded: false,
        searchTerm: '',
        onToggle: mockOnToggle,
        onSelectField: mockOnSelectField
    };

    beforeEach(() => {
        mockOnToggle.mockClear();
        mockOnSelectField.mockClear();
    });

    it('should render the label correctly', () => {
        render(<MappingItem {...defaultProps} />);
        expect(screen.getByText('Test Form')).toBeInTheDocument();
    });

    it('should call onToggle when label is clicked', () => {
        render(<MappingItem {...defaultProps} />);
        const labelElement = screen.getByText('Test Form');
        fireEvent.click(labelElement);
        expect(mockOnToggle).toHaveBeenCalledTimes(1);
    });

    it('should not show fields when collapsed', () => {
        render(<MappingItem {...defaultProps} isExpanded={false} />);
        expect(screen.queryByText('field1')).not.toBeInTheDocument();
        expect(screen.queryByText('field2')).not.toBeInTheDocument();
    });

    it('should show fields when expanded', () => {
        render(<MappingItem {...defaultProps} isExpanded={true} />);
        expect(screen.getByText('field1')).toBeInTheDocument();
        expect(screen.getByText('field2')).toBeInTheDocument();
        expect(screen.getByText('field3')).toBeInTheDocument();
    });

    it('should call onSelectField with correct field when field is clicked', () => {
        render(<MappingItem {...defaultProps} isExpanded={true} />);
        const field = screen.getByText('field2');
        fireEvent.click(field);
        expect(mockOnSelectField).toHaveBeenCalledWith('field2');
    });

    it('should filter fields based on search term (case insensitive)', () => {
        render(<MappingItem {...defaultProps} isExpanded={true} searchTerm="FIELD1" />);
        expect(screen.getByText('field1')).toBeInTheDocument();
        expect(screen.queryByText('field2')).not.toBeInTheDocument();
        expect(screen.queryByText('field3')).not.toBeInTheDocument();
    });

    it('should show all fields when search term is empty', () => {
        render(<MappingItem {...defaultProps} isExpanded={true} searchTerm="" />);
        expect(screen.getByText('field1')).toBeInTheDocument();
        expect(screen.getByText('field2')).toBeInTheDocument();
        expect(screen.getByText('field3')).toBeInTheDocument();
    });

    it('should show no fields when search term matches nothing', () => {
        render(<MappingItem {...defaultProps} isExpanded={true} searchTerm="nonexistent" />);
        expect(screen.queryByText('field1')).not.toBeInTheDocument();
        expect(screen.queryByText('field2')).not.toBeInTheDocument();
        expect(screen.queryByText('field3')).not.toBeInTheDocument();
    });

    it('should filter fields with partial match', () => {
        const props = {
            ...defaultProps,
            fields: ['firstName', 'lastName', 'email'],
            isExpanded: true,
            searchTerm: 'name'
        };

        render(<MappingItem {...props} />);
        expect(screen.getByText('firstName')).toBeInTheDocument();
        expect(screen.getByText('lastName')).toBeInTheDocument();
        expect(screen.queryByText('email')).not.toBeInTheDocument();
    });

    it('should apply hover styles to label', () => {
        render(<MappingItem {...defaultProps} />);
        const labelDiv = screen.getByText('Test Form').closest('div');
        expect(labelDiv).toHaveClass('hover:bg-blue-50');
    });

    it('should apply hover styles to fields', () => {
        render(<MappingItem {...defaultProps} isExpanded={true} />);
        const field = screen.getByText('field1').closest('div');
        expect(field).toHaveClass('hover:bg-blue-50');
    });

    it('should handle empty fields array', () => {
        render(<MappingItem {...defaultProps} fields={[]} isExpanded={true} />);
        expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
    });

    it('should maintain proper indentation for fields', () => {
        render(<MappingItem {...defaultProps} isExpanded={true} />);
        const fieldsContainer = screen.getByText('field1').closest('.ml-6');
        expect(fieldsContainer).toHaveClass('ml-6');
    });

    it('should use cursor-pointer class for clickable elements', () => {
        render(<MappingItem {...defaultProps} isExpanded={true} />);
        const label = screen.getByText('Test Form').closest('div');
        const field = screen.getByText('field1').closest('div');

        expect(label).toHaveClass('cursor-pointer');
        expect(field).toHaveClass('cursor-pointer');
    });
});