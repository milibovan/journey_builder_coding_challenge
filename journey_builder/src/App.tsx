import './App.css'
import CustomFlow from "./components/CustomFlow.tsx";
import {useEffect, useState} from "react";
import type {BlueprintResponse, FormDefinition} from "./core/types.ts";
import {fetchBlueprints} from "./api/mockData.ts";
import type {Node, Edge} from "@xyflow/react";
import PrefillModal from "./components/modals/PrefillModal.tsx";

function App() {
    const [blueprints, setBlueprints] = useState<BlueprintResponse>();
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedNode, setSelectedNode] = useState<Node | null>(null);

    useEffect(() => {
        fetchBlueprints().then((response) => {
            setBlueprints(response);
            setLoading(false);
        })
    }, [])

    const nodes: Node[] = blueprints?.nodes.map((node) => ({
        id: node.id,
        data: {label: node.data.name},
        position: node.position
    })) ?? []

    const edges: Edge[] = blueprints?.edges.map((edge) => ({
        id: Math.random().toString(),
        source: edge.source,
        target: edge.target,
    })) ?? []

    let form: FormDefinition | undefined;

    if (selectedNode && blueprints) {
        const formId = blueprints.nodes.find((node) => node.id === selectedNode.id)?.data.component_id;
        form = blueprints.forms.find((f) => f.id === formId);
    }

    return (
        <>
            {loading && <div><p className="center text-emerald-800">Loading...</p></div>}
            {blueprints && <CustomFlow id={blueprints.id} initialNodes={nodes} initialEdges={edges}
                                       onNodeClick={setSelectedNode}/>}

            {blueprints && selectedNode && form &&
                <PrefillModal id={selectedNode.id} nodes={blueprints.nodes} form={form}
                              onClose={() => setSelectedNode(null)}/>}
        </>
    )
}

export default App
