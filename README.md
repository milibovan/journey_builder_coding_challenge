# Journey Builder React Coding Challenge

A React + TypeScript application for managing form prefill mappings in a directed acyclic graph (DAG) of forms. This solution allows users to configure data flow between forms by mapping fields from upstream forms and global properties to downstream form fields.

## 🎯 Challenge Overview

This project implements a prefill configuration UI for a form journey builder, where:
- Forms are connected in a DAG structure
- Users can click on any form node to configure prefill mappings
- Fields can be prefilled from:
    - Direct ancestor forms (Form B can use data from Form A)
    - Transitive ancestor forms (Form D can use data from Form A through Form B)
    - Global properties (Action Properties, Client Organization Properties)

## 🏗️ Architecture

### Project Structure

```
journey_builder_coding_challenge/
├── frontendchallengeserver/       # Mock API server
│   ├── graph.json                 # Blueprint data
│   ├── index.js                   # Express server
│   └── package.json
├── journey_builder/               # React application
│   └── src/
│       ├── api/
│       │   └── mockData.ts        # API client
│       ├── components/
│       │   ├── CustomFlow.tsx     # ReactFlow wrapper
│       │   └── modals/
│       │       ├── __tests__/
│       │       │   ├── DataMappingModal.test.tsx
│       │       │   ├── PrefillModal.test.tsx
│       │       │   └── MappingItem.test.tsx
│       │       ├── PrefillModal.tsx                # Main prefill UI
│       │       ├── DataMappingModal.tsx            # Data source selector
│       │       └── mappings/
│       │           ├── AncestorNodesMapping.tsx     # Ancestor node properties
│       │           ├── GlobalPropertiesMapping.tsx  # Global properties
│       │           └── MappingItem.tsx              # Reusable mapping template
│       ├── core/
│       │   ├── __tests__/
│       │   │   └── traversal.test.ts   # Unit tests for graph traversal
│       │   ├── types.ts                # TypeScript definitions
│       │   └── traversal.ts            # DAG traversal logic
│       ├── utils/
│       │   └── utils.ts                # Constants & mock data
│       └── test/
│           └── setup.ts                # Test setup and configuration
├── run.sh                              # Setup and run script
└── README.md
```

### Core Components

#### 1. **CustomFlow** (`components/CustomFlow.tsx`)
- Wraps ReactFlow library for graph visualization
- Handles node clicks to trigger prefill modal
- Manages interactive graph state (nodes, edges)

#### 2. **PrefillModal** (`components/modals/PrefillModal.tsx`)
- Main interface for configuring field mappings
- Displays all fields from the selected form
- Shows current mappings with source information
- Allows removal of existing mappings
- Triggers DataMappingModal for new mappings

#### 3. DataMappingModal (components/modals/DataMappingModal.tsx)

- Hierarchical data source selector
- Orchestrates mapping components for different data sources
- Search functionality across all data sources
- Delegates rendering to specialized mapping components:
  - GlobalPropertiesMapping: Handles Action Properties and Client Organization Properties
  - AncestorNodesMapping: Handles direct and transitive ancestor forms
  - MappingItem: Reusable component template for consistent rendering

### Data Flow

```
App.tsx (State Management)
    ↓
CustomFlow (Graph Visualization)
    ↓
[User Clicks Node]
    ↓
PrefillModal (Field Configuration)
    ↓
[User Clicks Unmapped Field]
    ↓
DataMappingModal (Source Selection)
    ↓
[User Selects Source]
    ↓
Update blueprints state in App.tsx
```

## 🔑 Key Design Decisions

### 1. **Extensible Data Source Architecture**
The system is designed to easily support new data sources:

```typescript
// Current implementation uses getAncestorNodes/getAncestorForms
// New data sources can be added by:
// 1. Adding new data fetching logic in traversal.ts
// 2. Extending the DataMappingModal to render new categories
// 3. No changes needed to PrefillModal or state management
```

**Adding a new data source requires:**
- Define data fetching function in `core/traversal.ts`
- Add category to `DataMappingModal.tsx` rendering logic
- Update global properties array in `utils/utils.ts` if needed

### 2. **DAG Traversal Strategy**
Uses depth-first search with cycle detection:
- `getAncestorNodes()`: Recursively collects all upstream nodes using prerequisites
- `getAncestorForms()`: Maps nodes to their form definitions
- Visited set prevents infinite loops in case of circular references

### 3. **State Management**
Centralized state in `App.tsx` using React hooks:
- Single source of truth for blueprint data
- Immutable updates ensure predictable state changes
- Selected node triggers modal rendering

### 4. **Type Safety**
Comprehensive TypeScript interfaces ensure:
- API contract validation
- Component prop type checking
- Reduced runtime errors

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation & Running

```bash
# Clone the repository
git clone <repository-url>
cd journey_builder_coding_challenge

# Run the application (installs dependencies and starts both server and client)
chmod +x run.sh
./run.sh
```

The script will:
1. Install dependencies for both server and client
2. Start the mock API server on `http://localhost:3000`
3. Start the Vite dev server on `http://localhost:5173`

