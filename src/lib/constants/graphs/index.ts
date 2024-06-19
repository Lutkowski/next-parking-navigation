import {graph1, graphData1} from './graph1';
import {graph2, graphData2} from './graph2';
import {graph3, graphData3} from './graph3';
import {graph_1, graphData_1} from "@/lib/constants/graphs/graph-1";

export const graphs = {
    1: {graph: graph1, graphData: graphData1},
    2: {graph: graph2, graphData: graphData2},
    3: {graph: graph3, graphData: graphData3},
    '-1': {graph: graph_1, graphData: graphData_1},
    '-2': null,
};