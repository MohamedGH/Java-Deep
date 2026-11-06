import React, { useState } from 'react';
import { useJavaStore } from '../store/useJavaStore';
import { 
  Binary, 
  Play, 
  RotateCcw, 
  Plus, 
  Trash2, 
  Sparkles, 
  ShieldAlert, 
  Cpu, 
  Layers, 
  CheckCircle2, 
  HelpCircle,
  ArrowRight
} from 'lucide-react';

interface BytecodeInstruction {
  id: string;
  offset: number;
  opcode: 'bipush' | 'iload_1' | 'iload_2' | 'istore_1' | 'istore_2' | 'iadd' | 'isub' | 'imul' | 'idiv' | 'iconst_0' | 'iconst_1' | 'nop' | 'ireturn';
  arg?: number;
  comment: { fr: string; en: string };
}

export const BytecodeModifierView: React.FC = () => {
  const { language } = useJavaStore();

  const presets = [
    {
      id: 'math',
      name: { fr: '1. Remplacement d\'Opcode Arithmétique (iadd ➔ imul)', en: '1. Math Opcode Patching (iadd ➔ imul)' },
      instructions: [
        { id: 'op-0', offset: 0, opcode: 'bipush', arg: 10, comment: { fr: 'Empile 10', en: 'Push 10' } },
        { id: 'op-2', offset: 2, opcode: 'bipush', arg: 5, comment: { fr: 'Empile 5', en: 'Push 5' } },
        { id: 'op-4', offset: 4, opcode: 'iadd', comment: { fr: 'Additionne (10 + 5 = 15)', en: 'Add (10 + 5 = 15)' } },
        { id: 'op-5', offset: 5, opcode: 'ireturn', comment: { fr: 'Retourne le résultat', en: 'Return result' } }
      ] as BytecodeInstruction[]
    },
    {
      id: 'security',
      name: { fr: '2. Contournement de Sécurité (iconst_0 ➔ iconst_1)', en: '2. Auth Bypass Patch (iconst_0 ➔ iconst_1)' },
      instructions: [
        { id: 'sec-0', offset: 0, opcode: 'bipush', arg: 42, comment: { fr: 'Vérifie token de session', en: 'Check session token' } },
        { id: 'sec-2', offset: 2, opcode: 'iconst_0', comment: { fr: 'Accès refusé par défaut (false = 0)', en: 'Access denied by default (false = 0)' } },
        { id: 'sec-3', offset: 3, opcode: 'ireturn', comment: { fr: 'Retourne statut d\'autorisation', en: 'Return auth status' } }
      ] as BytecodeInstruction[]
    },
    {
      id: 'agent',
      name: { fr: '3. Instrumentation Java Agent (Multiplicateur x10)', en: '3. Java Agent Transformer (x10 Multiplier)' },
      instructions: [
        { id: 'ag-0', offset: 0, opcode: 'bipush', arg: 7, comment: { fr: 'Entrée valeur brute = 7', en: 'Raw input value = 7' } },
        { id: 'ag-2', offset: 2, opcode: 'bipush', arg: 10, comment: { fr: 'Instruction injectée: multiplicateur', en: 'Injected instruction: factor' } },
        { id: 'ag-4', offset: 4, opcode: 'imul', comment: { fr: 'Instruction injectée: calcul métrique', en: 'Injected instruction: metric' } },
        { id: 'ag-5', offset: 5, opcode: 'ireturn', comment: { fr: 'Retourne la métrique instrumentée', en: 'Return instrumented metric' } }
      ] as BytecodeInstruction[]
    }
  ];

  const [activePresetId, setActivePresetId] = useState<string>('math');
  const [instructions, setInstructions] = useState<BytecodeInstruction[]>(presets[0].instructions);
  const [executionOutput, setExecutionOutput] = useState<{ result: number; history: string[] } | null>(null);

  const availableOpcodes: BytecodeInstruction['opcode'][] = [
    'bipush', 'iload_1', 'iload_2', 'istore_1', 'istore_2',
    'iadd', 'isub', 'imul', 'idiv', 'iconst_0', 'iconst_1', 'nop', 'ireturn'
  ];

  const handleSelectPreset = (presetId: string) => {
    setActivePresetId(presetId);
    const found = presets.find((p) => p.id === presetId);
    if (found) {
      setInstructions(JSON.parse(JSON.stringify(found.instructions)));
      setExecutionOutput(null);
    }
  };

  const updateOpcode = (id: string, newOp: BytecodeInstruction['opcode']) => {
    setInstructions((prev) =>
      prev.map((inst) => (inst.id === id ? { ...inst, opcode: newOp } : inst))
    );
    setExecutionOutput(null);
  };

  const updateArg = (id: string, newArg: number) => {
    setInstructions((prev) =>
      prev.map((inst) => (inst.id === id ? { ...inst, arg: newArg } : inst))
    );
    setExecutionOutput(null);
  };

  const addInstruction = () => {
    const newOffset = instructions.length > 0 ? instructions[instructions.length - 1].offset + 2 : 0;
    const newInst: BytecodeInstruction = {
      id: 'op-' + Date.now(),
      offset: newOffset,
      opcode: 'bipush',
      arg: 2,
      comment: { fr: 'Instruction injectée', en: 'Injected instruction' }
    };
    setInstructions([...instructions, newInst]);
    setExecutionOutput(null);
  };

  const removeInstruction = (id: string) => {
    setInstructions((prev) => prev.filter((i) => i.id !== id));
    setExecutionOutput(null);
  };

  // Pure functional Bytecode Execution Virtual Machine
  const executeModifiedBytecode = () => {
    const stack: number[] = [];
    const locals: Record<number, number> = { 1: 0, 2: 0 };
    const history: string[] = [];

    for (const inst of instructions) {
      if (inst.opcode === 'bipush' && inst.arg !== undefined) {
        stack.push(inst.arg);
        history.push(`[offset ${inst.offset}] bipush ${inst.arg} ➔ Pile d'opérandes: [${stack.join(', ')}]`);
      } else if (inst.opcode === 'iconst_0') {
        stack.push(0);
        history.push(`[offset ${inst.offset}] iconst_0 ➔ Pile d'opérandes: [${stack.join(', ')}]`);
      } else if (inst.opcode === 'iconst_1') {
        stack.push(1);
        history.push(`[offset ${inst.offset}] iconst_1 ➔ Pile d'opérandes: [${stack.join(', ')}]`);
      } else if (inst.opcode === 'istore_1') {
        locals[1] = stack.pop() || 0;
        history.push(`[offset ${inst.offset}] istore_1 ➔ local[1] = ${locals[1]}, Pile: [${stack.join(', ')}]`);
      } else if (inst.opcode === 'istore_2') {
        locals[2] = stack.pop() || 0;
        history.push(`[offset ${inst.offset}] istore_2 ➔ local[2] = ${locals[2]}, Pile: [${stack.join(', ')}]`);
      } else if (inst.opcode === 'iload_1') {
        stack.push(locals[1] || 0);
        history.push(`[offset ${inst.offset}] iload_1 ➔ Chargé ${locals[1]}, Pile: [${stack.join(', ')}]`);
      } else if (inst.opcode === 'iload_2') {
        stack.push(locals[2] || 0);
        history.push(`[offset ${inst.offset}] iload_2 ➔ Chargé ${locals[2]}, Pile: [${stack.join(', ')}]`);
      } else if (inst.opcode === 'iadd') {
        const b = stack.pop() || 0;
        const a = stack.pop() || 0;
        const res = a + b;
        stack.push(res);
        history.push(`[offset ${inst.offset}] iadd (${a} + ${b}) ➔ Résultat empilé: ${res}`);
      } else if (inst.opcode === 'isub') {
        const b = stack.pop() || 0;
        const a = stack.pop() || 0;
        const res = a - b;
        stack.push(res);
        history.push(`[offset ${inst.offset}] isub (${a} - ${b}) ➔ Résultat empilé: ${res}`);
      } else if (inst.opcode === 'imul') {
        const b = stack.pop() || 0;
        const a = stack.pop() || 0;
        const res = a * b;
        stack.push(res);
        history.push(`[offset ${inst.offset}] imul (${a} * ${b}) ➔ Résultat empilé: ${res}`);
      } else if (inst.opcode === 'idiv') {
        const b = stack.pop() || 1;
        const a = stack.pop() || 0;
        const res = Math.floor(a / (b || 1));
        stack.push(res);
        history.push(`[offset ${inst.offset}] idiv (${a} / ${b}) ➔ Résultat empilé: ${res}`);
      } else if (inst.opcode === 'nop') {
        history.push(`[offset ${inst.offset}] nop (No Operation)`);
      } else if (inst.opcode === 'ireturn') {
        const finalVal = stack.pop() || 0;
        history.push(`[offset ${inst.offset}] ireturn ➔ Valeur finale retournée: ${finalVal}`);
        setExecutionOutput({ result: finalVal, history });
        return;
      }
    }

    const fallbackVal = stack.pop() || 0;
    setExecutionOutput({ result: fallbackVal, history });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-900/90 rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-amber-400 font-semibold text-xs uppercase tracking-wider mb-2">
              <Binary className="w-4 h-4" />
              <span>{language === 'fr' ? 'Studio de Modification & Instrumentation de Bytecode' : 'Bytecode Modification & Instrumentation Studio'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              {language === 'fr' ? 'Modifier et Patcher le Bytecode JVM en Direct' : 'Modify and Patch JVM Bytecode Live'}
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              {language === 'fr'
                ? 'Apprenez comment fonctionnent les outils d\'instrumentation comme ByteBuddy, ASM et les Java Agents. Modifiez les opcodes, injectez des instructions et observez l\'impact direct sur la pile d\'opérandes de la JVM.'
                : 'Discover how bytecode engineering tools like ByteBuddy, ASM, and Java Agents work. Patch opcodes live and observe direct operand stack impacts.'}
            </p>
          </div>

          <button
            onClick={executeModifiedBytecode}
            className="flex items-center space-x-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-amber-500/20"
          >
            <Play className="w-4 h-4" />
            <span>{language === 'fr' ? 'Exécuter le Bytecode Modifié' : 'Execute Patched Bytecode'}</span>
          </button>
        </div>
      </div>

      {/* Preset Selector */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-slate-400 font-semibold mr-2">
          {language === 'fr' ? 'Scénarios Prédéfinis :' : 'Patching Scenarios:'}
        </span>
        {presets.map((p) => {
          const active = p.id === activePresetId;
          return (
            <button
              key={p.id}
              onClick={() => handleSelectPreset(p.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                active
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              {p.name[language]}
            </button>
          );
        })}
      </div>

      {/* Main Grid: Bytecode Editor on Left, Execution Trace on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Bytecode Table Editor (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl overflow-hidden flex flex-col justify-between">
          <div>
            <div className="bg-slate-950 px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Binary className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-mono font-bold text-white">
                  {language === 'fr' ? 'Instructions du Flux de Bytecode (.class)' : 'Bytecode Instruction Stream (.class)'}
                </span>
              </div>
              <button
                onClick={addInstruction}
                className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold border border-slate-700 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{language === 'fr' ? 'Injecter Instruction' : 'Inject Opcode'}</span>
              </button>
            </div>

            {/* Instruction Rows */}
            <div className="p-4 space-y-2 max-h-[520px] overflow-y-auto">
              {instructions.map((inst, idx) => (
                <div
                  key={inst.id}
                  className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 font-mono text-xs hover:border-slate-700 transition-all"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-slate-500 font-bold w-6 text-right select-none">{inst.offset}:</span>

                    {/* Opcode Dropdown Selector */}
                    <select
                      value={inst.opcode}
                      onChange={(e) => updateOpcode(inst.id, e.target.value as any)}
                      className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-amber-300 font-bold focus:outline-none focus:border-amber-500"
                    >
                      {availableOpcodes.map((op) => (
                        <option key={op} value={op}>
                          {op}
                        </option>
                      ))}
                    </select>

                    {/* Numeric Argument if applicable */}
                    {['bipush', 'istore_1', 'istore_2', 'iload_1', 'iload_2'].includes(inst.opcode) && (
                      <input
                        type="number"
                        value={inst.arg ?? 0}
                        onChange={(e) => updateArg(inst.id, parseInt(e.target.value) || 0)}
                        className="w-16 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-emerald-400 font-bold text-center focus:outline-none focus:border-amber-500"
                      />
                    )}
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className="text-[11px] text-slate-400 font-sans hidden sm:inline">
                      // {inst.comment[language]}
                    </span>
                    <button
                      onClick={() => removeInstruction(inst.id)}
                      className="p-1 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                      title="Supprimer instruction"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Explanatory Note */}
          <div className="p-4 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>
              💡 {language === 'fr'
                ? 'Essayez de changer `iadd` en `imul` ou d\'éditer la valeur 10 pour voir la machine virtuelle recalculer le résultat.'
                : 'Try altering `iadd` to `imul` or modifying arguments to watch the virtual machine re-evaluate.'}
            </span>
          </div>
        </div>

        {/* Live Execution Trace & VM Operand Stack (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Result Card */}
          <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                <Cpu className="w-4 h-4" />
                <span>{language === 'fr' ? 'Résultat de l\'Exécution JVM' : 'JVM Execution Result'}</span>
              </div>
              <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20 font-bold">
                HotSpot Virtual Machine
              </span>
            </div>

            {executionOutput ? (
              <div className="space-y-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 font-medium">Valeur retournée (`ireturn`):</span>
                    <h3 className="text-3xl font-black text-amber-400 font-mono mt-0.5">
                      {executionOutput.result}
                    </h3>
                  </div>
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 opacity-80" />
                </div>

                {/* Step Trace Log */}
                <div className="space-y-2">
                  <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                    {language === 'fr' ? 'Trace d\'Exécution de la Pile :' : 'Operand Stack Trace:'}
                  </span>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1 font-mono text-[11px] text-slate-300 max-h-56 overflow-y-auto">
                    {executionOutput.history.map((step, idx) => (
                      <div key={idx} className="flex items-start space-x-1.5">
                        <span className="text-amber-500 select-none">►</span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center space-y-2 text-slate-400">
                <Binary className="w-8 h-8 text-amber-400/50 mx-auto animate-pulse" />
                <p className="text-xs">
                  {language === 'fr'
                    ? 'Cliquez sur "Exécuter le Bytecode Modifié" pour tester le comportement de votre bytecode patché.'
                    : 'Click "Execute Patched Bytecode" to test your modified bytecode stream.'}
                </p>
              </div>
            )}
          </div>

          {/* How Bytecode is Modified in Java Card */}
          <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center space-x-2">
              <HelpCircle className="w-4 h-4" />
              <span>{language === 'fr' ? 'Comment modifie-t-on du Bytecode en Production ?' : 'How is Bytecode Modified in Production?'}</span>
            </h4>
            <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
              <p>
                <strong>1. Java Agents (`-javaagent`) :</strong> La JVM permet d'intercepter chaque classe avant qu'elle ne soit chargée dans le Metaspace via l'interface <code>ClassFileTransformer</code>.
              </p>
              <p>
                <strong>2. ByteBuddy & ASM :</strong> Bibliothèques utilisées par Mockito, Spring, New Relic et Datadog pour réécrire dynamiquement les méthodes en RAM sans toucher au code source.
              </p>
              <p>
                <strong>3. Comparaison avec le C :</strong> En C, modifier du code compilé en mémoire nécessite d'écraser des octets en mémoire (`mprotect`, `LD_PRELOAD` ou patching binaire x86), au risque d'un crash direct. En Java, le <em>Bytecode Verifier</em> de la JVM garantit l'intégrité de la pile et des types !
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