### Manual Setup

If you prefer to run components separately:

```bash
# Terminal 1 - Start mock server
cd frontendchallengeserver
npm start

# Terminal 2 - Start React app
cd journey_builder
npm install --legacy-peer-deps
npm run dev
```

## 🎨 Features Implemented

### ✅ Core Requirements
- ✅ Fetch and render blueprint graph data
- ✅ Display forms in a node-based UI (using ReactFlow)
- ✅ Click nodes to open prefill configuration modal
- ✅ List all fields from selected form
- ✅ Map fields to data from:
    - Direct ancestor forms
    - Transitive ancestor forms
    - Global properties (Action/Client Organization)
- ✅ Remove existing mappings
- ✅ Save mappings back to application state

### ✅ Additional Features
- ✅ Search functionality in data source selector
- ✅ Visual indicators for mapped vs unmapped fields
- ✅ Expandable tree structure for data sources
- ✅ Responsive modal design
- ✅ Type-safe implementation with TypeScript

## 🔧 Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety and developer experience
- **Vite** - Build tool and dev server
- **ReactFlow (@xyflow/react)** - Graph visualization
- **Lucide React** - Icon library
- **Tailwind CSS** - Styling (via utility classes)
- **Express** - Mock API server

## 📝 API Structure

### Endpoint
```
GET http://localhost:3000/api/v1/123/actions/blueprints/bp_456/graph
```

### Response Schema
```typescript
{
  id: string;
  tenant_id: string;
  name: string;
  description: string;
  category: string;
  nodes: GraphNode[];      // Form nodes with position & prerequisites
  edges: GraphEdge[];      // Connections between nodes
  forms: FormDefinition[]; // Form schemas and UI definitions
  branches: string[];
  triggers: string[];
}
```

## 🎯 Design Patterns Used

### 1. **Separation of Concerns**
- **API Layer** (`api/mockData.ts`): Data fetching
- **Core Logic** (`core/`): Business logic, types, traversal
- **Components** (`components/`): UI rendering
- **Utils** (`utils/`): Constants and helpers

### 2. **Composition**
- Modals are composed together (PrefillModal → DataMappingModal)
- Each component has a single responsibility
- Props drilling kept minimal

### 3. **Immutable State Updates**
```typescript
setBlueprints(prevBlueprints => ({
  ...prevBlueprints,
  nodes: prevBlueprints.nodes.map(node =>
    node.id === selectedNode.id
      ? { ...node, data: { ...node.data, input_mapping: { fields: newFields } } }
      : node
  )
}));
```

### 4. **Type-Driven Development**
All data structures defined in `types.ts` ensure compile-time safety

## 🔮 Future Enhancements

### Potential Features
- [ ] Validation for circular dependencies
- [ ] Field type compatibility checking
- [ ] Undo/redo functionality
- [ ] Export/import mapping configurations
- [ ] Drag-and-drop field mapping
- [ ] Real-time preview of prefilled values

## 🧪 Testing

### Testing Stack
- **Vitest** - Fast unit test framework
- **React Testing Library** - Component testing utilities
- **@testing-library/jest-dom** - Custom DOM matchers

### Running Tests

```bash
cd journey_builder
npm install --legacy-peer-deps # Install dependencies (includes testing libraries)
npm run test        # Run all tests
npm run test:watch  # Run tests in watch mode
npm run test:ui     # Open Vitest UI
npm run coverage    # Generate coverage report
```

### Test Structure

```
journey_builder/src/
├── components/
│   └── modals/
│       ├── __tests__/
│       │   ├── DataMappingModal.test.tsx
│       │   ├── PrefillModal.test.tsx
│       │   └── mappings/
│       │       └── MappingItem.test.tsx
│       └── ...
└── core/
    └── __tests__/
        └── traversal.test.ts
```

### Test Coverage

#### 1. **Core Logic Tests** (`core/__tests__/traversal.test.ts`)

**`getAncestorNodes()` Tests:**
- ✅ Returns empty array for non-existent nodes
- ✅ Returns empty array when node has no prerequisites
- ✅ Returns direct ancestor nodes
- ✅ Returns multiple ancestor nodes
- ✅ Handles nested (transitive) prerequisites correctly
- ✅ **Handles circular dependencies without infinite loop**
- ✅ Prevents duplicate nodes in results

**`getAncestorForms()` Tests:**
- ✅ Returns empty array when no nodes provided
- ✅ Returns empty array when no forms match
- ✅ Returns matching forms for given nodes
- ✅ Returns multiple forms for multiple nodes
- ✅ Handles nodes with missing form references

#### 2. **Component Tests**

**MappingItem Component** (`components/modals/mappings/__tests__/MappingItem.test.tsx`)
- ✅ Renders label correctly
- ✅ Calls onToggle when label is clicked
- ✅ Shows/hides fields based on expanded state
- ✅ Calls onSelectField with correct field when clicked
- ✅ Filters fields based on search term (case insensitive)
- ✅ Shows all fields when search term is empty
- ✅ Shows no fields when search term matches nothing
- ✅ Filters fields with partial match
- ✅ Applies correct hover styles
- ✅ Handles empty fields array
- ✅ Maintains proper indentation for fields
- ✅ Uses cursor-pointer class for clickable elements

