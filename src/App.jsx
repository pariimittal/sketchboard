import { useRef, useState, useEffect } from 'react';
import Canvas from './components/Canvas';
import Toolbar from './components/Toolbar';
import { auth, db, provider, signInWithRedirect, getRedirectResult, signOut, onAuthStateChanged, doc, setDoc, getDoc, collection, getDocs } from './firebase';

const STORAGE_PREFIX = 'sketchboard_';

function App() {
  const [tool, setTool] = useState('pen');
  const [color, setColor] = useState('#000000');
  const [size, setSize] = useState(4);
  const [dark, setDark] = useState(false);
  const [boardNames, setBoardNames] = useState([]);
  const [user, setUser] = useState(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => console.log('Redirect result:', result))
      .catch((err) => console.error('Redirect login error:', err));
    const unsub = onAuthStateChanged(auth, (u) => {
      console.log('Auth state changed, user is:', u);
      setUser(u);
      refreshBoardNames(u);
    });
    return unsub;
  }, []);

  const refreshBoardNames = async (u) => {
    if (u) {
      const snap = await getDocs(collection(db, 'users', u.uid, 'boards'));
      setBoardNames(snap.docs.map((d) => d.id));
    } else {
      const names = Object.keys(localStorage)
        .filter((k) => k.startsWith(STORAGE_PREFIX))
        .map((k) => k.replace(STORAGE_PREFIX, ''));
      setBoardNames(names);
    }
  };

  const onLogin = async () => {
    console.log('Login button clicked');
    try {
      await signInWithRedirect(auth, provider);
    } catch (err) {
      console.error('Login error:', err);
      alert('Login error: ' + err.message);
    }
  };

  const onLogout = async () => {
    await signOut(auth);
  };

  const saveBoard = async () => {
    const name = window.prompt('Name this board:');
    if (!name) return;
    const strokes = canvasRef.current.getStrokes();
    if (user) {
      await setDoc(doc(db, 'users', user.uid, 'boards', name), { strokes: JSON.stringify(strokes) });
    } else {
      localStorage.setItem(STORAGE_PREFIX + name, JSON.stringify(strokes));
    }
    refreshBoardNames(user);
    alert(`Saved as "${name}"${user ? ' to your account' : ' (guest, this browser only)'}`);
  };

  const loadBoard = async (name) => {
    let data;
    if (user) {
      const snap = await getDoc(doc(db, 'users', user.uid, 'boards', name));
      data = snap.exists() ? snap.data().strokes : null;
    } else {
      data = localStorage.getItem(STORAGE_PREFIX + name);
    }
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
        user={user}
        onLogin={onLogin}
        onLogout={onLogout}
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