import React, {useState, useCallback} from 'react';
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

const defaultEdgeOptions: DefaultEdgeOptions = {
    animated: true,
};

interface CustomFlowProps {
    id: string;
    initialNodes: Node[];
    initialEdges: Edge[];
    onNodeClick: (node: Node) => void;
}

function CustomFlow({id, initialNodes, initialEdges, onNodeClick}: CustomFlowProps) {
    const [nodes, setNodes] = useState<Node[]>(initialNodes);
    const [edges, setEdges] = useState<Edge[]>(initialEdges);

    const handleNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
        onNodeClick(node);
    }, [onNodeClick])

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
        <div style={{height: 400, width: 1200, paddingTop: 20}}>
            <ReactFlow
                key={id}
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onNodeClick={handleNodeClick}
                onConnect={onConnect}
                fitView
                defaultEdgeOptions={defaultEdgeOptions}
            />
        </div>
    );
}

export default CustomFlow;