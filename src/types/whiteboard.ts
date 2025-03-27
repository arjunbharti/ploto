import { KonvaEventObject } from 'konva/lib/Node';
import { Stage } from 'konva/lib/Stage';

export type ToolType = 'pen' | 'rectangle' | 'circle' | 'line' | 'select' | 'eraser';

export interface Line {
  points: number[];
  color: string;
  strokeWidth: number;
}

export interface Shape {
  type: 'rect' | 'circle';
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
  color: string;
  strokeWidth: number;
}

export interface WhiteboardEvent extends KonvaEventObject<MouseEvent> {
  target: Stage;
}

export interface HistoryState {
  lines: Line[];
  shapes: Shape[];
}

export interface WhiteboardState {
  tool: ToolType;
  color: string;
  strokeWidth: number;
  isDrawing: boolean;
  lines: Line[];
  shapes: Shape[];
  selectedShape: Shape | null;
  history: HistoryState[];
  historyIndex: number;
} 