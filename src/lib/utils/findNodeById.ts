const findNodeByShopId = (shopId: string, graphData: any, withCoordinates: boolean = false): string | null => {
    const node = graphData.nodes.find((n: any) => n.id === shopId);
    return node ? node.id : null;
};

export default findNodeByShopId