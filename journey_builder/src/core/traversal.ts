import type {FormDefinition, GraphNode} from "./types.ts";

export function getAncestorNodes(id: string, nodes: GraphNode[]): GraphNode[] {
    const selectedNode = nodes.find((node) => node.id === id);

    if (!selectedNode) {
        return [];
    }

    const visited = new Set<string>();
    const ancestors: GraphNode[] = [];

    function collectAncestors(nodeId: string) {
        if (visited.has(nodeId)) return;
        visited.add(nodeId);

        const node = nodes.find((n) => n.id === nodeId);
        if (!node) return;

        const prerequisites = node.data.prerequisites || [];

        prerequisites.forEach((prereqId) => {
            if (visited.has(prereqId)) return;

            const prereqNode = nodes.find((n) => n.id === prereqId);
            if (prereqNode && !ancestors.find((a) => a.id === prereqNode.id)) {
                ancestors.push(prereqNode);
                collectAncestors(prereqId);
            }
        });
    }

    collectAncestors(id);

    return ancestors;
}

export function getAncestorForms(nodes: GraphNode[], forms: FormDefinition[]): FormDefinition[] {
    const ancestorForms: FormDefinition[] = [];
    const formsIds: string[] = nodes.map((node) => node.data.component_id);
    for (const formId of formsIds) {
        const form = forms.find((form) => form.id === formId);
        if (form) {
            ancestorForms.push(form);
        }
    }
    return ancestorForms;
}