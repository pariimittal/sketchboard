import { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';

const Canvas = forwardRef(({ tool, color, size, dark }, ref) => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const isDrawing = useRef(false);
  const [strokes, setStrokes] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const currentStroke = useRef(null);
  const bgColor = dark ? '#1e1e2e' : '#ffffff';
  const shapeTools = ['rect', 'circle', 'line'];

  useEffect(() => {
    const canvas = canvasRef.current;
    const resize = () => {
      const parent = canvas.parentElement;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
      redraw(strokes);
    };
    resize();
    window.addEventListener('resize', resize);
    ctxRef.current = canvas.getContext('2d');
    return () => window.removeEventListener('resize', resize);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    redraw(strokes);
    // eslint-disable-next-line
  }, [dark]);

  const drawStroke = (ctx, stroke) => {
    ctx.beginPath();
    ctx.strokeStyle = stroke.tool === 'eraser' ? bgColor : stroke.color;
    ctx.lineWidth = stroke.size;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (stroke.type === 'shape') {
      const { startX, startY, endX, endY, shapeType } = stroke;
      if (shapeType === 'rect') {
        ctx.strokeRect(startX, startY, endX - startX, endY - startY);
      } else if (shapeType === 'circle') {
        const rx = Math.abs(endX - startX) / 2;
        const ry = Math.abs(endY - startY) / 2;
        const cx = startX + (endX - startX) / 2;
        const cy = startY + (endY - startY) / 2;
        ctx.ellipse(cx, cy, rx, ry, 0, 0, 2 * Math.PI);
        ctx.stroke();
      } else if (shapeType === 'line') {
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
      }
    } else {
      stroke.points.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.stroke();
    }
  };

  const redraw = (strokeList, preview) => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    strokeList.forEach((s) => drawStroke(ctx, s));
    if (preview) drawStroke(ctx, preview);
  };

  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const startDraw = (e) => {
    isDrawing.current = true;
    const pos = getPos(e);
    if (shapeTools.includes(tool)) {
      currentStroke.current = { type: 'shape', shapeType: tool, color, size, startX: pos.x, startY: pos.y, endX: pos.x, endY: pos.y };
    } else {
      currentStroke.current = { type: 'freehand', tool, color, size, points: [pos] };
    }
  };

  const draw = (e) => {
    if (!isDrawing.current) return;
    const pos = getPos(e);
    if (shapeTools.includes(tool)) {
      currentStroke.current.endX = pos.x;
      currentStroke.current.endY = pos.y;
      redraw(strokes, currentStroke.current);
    } else {
      currentStroke.current.points.push(pos);
      redraw(strokes, currentStroke.current);
    }
  };

  const endDraw = () => {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    const updated = [...strokes, currentStroke.current];
    setStrokes(updated);
    setRedoStack([]);
    currentStroke.current = null;
    redraw(updated);
  };

  useImperativeHandle(ref, () => ({
    undo: () => {
      if (strokes.length === 0) return;
      const updated = strokes.slice(0, -1);
      setRedoStack((r) => [strokes[strokes.length - 1], ...r]);
      setStrokes(updated);
      redraw(updated);
    },
    redo: () => {
      if (redoStack.length === 0) return;
      const [next, ...rest] = redoStack;
      const updated = [...strokes, next];
      setStrokes(updated);
      setRedoStack(rest);
      redraw(updated);
    },
    clear: () => {
      setStrokes([]);
      setRedoStack([]);
      redraw([]);
    },
    download: () => {
      const link = document.createElement('a');
      link.download = 'sketchboard.png';
      link.href = canvasRef.current.toDataURL();
      link.click();
    },
    getStrokes: () => strokes,
    loadStrokes: (loaded) => {
      setStrokes(loaded);
      setRedoStack([]);
      redraw(loaded);
    },
  }));

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full rounded-2xl shadow-inner touch-none cursor-crosshair"
      onMouseDown={startDraw}
      onMouseMove={draw}
      onMouseUp={endDraw}
      onMouseLeave={endDraw}
      onTouchStart={startDraw}
      onTouchMove={draw}
      onTouchEnd={endDraw}
    />
  );
});

export default Canvas;