import { useRef, useState, useEffect } from 'react';
import Canvas from './components/Canvas';
import Toolbar from './components/Toolbar';

const STORAGE_PREFIX = 'sketchboard_';

function App() {
  const [tool, setTool] = useState('pen');
  const [color, setColor] = useState('#000000');
  const [size, setSize] = useState(4);
  const [dark, setDark] = useState(false);
  const [boardNames, setBoardNames] = useState([]);
  const canvasRef = useRef(null);

  useEffect(() => {
    refreshBoardNames();
  }, []);

  const refreshBoardNames = () => {
    const names = Object.keys(localStorage)
      .filter((k) => k.startsWith(STORAGE_PREFIX))
      .map((k) => k.replace(STORAGE_PREFIX, ''));
    setBoardNames(names);
  };

  const saveBoard = () => {
    const name = window.prompt('Name this board:');
    if (!name) return;
    const strokes = canvasRef.current.getStrokes();
    localStorage.setItem(STORAGE_PREFIX + name, JSON.stringify(strokes));
    refreshBoardNames();
    alert(`Saved as "${name}"`);
  };

  const loadBoard = (name) => {
    const data = localStorage.getItem(STORAGE_PREFIX + name);
    if (!data) return;
    canvasRef.current.loadStrokes(JSON.parse(data));
  };

  const newBoard = () => canvasRef.current.clear();

  return (
    <div className={`h-screen w-screen flex flex-col p-4 gap-4 ${dark ? 'bg-gray-900' : 'bg-gradient-to-br from-slate-100 to-slate-200'}`}>
      <h1 className={`text-xl font-bold ${dark ? 'text-gray-100' : 'text-slate-800'}`}>🖊️ Sketchboard</h1>
      <Toolbar
        tool={tool} setTool={setTool}
        color={color} setColor={setColor}
        size={size} setSize={setSize}
        dark={dark} setDark={setDark}
        boardNames={boardNames}
        actions={{
          undo: () => canvasRef.current.undo(),
          redo: () => canvasRef.current.redo(),
          clear: () => canvasRef.current.clear(),
          download: () => canvasRef.current.download(),
          saveBoard,
          loadBoard,
          newBoard,
        }}
      />
      <div className="flex-1">
        <Canvas ref={canvasRef} tool={tool} color={color} size={size} dark={dark} />
      </div>
    </div>
  );
}

export default App;