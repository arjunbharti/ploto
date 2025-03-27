import Whiteboard from './components/Whiteboard';
import Toolbar from './components/Toolbar';
import './App.css';

function App() {
  return (
    <div className="overflow-hidden relative">
      <Whiteboard />
      <Toolbar />
    </div>
  );
}

export default App;
