const findNearestNodeToCoordinate = (graphData: any, coordinate: [number, number]): string | null => {
    let nearestNode: any = null;
    let minDistance = Infinity;

    for (const node of graphData.nodes) {
        const distance = Math.sqrt(
            Math.pow(node.coordinates[0] - coordinate[0], 2) +
            Math.pow(node.coordinates[1] - coordinate[1], 2)
        );

        if (distance < minDistance) {
            minDistance = distance;
            nearestNode = node;
        }
    }

    return nearestNode ? nearestNode.id : null;
};

export default findNearestNodeToCoordinate