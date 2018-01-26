import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { Reducer } from 'redux';
import { init, updateNodeColor, addNode, nodeSelected, nodeDeselected, } from '../actions/diagram';
import { BaseNodeModel, DiagramModel, LinkModel } from '../model/model';

export interface DiagramState {
    model: DiagramModel<NodeModel, LinkModel>;
    selectedNodeKeys: string[];
}

export interface NodeModel extends BaseNodeModel {
    color: string;
}

const initHandler = (state: DiagramState, payload: DiagramModel<NodeModel, LinkModel>): DiagramState => {
    return {
        ...state,
        model: payload
    };
};

const colors = [
    'lightblue',
    'orange',
    'lightgreen',
    'pink',
    'yellow',
    'red',
    'grey',
    'magenta',
    'cyan'
];

const getRandomColor = () => {
    return colors[Math.floor(Math.random() * (colors.length))];
};

const updateNodeColorHandler = (state: DiagramState): DiagramState => {
    const updatedNodes = state.model.nodeDataArray.map(node => {
        return {
            ...node,
            color: getRandomColor()
        };
    });

    return {
        ...state,
        model: {
            ...state.model,
            nodeDataArray: updatedNodes
        }
    };
};

const addNodeHandler = (state: DiagramState, payload: string): DiagramState => {
    const linksToAdd: LinkModel[] = state.selectedNodeKeys.map(parent => {
        return { from: parent, to: payload };
    }
    );
    return {
        ...state,
        model: {
            ...state.model,
            nodeDataArray: [...state.model.nodeDataArray, { key: payload, color: getRandomColor() }],
            linkDataArray: linksToAdd.length > 0 ?
                [...state.model.linkDataArray].concat(linksToAdd) :
                [...state.model.linkDataArray]
        }
    };
};

const nodeSelectedHandler = (state: DiagramState, payload: string): DiagramState => {
    return {
        ...state,
        selectedNodeKeys: [
            ...state.selectedNodeKeys,
            payload
        ]
    };
};

const nodeDeselectedHandler = (state: DiagramState, payload: string): DiagramState => {
    const nodeIndexToRemove = state.selectedNodeKeys.findIndex(key => key === payload);
    if (nodeIndexToRemove === -1) {
        return {
            ...state
        };
    }
    return {
        ...state,
        selectedNodeKeys: [
            ...state.selectedNodeKeys.slice(0, nodeIndexToRemove),
            ...state.selectedNodeKeys.slice(nodeIndexToRemove + 1)
        ]
    };
};

export const diagramReducer: Reducer<DiagramState> =
    reducerWithInitialState<DiagramState>(
        { model: { nodeDataArray: [{ key: 'Root', color: 'lightblue' }], linkDataArray: [] }, selectedNodeKeys: [] })
        .case(init, initHandler)
        .case(updateNodeColor, updateNodeColorHandler)
        .case(addNode, addNodeHandler)
        .case(nodeSelected, nodeSelectedHandler)
        .case(nodeDeselected, nodeDeselectedHandler)
        .build();

export const modelSelector = (state: DiagramState) => state.model;
export const nodeSelectionSelector = (state: DiagramState) => state.selectedNodeKeys;