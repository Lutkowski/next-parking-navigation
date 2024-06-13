import {Graph} from 'graphlib';

interface DijkstraResult {
    distances: { [key: string]: number };
    previous: { [key: string]: string | null };
}

export const dijkstraUndirected = (graph: Graph, start: string): DijkstraResult => {
    const distances: { [key: string]: number } = {};
    const visited: { [key: string]: boolean } = {};
    const previous: { [key: string]: string | null } = {};
    const nodes = new Set<string>();

    graph.nodes().forEach((node: string) => {
        if (node === start) {
            distances[node] = 0;
        } else {
            distances[node] = Infinity;
        }
        previous[node] = null;
        nodes.add(node);
    });

    while (nodes.size > 0) {
        const closestNode = Array.from(nodes).reduce((minNode, node) =>
            (distances[node] < distances[minNode] ? node : minNode), Array.from(nodes)[0]);
        nodes.delete(closestNode);
        visited[closestNode] = true;

        const neighbors = [...(graph.successors(closestNode) || []), ...(graph.predecessors(closestNode) || [])];
        neighbors.forEach((neighbor: string) => {
            if (!visited[neighbor]) {
                const edgeWeight = graph.edge(closestNode, neighbor) || graph.edge(neighbor, closestNode);
                const alt = distances[closestNode] + edgeWeight;
                if (alt < distances[neighbor]) {
                    distances[neighbor] = alt;
                    previous[neighbor] = closestNode;
                }
            }
        });
    }

    return {distances, previous};
};

export const getPath = (previous: { [key: string]: string | null }, start: string, end: string): string[] => {
    const path: string[] = [];
    let currentNode = end;
    while (currentNode !== start) {
        path.unshift(currentNode);
        currentNode = previous[currentNode] as string;
    }
    path.unshift(start);
    return path;
};
