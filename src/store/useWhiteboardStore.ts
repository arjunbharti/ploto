import { create } from 'zustand';
import { Line, Shape, ToolType, WhiteboardState, HistoryState } from '../types/whiteboard';

interface WhiteboardStore extends WhiteboardState {
  setTool: (tool: ToolType) => void;
  setColor: (color: string) => void;
  setStrokeWidth: (width: number) => void;
  setIsDrawing: (isDrawing: boolean) => void;
  addLine: (line: Line) => void;
  addShape: (shape: Shape) => void;
  setSelectedShape: (shape: Shape | null) => void;
  clearCanvas: () => void;
  undo: () => void;
  saveToHistory: () => void;
}

const initialState: HistoryState = {
  lines: [],
  shapes: [],
};

export const useWhiteboardStore = create<WhiteboardStore>((set) => ({
  tool: 'pen',
  color: '#000000',
  strokeWidth: 2,
  isDrawing: false,
  lines: [],
  shapes: [],
  selectedShape: null,
  history: [initialState],
  historyIndex: 0,
  setTool: (tool) => set({ tool }),
  setColor: (color) => set({ color }),
  setStrokeWidth: (strokeWidth) => set({ strokeWidth }),
  setIsDrawing: (isDrawing) => set({ isDrawing }),
  addLine: (line) => set((state) => {
    const newLines = [...state.lines, line];
    return { lines: newLines };
  }),
  addShape: (shape) => set((state) => {
    const newShapes = [...state.shapes, shape];
    return { shapes: newShapes };
  }),
  setSelectedShape: (shape) => set({ selectedShape: shape }),
  clearCanvas: () => set({ lines: [], shapes: [], selectedShape: null }),
  undo: () => set((state) => {
    if (state.historyIndex > 0) {
      const newIndex = state.historyIndex - 1;
      return {
        lines: state.history[newIndex].lines,
        shapes: state.history[newIndex].shapes,
        historyIndex: newIndex,
      };
    }
    return state;
  }),
  saveToHistory: () => set((state) => {
    const newHistory = state.history.slice(0, state.historyIndex + 1);
    const currentState = {
      lines: state.lines,
      shapes: state.shapes,
    };
    return {
      history: [...newHistory, currentState],
      historyIndex: state.historyIndex + 1,
    };
  }),
})); 