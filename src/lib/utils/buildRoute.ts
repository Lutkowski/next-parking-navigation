import {dijkstraUndirected, getPath} from "@/lib/utils/dijkstra";

const buildRoute = (graph: any, graphData: any, startNodeId: string, endNodeId: string) => {
    const {previous} = dijkstraUndirected(graph, startNodeId);
    const path = getPath(previous, startNodeId, endNodeId);
    const coordinates = path.map(node => {
        const graphNode = graphData.nodes.find((n: any) => n.id === node);
        if (!graphNode) {
            throw new Error(`Node with id ${node} not found in graph data`);
        }
        return graphNode.coordinates as [number, number];
    });
    return coordinates;
};

export default buildRoute