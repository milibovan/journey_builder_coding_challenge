import type {BlueprintResponse} from "../core/types.ts";
import {actionBlueprintId, host, port, tenantId, version} from "../utils/utils.ts";

export async function fetchBlueprints() : Promise<BlueprintResponse> {
    try {
        const response = await fetch(`${host}:${port}/api/${version}/${tenantId}/actions/blueprints/${actionBlueprintId}/graph`);
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
}