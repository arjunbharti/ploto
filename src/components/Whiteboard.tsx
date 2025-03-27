import React, { useRef, useState, useEffect } from 'react';
import { Stage, Layer, Line, Rect, Circle } from 'react-konva';
import { useWhiteboardStore } from '../store/useWhiteboardStore';
import { Line as LineType, Shape, WhiteboardEvent } from '../types/whiteboard';
import Konva from 'konva';

const Whiteboard: React.FC = () => {
  const stageRef = useRef<Konva.Stage>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lines, setLines] = useState<LineType[]>([]);
  const [shapes, setShapes] = useState<Shape[]>([]);
  const { tool, color, strokeWidth, undo, saveToHistory } = useWhiteboardStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault();
        undo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo]);

  const handleMouseDown = (e: WhiteboardEvent) => {
    setIsDrawing(true);
    const pos = e.target.getStage()?.getPointerPosition();
    if (!pos) return;
    
    if (tool === 'pen') {
      setLines([...lines, { points: [pos.x, pos.y], color, strokeWidth }]);
    } else if (tool === 'rectangle') {
      setShapes([...shapes, {
        type: 'rect',
        x: pos.x,
        y: pos.y,
        width: 0,
        height: 0,
        color,
        strokeWidth,
      }]);
    } else if (tool === 'circle') {
      setShapes([...shapes, {
        type: 'circle',
        x: pos.x,
        y: pos.y,
        radius: 0,
        color,
        strokeWidth,
      }]);
    } else if (tool === 'eraser') {
      const stage = e.target.getStage();
      if (!stage) return;

      const point = stage.getPointerPosition();
      if (!point) return;

      const newLines = lines.filter(line => {
        const distance = Math.min(
          ...line.points.filter((_, i) => i % 2 === 0).map((x, i) => {
            const y = line.points[i * 2 + 1];
            return Math.sqrt(Math.pow(x - point.x, 2) + Math.pow(y - point.y, 2));
          })
        );
        return distance > strokeWidth * 2;
      });

      const newShapes = shapes.filter(shape => {
        if (shape.type === 'rect') {
          const distance = Math.min(
            Math.abs(shape.x - point.x),
            Math.abs(shape.x + (shape.width || 0) - point.x),
            Math.abs(shape.y - point.y),
            Math.abs(shape.y + (shape.height || 0) - point.y)
          );
          return distance > strokeWidth * 2;
        } else {
          const distance = Math.sqrt(
            Math.pow(shape.x - point.x, 2) + Math.pow(shape.y - point.y, 2)
          );
          return distance > (shape.radius || 0) + strokeWidth * 2;
        }
      });

      setLines(newLines);
      setShapes(newShapes);
    }
  };

  const handleMouseMove = (e: WhiteboardEvent) => {
    if (!isDrawing) return;

    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    if (!point) return;

    const lastLine = lines[lines.length - 1];
    const lastShape = shapes[shapes.length - 1];

    if (tool === 'pen') {
      lastLine.points = lastLine.points.concat([point.x, point.y]);
      setLines([...lines.slice(0, -1), lastLine]);
    } else if (tool === 'rectangle' && lastShape) {
      lastShape.width = point.x - lastShape.x;
      lastShape.height = point.y - lastShape.y;
      setShapes([...shapes.slice(0, -1), lastShape]);
    } else if (tool === 'circle' && lastShape) {
      lastShape.radius = Math.sqrt(
        Math.pow(point.x - lastShape.x, 2) + Math.pow(point.y - lastShape.y, 2)
      );
      setShapes([...shapes.slice(0, -1), lastShape]);
    } else if (tool === 'eraser') {
      const stage = e.target.getStage();
      if (!stage) return;

      const point = stage.getPointerPosition();
      if (!point) return;

      const newLines = lines.filter(line => {
        const distance = Math.min(
          ...line.points.filter((_, i) => i % 2 === 0).map((x, i) => {
            const y = line.points[i * 2 + 1];
            return Math.sqrt(Math.pow(x - point.x, 2) + Math.pow(y - point.y, 2));
          })
        );
        return distance > strokeWidth * 2;
      });

      const newShapes = shapes.filter(shape => {
        if (shape.type === 'rect') {
          const distance = Math.min(
            Math.abs(shape.x - point.x),
            Math.abs(shape.x + (shape.width || 0) - point.x),
            Math.abs(shape.y - point.y),
            Math.abs(shape.y + (shape.height || 0) - point.y)
          );
          return distance > strokeWidth * 2;
        } else {
          const distance = Math.sqrt(
            Math.pow(shape.x - point.x, 2) + Math.pow(shape.y - point.y, 2)
          );
          return distance > (shape.radius || 0) + strokeWidth * 2;
        }
      });

      setLines(newLines);
      setShapes(newShapes);
    }
  };

  const handleMouseUp = () => {
    if (isDrawing) {
      saveToHistory();
    }
    setIsDrawing(false);
  };

  const handleSelectShape = (e: WhiteboardEvent) => {
    if (tool === 'select') {
      const clickedOnEmpty = e.target === e.target.getStage();
      if (clickedOnEmpty) {
        // handling deselection if needed
      } else {
        // handling shape selection if needed
      }
    }
  };

  return (
    <div className="w-full h-full bg-white">
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleSelectShape}
        ref={stageRef}
      >
        <Layer>
          {lines.map((line, i) => (
            <Line
              key={i}
              points={line.points}
              stroke={line.color}
              strokeWidth={line.strokeWidth}
              tension={0.5}
              lineCap="round"
              lineJoin="round"
            />
          ))}
          {shapes.map((shape, i) => (
            shape.type === 'rect' ? (
              <Rect
                key={i}
                x={shape.x}
                y={shape.y}
                width={shape.width}
                height={shape.height}
                stroke={shape.color}
                strokeWidth={shape.strokeWidth}
                draggable={tool === 'select'}
              />
            ) : (
              <Circle
                key={i}
                x={shape.x}
                y={shape.y}
                radius={shape.radius}
                stroke={shape.color}
                strokeWidth={shape.strokeWidth}
                draggable={tool === 'select'}
              />
            )
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default Whiteboard; 