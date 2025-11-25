import {useState, useCallback} from 'react';
import {
    ReactFlow,
    addEdge,
    applyNodeChanges,
    applyEdgeChanges,
    type Node,
    type Edge,
    type OnConnect,
    type OnNodesChange,
    type OnEdgesChange,
    type DefaultEdgeOptions,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// const initialNodes: Node[] = [
//     {id: '1', data: {label: 'Node 1'}, position: {x: 5, y: 5}},
//     {id: '2', data: {label: 'Node 2'}, position: {x: 5, y: 100}},
// ];
//
// const initialEdges: Edge[] = [{id: 'e1-2', source: '1', target: '2'}];


const defaultEdgeOptions: DefaultEdgeOptions = {
    animated: true,
};

interface CustomFlowProps {
    id: string;
    initialNodes: Node[];
    initialEdges: Edge[];
}

function CustomFlow({id, initialNodes, initialEdges}: CustomFlowProps) {
    const [nodes, setNodes] = useState<Node[]>(initialNodes);
    const [edges, setEdges] = useState<Edge[]>(initialEdges);

    const onNodesChange: OnNodesChange = useCallback(
        (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
        [setNodes],
    );
    const onEdgesChange: OnEdgesChange = useCallback(
        (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        [setEdges],
    );
    const onConnect: OnConnect = useCallback(
        (connection) => setEdges((eds) => addEdge(connection, eds)),
        [setEdges],
    );

    return (
        <div style={{height: 800, width: 1200, paddingTop: 20}}>
            <ReactFlow
                key={id}
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
                defaultEdgeOptions={defaultEdgeOptions}
            />
        </div>
    );
}

export default CustomFlow;