import React, { useState } from 'react';
import { Cpu, Layers, Trash2, RefreshCw, Zap, ArrowRight, ShieldCheck } from 'lucide-react';

interface HeapObject {
  id: string;
  className: string;
  memoryAddress: string;
  state: string;
  isGarbage: boolean;
}

export const JvmVisualizer: React.FC = () => {
  const [stackFrames, setStackFrames] = useState([
    { method: 'main(String[] args)', variables: [{ name: 'x', val: 100 }, { name: 'userRef', val: '@0x7F9A' }] }
  ]);

  const [heapObjects, setHeapObjects] = useState<HeapObject[]>([
    { id: 'obj-1', className: 'UserAccount', memoryAddress: '@0x7F9A', state: 'name="Alice", active=true', isGarbage: false },
    { id: 'obj-2', className: 'String', memoryAddress: '@0x4B2C', state: 'value="Old Session Data"', isGarbage: true },
    { id: 'obj-3', className: 'ArrayList', memoryAddress: '@0x9E10', state: 'size=5, capacity=10', isGarbage: false }
  ]);

  const [gcRunning, setGcRunning] = useState(false);
  const [logMessage, setLogMessage] = useState('JVM Runtime Initialized. Stack and Heap active.');

  const allocateObject = () => {
    const randomId = Math.floor(Math.random() * 9000) + 1000;
    const addr = `@0x${randomId.toString(16).toUpperCase()}`;
    const classes = ['OrderRecord', 'DatabaseConnection', 'CustomerProfile', 'ProductItem'];
    const randomClass = classes[Math.floor(Math.random() * classes.length)];

    const newObj: HeapObject = {
      id: 'obj-' + Date.now(),
      className: randomClass,
      memoryAddress: addr,
      state: 'status="Initialized", timestamp=' + Date.now().toString().slice(-4),
      isGarbage: Math.random() > 0.6
    };

    setHeapObjects([...heapObjects, newObj]);

    // Add stack frame variable pointing to it if not garbage
    if (!newObj.isGarbage) {
      setStackFrames((prev) => {
        const updated = [...prev];
        updated[0].variables.push({ name: randomClass.toLowerCase() + 'Ref', val: addr });
        return updated;
      });
    }

    setLogMessage(`Allocated new object [${randomClass}] on Heap at ${addr}.`);
  };

  const runGarbageCollection = () => {
    setGcRunning(true);
    setLogMessage('System.gc() invoked. Garbage Collector scanning Heap for unreferenced objects...');

    setTimeout(() => {
      const cleaned = heapObjects.filter((obj) => !obj.isGarbage);
      setHeapObjects(cleaned);
      setGcRunning(false);
      setLogMessage('Garbage Collection completed. Unreferenced objects swept from Heap, memory compacted.');
    }, 1200);
  };

  const resetVisualizer = () => {
    setStackFrames([
      { method: 'main(String[] args)', variables: [{ name: 'x', val: 100 }, { name: 'userRef', val: '@0x7F9A' }] }
    ]);
    setHeapObjects([
      { id: 'obj-1', className: 'UserAccount', memoryAddress: '@0x7F9A', state: 'name="Alice", active=true', isGarbage: false },
      { id: 'obj-2', className: 'String', memoryAddress: '@0x4B2C', state: 'value="Old Session Data"', isGarbage: true },
      { id: 'obj-3', className: 'ArrayList', memoryAddress: '@0x9E10', state: 'size=5, capacity=10', isGarbage: false }
    ]);
    setLogMessage('JVM visualizer reset to default state.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-slate-900/90 rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-amber-400 font-semibold text-xs uppercase tracking-wider mb-2">
              <Cpu className="w-4 h-4" />
              <span>Interactive JVM Simulator</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">Stack vs. Heap Memory Explorer</h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Simulate Java object allocation, pointer references between Stack frames and Heap instances, and Garbage Collection cycles in real time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={allocateObject}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-amber-500/20"
            >
              <Zap className="w-4 h-4" />
              <span>New Object (Heap)</span>
            </button>

            <button
              onClick={runGarbageCollection}
              disabled={gcRunning}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50"
            >
              <Trash2 className={`w-4 h-4 ${gcRunning ? 'animate-bounce' : ''}`} />
              <span>{gcRunning ? 'GC Running...' : 'Run GC (Sweep)'}</span>
            </button>

            <button
              onClick={resetVisualizer}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all"
              title="Reset Simulator"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Runtime Log Bar */}
      <div className="bg-slate-950 px-5 py-3 rounded-xl border border-slate-800 text-xs font-mono text-amber-300 flex items-center space-x-3 shadow-inner">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
        <span><strong>JVM Runtime Log:</strong> {logMessage}</span>
      </div>

      {/* Visualizer Grid: Stack vs Heap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Thread Stack Column */}
        <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
              <Layers className="w-5 h-5" />
              <span>Thread Stack (LIFO Frames & Primitives)</span>
            </div>
            <span className="text-xs bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/20">
              Fast LIFO
            </span>
          </div>

          <p className="text-xs text-slate-400">
            Stores method execution frames, local primitive variables (int, boolean), and memory addresses (pointers) pointing to Heap objects.
          </p>

          <div className="space-y-3">
            {stackFrames.map((frame, idx) => (
              <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800 shadow-md space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-amber-300 font-bold">
                  <span>Frame: {frame.method}</span>
                  <span className="text-slate-500">Active Execution</span>
                </div>
                <div className="space-y-1.5 font-mono text-xs">
                  {frame.variables.map((v, vIdx) => (
                    <div key={vIdx} className="bg-slate-900 px-3 py-2 rounded-lg flex items-center justify-between border border-slate-800">
                      <span className="text-slate-300">{v.name}</span>
                      <span className="text-orange-400 font-bold">{v.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Heap Column */}
        <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
              <Cpu className="w-5 h-5" />
              <span>Heap Memory (Dynamic Object Instances)</span>
            </div>
            <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">
              GC Managed
            </span>
          </div>

          <p className="text-xs text-slate-400">
            All objects created with <code className="text-amber-300">new</code> live here. Unreferenced objects become eligible for Garbage Collection.
          </p>

          <div className="space-y-3">
            {heapObjects.map((obj) => (
              <div
                key={obj.id}
                className={`p-4 rounded-xl border transition-all space-y-2 ${
                  obj.isGarbage
                    ? 'bg-red-950/20 border-red-500/40 opacity-75'
                    : 'bg-slate-950 border-slate-800 shadow-md'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-white flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>{obj.className}</span>
                  </span>
                  <span className="text-amber-400 font-bold">{obj.memoryAddress}</span>
                </div>

                <div className="bg-slate-900 px-3 py-1.5 rounded-lg font-mono text-xs text-slate-300 border border-slate-800">
                  {obj.state}
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    obj.isGarbage ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    {obj.isGarbage ? '⚠️ Unreferenced (Garbage)' : '🟢 Active Reference'}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">Heap Instance</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
