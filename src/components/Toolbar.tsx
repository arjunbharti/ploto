import React from 'react';
import { useWhiteboardStore } from '../store/useWhiteboardStore';
import { ToolType } from '../types/whiteboard';

const Toolbar: React.FC = () => {
  const { tool, color, strokeWidth, setTool, setColor, setStrokeWidth } = useWhiteboardStore();

  const tools: { type: ToolType; icon: string; name: string }[] = [
    { type: 'pen', icon: '✏️', name: 'Pen Tool' },
    { type: 'rectangle', icon: '◼️', name: 'Rectangle' },
    { type: 'circle', icon: '⭕', name: 'Circle' },
    { type: 'line', icon: '📏', name: 'Line' },
    { type: 'select', icon: '👆', name: 'Select' },
    { type: 'eraser', icon: '🧹', name: 'Eraser' },
  ];

  return (
    <div className="absolute right-0 top-1/2 -translate-y-1/2 bg-white rounded-l-lg shadow-lg p-2 flex flex-col gap-4 z-10">
      <div className="flex flex-col gap-2">
        {tools.map(({ type, icon, name }) => (
          <div key={type} className="relative group">
            <button
              onClick={() => setTool(type)}
              className={`p-1 rounded transition-colors duration-200 ${
                tool === type ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
              }`}
            >
              {icon}
            </button>
            <div className="absolute right-full mr-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              {name}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-t-transparent border-l-4 border-l-gray-800 border-b-4 border-b-transparent"></div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <div className="relative group">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-8 h-8 rounded cursor-pointer"
          />
          <div className="absolute right-full mr-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            Color Picker
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-t-transparent border-l-4 border-l-gray-800 border-b-4 border-b-transparent"></div>
          </div>
        </div>
        <div className="relative group">
          <input
            type="range"
            min="1"
            max="20"
            value={strokeWidth}
            onChange={(e) => setStrokeWidth(Number(e.target.value))}
            className="w-24"
          />
          <div className="absolute right-full mr-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            Stroke Width
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-t-transparent border-l-4 border-l-gray-800 border-b-4 border-b-transparent"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toolbar; 