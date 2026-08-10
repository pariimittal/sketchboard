const COLORS = ['#000000', '#ef4444', '#3b82f6', '#22c55e', '#eab308', '#a855f7', '#ffffff'];

export default function Toolbar({ tool, setTool, color, setColor, size, setSize, dark, setDark, actions, boardNames, user, onLogin, onLogout }) {
  const wrap = dark ? 'bg-gray-800/90 border-gray-700 text-gray-100' : 'bg-white/90 border-gray-200 text-gray-800';
  const btn = (active) =>
    `px-3 py-1.5 rounded-lg text-sm font-medium transition whitespace-nowrap ${
      active ? 'bg-black text-white' : dark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
    }`;
  const divider = <div className={`w-px h-6 mx-1 ${dark ? 'bg-gray-600' : 'bg-gray-300'}`} />;

  return (
    <div className={`backdrop-blur-md shadow-lg rounded-2xl px-4 py-3 border ${wrap} space-y-3`}>
      {/* Row 1: drawing tools + color + size */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase opacity-50 mr-1">Tools</span>
        <button onClick={() => setTool('pen')} className={btn(tool === 'pen')}>✏️ Pen</button>
        <button onClick={() => setTool('eraser')} className={btn(tool === 'eraser')}>🧼 Eraser</button>
        <button onClick={() => setTool('line')} className={btn(tool === 'line')}>／ Line</button>
        <button onClick={() => setTool('rect')} className={btn(tool === 'rect')}>▭ Rect</button>
        <button onClick={() => setTool('circle')} className={btn(tool === 'circle')}>◯ Circle</button>

        {divider}

        <span className="text-xs font-semibold uppercase opacity-50 mr-1">Color</span>
        <div className="flex gap-1.5">
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              style={{ backgroundColor: c }}
              className={`w-6 h-6 rounded-full border-2 ${color === c ? 'border-blue-500 scale-110' : 'border-gray-300'} transition`}
            />
          ))}
        </div>

        {divider}

        <span className="text-xs font-semibold uppercase opacity-50 mr-1">Size</span>
        <input type="range" min="2" max="30" value={size} onChange={(e) => setSize(Number(e.target.value))} className="w-24" />
      </div>

      {/* Row 2: history + files + account */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase opacity-50 mr-1">Edit</span>
        <button onClick={actions.undo} className={btn(false)}>↶ Undo</button>
        <button onClick={actions.redo} className={btn(false)}>↷ Redo</button>
        <button onClick={actions.clear} className={btn(false)}>🗑️ Clear</button>
        <button onClick={actions.download} className={btn(false)}>⬇ PNG</button>

        {divider}

        <span className="text-xs font-semibold uppercase opacity-50 mr-1">Board</span>
        <button onClick={actions.saveBoard} className={btn(false)}>💾 Save</button>
        <select
          onChange={(e) => e.target.value && actions.loadBoard(e.target.value)}
          defaultValue=""
          className={`text-sm rounded-lg px-2 py-1.5 border ${dark ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'}`}
        >
          <option value="">📂 Load...</option>
          {boardNames.map((name) => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
        <button onClick={actions.newBoard} className={btn(false)}>🆕 New</button>

        <div className="flex-1" />

        <button onClick={() => setDark(!dark)} className={btn(false)}>{dark ? '☀️' : '🌙'}</button>

        {divider}

        {user ? (
          <div className="flex items-center gap-2">
            <img src={user.photoURL} alt="" className="w-7 h-7 rounded-full" />
            <span className="text-sm hidden sm:inline">{user.displayName?.split(' ')[0]}</span>
            <button onClick={onLogout} className={btn(false)}>Logout</button>
          </div>
        ) : (
          <button onClick={onLogin} className={btn(false)}>🔑 Sign in with Google</button>
        )}
      </div>
    </div>
  );
}