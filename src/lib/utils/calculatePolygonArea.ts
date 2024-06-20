const calculatePolygonArea = (coordinates: [number, number][]) => {
    let area = 0;
    const numPoints = coordinates.length;

    for (let i = 0; i < numPoints; i++) {
        const [x1, y1] = coordinates[i];
        const [x2, y2] = coordinates[(i + 1) % numPoints];
        area += x1 * y2 - x2 * y1;
    }

    return Math.abs(area / 2);
};

export default calculatePolygonArea