**DataMappingModal Component** (`components/modals/__tests__/DataMappingModal.test.tsx`)
- ✅ Renders modal with correct title
- ✅ Renders available data section
- ✅ Renders search input
- ✅ Calls onClose when cancel button is clicked
- ✅ Calls onClose when backdrop is clicked
- ✅ Renders ancestor nodes
- ✅ Expands form when clicked
- ✅ Calls onSelect with correct parameters when field is selected
- ✅ Filters fields based on search term
- ✅ Toggles form expansion on multiple clicks
- ✅ Handles nodes with no ancestors
- ✅ Maintains search term state across form expansions
- ✅ Has proper z-index layering

**PrefillModal Component** (`components/modals/__tests__/PrefillModal.test.tsx`)
- ✅ Renders modal with correct title and description
- ✅ Renders all form fields
- ✅ Calls onClose when cancel button is clicked
- ✅ Calls onClose when close button (✕) is clicked
- ✅ Calls onSave with prefilled fields and closes when save is clicked
- ✅ Displays mapped field information when field is prefilled
- ✅ Shows data mapping modal when unmapped field is clicked
- ✅ Applies correct styling to prefilled fields
- ✅ Does not open mapping modal when clicking on already mapped field
- ✅ Handles empty form fields gracefully
- ✅ Does not close modal when clicking inside modal content
- ✅ Initializes with existing mappings from node data

### Key Testing Patterns

#### 1. **Circular Dependency Prevention**
```typescript
it('should handle circular dependencies without infinite loop', () => {
  // node1 → node2 → node1 (circular)
  const result = getAncestorNodes('node1', nodes);
  expect(result).toHaveLength(1);
  expect(result[0].id).toBe('node2');
});
```

The algorithm uses a `visited` set to track processed nodes and prevent infinite recursion.

#### 2. **Mock Functions**
```typescript
const mockOnSelect = vi.fn();
const mockOnClose = vi.fn();

fireEvent.click(cancelButton);
expect(mockOnClose).toHaveBeenCalledTimes(1);
```

#### 3. **User Interaction Testing**
```typescript
// Expand form
const formLabel = screen.getByText('Previous Node');
fireEvent.click(formLabel);

// Verify fields are visible
expect(screen.getByText('name')).toBeInTheDocument();
```

#### 4. **Search Functionality**
```typescript
const searchInput = screen.getByPlaceholderText('Search');
fireEvent.change(searchInput, { target: { value: 'name' } });

expect(screen.getByText('name')).toBeInTheDocument();
expect(screen.queryByText('age')).not.toBeInTheDocument();
```

### Test Best Practices

✅ **Isolation**: Each test is independent with proper setup/cleanup
✅ **Descriptive Names**: Test names clearly describe what is being tested
✅ **Arrange-Act-Assert**: Clear test structure
✅ **Mock External Dependencies**: API calls and callbacks are mocked
✅ **User-Centric**: Tests focus on user interactions, not implementation details
✅ **Edge Cases**: Empty states, missing data, circular dependencies

### Coverage Goals

Current test coverage focuses on:
- **Core business logic**: 100% coverage of traversal algorithms
- **User interactions**: All clickable elements and form interactions
- **Edge cases**: Empty states, missing data, circular dependencies
- **State management**: Mapping creation, updates, and deletions

### Future Testing Enhancements

- [ ] Integration tests for full user workflows
- [ ] E2E tests using Playwright or Cypress
- [ ] Visual regression testing
- [ ] Performance testing for large graphs
- [ ] Accessibility testing (ARIA attributes, keyboard navigation)
- [ ] API mocking with MSW (Mock Service Worker)

## 📚 Code Quality

### Best Practices Applied
- ✅ Clear, descriptive variable names
- ✅ Consistent code formatting
- ✅ TypeScript for type safety
- ✅ Modular component structure
- ✅ Proper event handling with stopPropagation
- ✅ Accessibility considerations (keyboard navigation ready)
- ✅ Error handling in API calls

### Modern React Patterns
- Functional components with hooks
- Controlled components for forms
- Proper dependency arrays in useCallback/useEffect
- Conditional rendering for modals
- State lifting for shared data

## 🤝 How to Extend

### Adding a New Data Source

1. **Define data fetching logic** (`core/traversal.ts`):
```typescript
export function getCustomDataSource(id: string): CustomData[] {
  // Your logic here
}
```

2. **Update the DataMappingModal** (or new selector component):
```typescript
const customData = getCustomDataSource(id);

// Add to modal rendering
<div key="custom-source">
  <div onClick={() => toggleForm('custom-source')}>
    Custom Data Source
  </div>
  {/* Render fields */}
</div>
```

3. **No changes needed** to PrefillModal or App.tsx state management!

## 📄 License

This project was created as part of a coding challenge for Avantos.

---

**Author**: Mili Bovan  
**Date**: November 2025  
**Challenge**: Journey Builder React Coding Challenge
