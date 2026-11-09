import React, { useState } from 'react';
import { useJavaStore } from '../store/useJavaStore';
import { 
  FileCode, 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  ShieldCheck, 
  Box, 
  RefreshCw, 
  Sparkles, 
  Code2, 
  Play, 
  Info,
  Sliders,
  Terminal,
  Activity,
  Award,
  Cpu,
  Lock,
  Database,
  GitBranch
} from 'lucide-react';

export const DomainModelsView: React.FC = () => {
  const { language, addError } = useJavaStore();
  const [activeTab, setActiveTab] = useState<'record' | 'anemic' | 'enum'>('record');

  // Record Simulator state
  const [recordAmount, setRecordAmount] = useState<number>(150);
  const [recordIban, setRecordIban] = useState<string>('FR7630001007941234567890185');
  const [compactValidationResult, setCompactValidationResult] = useState<{ success: boolean; message: string } | null>(null);

  // Record Pattern Matching Simulator state (Java 21 JEP 440)
  const [selectedShape, setSelectedShape] = useState<'circle' | 'rectangle' | 'point'>('circle');
  const [shapeParamA, setShapeParamA] = useState<number>(5);
  const [shapeParamB, setShapeParamB] = useState<number>(10);

  // Anemic vs Rich Simulator state
  const [orderStatus, setOrderStatus] = useState<'PENDING' | 'PAID' | 'SHIPPED' | 'CANCELLED'>('PENDING');
  const [orderItemsCount, setOrderItemsCount] = useState<number>(2);
  const [anemicLogs, setAnemicLogs] = useState<string[]>(['Order initialized with status PENDING']);
  const [richLogs, setRichLogs] = useState<string[]>(['Rich Order aggregate initialized: invariants valid']);

  // Enum Simulator state
  const [selectedEnumOp, setSelectedEnumOp] = useState<'PLUS' | 'MINUS' | 'MULTIPLY' | 'DIVIDE'>('PLUS');
  const [enumValA, setEnumValA] = useState<number>(12);
  const [enumValB, setEnumValB] = useState<number>(4);

  // EnumSet Bitmask Simulator state (Hardware-accelerated bitmask)
  const [enumSetBits, setEnumSetBits] = useState<{
    READ: boolean;
    WRITE: boolean;
    EXECUTE: boolean;
    ADMIN: boolean;
    AUDIT: boolean;
  }>({
    READ: true,
    WRITE: true,
    EXECUTE: false,
    ADMIN: false,
    AUDIT: false
  });

  // Test compact constructor on Record
  const handleValidateRecord = () => {
    if (!recordIban || recordIban.trim().length < 15) {
      const err = language === 'fr' 
        ? "IllegalArgumentException: Format IBAN invalide (< 15 caractères) rejeté par le Compact Constructor !" 
        : "IllegalArgumentException: Invalid IBAN format (< 15 chars) rejected by Compact Constructor!";
      setCompactValidationResult({ success: false, message: err });
      addError(err);
      return;
    }
    if (recordAmount <= 0) {
      const err = language === 'fr'
        ? "IllegalArgumentException: Le montant du virement doit être strictement positif (> 0 €) !"
        : "IllegalArgumentException: Transfer amount must be strictly positive (> 0 €)!";
      setCompactValidationResult({ success: false, message: err });
      addError(err);
      return;
    }
    setCompactValidationResult({
      success: true,
      message: language === 'fr'
        ? `TransferRecord créé avec succès sur le Tas : TransferRecord[iban=${recordIban.substring(0, 8)}..., amount=${recordAmount}€]`
        : `TransferRecord successfully instantiated on Heap: TransferRecord[iban=${recordIban.substring(0, 8)}..., amount=${recordAmount}€]`
    });
  };

  // Anemic action simulation (allows illegal state corruption)
  const handleAnemicAction = (action: 'FORCE_CANCEL_SHIPPED' | 'MODIFY_ITEMS_AFTER_PAYMENT') => {
    if (action === 'FORCE_CANCEL_SHIPPED') {
      // In anemic model, any external service can do order.setStatus("CANCELLED") even if already shipped!
      setOrderStatus('CANCELLED');
      const msg = language === 'fr'
        ? "⚠️ ANÉMIQUE: order.setStatus(CANCELLED) exécuté sans contrôle ! Une commande EXPÉDIÉE a été annulée de l'extérieur. INVARIANT CORROMPU !"
        : "⚠️ ANEMIC: order.setStatus(CANCELLED) succeeded without checks! Shipped order was cancelled from outside. INVARIANT BROKEN!";
      setAnemicLogs((prev) => [msg, ...prev.slice(0, 4)]);
      addError(msg);
    } else {
      setOrderItemsCount((prev) => prev + 1);
      const msg = language === 'fr'
        ? "⚠️ ANÉMIQUE: order.getItems().add(new Item()) exécuté après paiement ! Le montant payé ne correspond plus aux articles !"
        : "⚠️ ANEMIC: order.getItems().add(new Item()) called after payment! Items count changed without recomputing total!";
      setAnemicLogs((prev) => [msg, ...prev.slice(0, 4)]);
      addError(msg);
    }
  };

  // Rich action simulation (enforces invariants)
  const handleRichAction = (action: 'PAY' | 'SHIP' | 'CANCEL') => {
    if (action === 'PAY') {
      if (orderStatus !== 'PENDING') {
        const msg = language === 'fr'
          ? "❌ RICHE: IllegalStateException: Impossible de payer une commande déjà traitée ou annulée !"
          : "❌ RICH: IllegalStateException: Cannot pay an order that is not in PENDING state!";
        setRichLogs((prev) => [msg, ...prev.slice(0, 4)]);
        addError(msg);
        return;
      }
      setOrderStatus('PAID');
      const msg = language === 'fr'
        ? "✅ RICHE: order.pay(paymentReceipt) exécuté. Statut passé à PAID en toute sécurité."
        : "✅ RICH: order.pay(paymentReceipt) executed. State cleanly moved to PAID.";
      setRichLogs((prev) => [msg, ...prev.slice(0, 4)]);
    } else if (action === 'SHIP') {
      if (orderStatus !== 'PAID') {
        const msg = language === 'fr'
          ? "❌ RICHE: IllegalStateException: Impossible d'expédier une commande non payée !"
          : "❌ RICH: IllegalStateException: Cannot ship an unpaid order!";
        setRichLogs((prev) => [msg, ...prev.slice(0, 4)]);
        addError(msg);
        return;
      }
      setOrderStatus('SHIPPED');
      const msg = language === 'fr'
        ? "✅ RICHE: order.ship(trackingNumber) exécuté. Statut passé à SHIPPED."
        : "✅ RICH: order.ship(trackingNumber) executed. State transitioned to SHIPPED.";
      setRichLogs((prev) => [msg, ...prev.slice(0, 4)]);
    } else if (action === 'CANCEL') {
      if (orderStatus === 'SHIPPED') {
        const msg = language === 'fr'
          ? "❌ RICHE: OrderCancellationException: Impossible d'annuler une commande déjà remise au transporteur (SHIPPED) !"
          : "❌ RICH: OrderCancellationException: Cannot cancel an order that has already shipped!";
        setRichLogs((prev) => [msg, ...prev.slice(0, 4)]);
        addError(msg);
        return;
      }
      setOrderStatus('CANCELLED');
      const msg = language === 'fr'
        ? "✅ RICHE: order.cancel(\"Client request\") exécuté. Invariant préservé."
        : "✅ RICH: order.cancel(\"Client request\") executed. Invariant preserved.";
      setRichLogs((prev) => [msg, ...prev.slice(0, 4)]);
    }
  };

  // Enum Operation calculation
  const computeEnumResult = () => {
    switch (selectedEnumOp) {
      case 'PLUS': return enumValA + enumValB;
      case 'MINUS': return enumValA - enumValB;
      case 'MULTIPLY': return enumValA * enumValB;
      case 'DIVIDE': return enumValB !== 0 ? Math.round((enumValA / enumValB) * 100) / 100 : 'Division by zero!';
    }
  };

  // Record Pattern Matching resolution (Java 21 JEP 440)
  const computePatternResult = () => {
    switch (selectedShape) {
      case 'circle': {
        const area = Math.PI * shapeParamA * shapeParamA;
        return {
          deconstructed: `Circle(radius: ${shapeParamA})`,
          result: `Aire = ${Math.round(area * 100) / 100} cm²`,
          bytecodeInstruction: 'instanceof Circle(double r)'
        };
      }
      case 'rectangle': {
        const area = shapeParamA * shapeParamB;
        return {
          deconstructed: `Rectangle(width: ${shapeParamA}, height: ${shapeParamB})`,
          result: `Aire = ${area} cm²`,
          bytecodeInstruction: 'instanceof Rectangle(double w, double h)'
        };
      }
      case 'point': {
        const dist = Math.sqrt(shapeParamA * shapeParamA + shapeParamB * shapeParamB);
        return {
          deconstructed: `Point(x: ${shapeParamA}, y: ${shapeParamB})`,
          result: `Distance à l'origine (0,0) = ${Math.round(dist * 100) / 100}`,
          bytecodeInstruction: 'instanceof Point(int x, int y)'
        };
      }
    }
  };

  // EnumSet Bitmask computation (Hardware-accelerated CPU register bitfield)
  const computeEnumSetBitmask = () => {
    let mask = 0;
    if (enumSetBits.READ) mask |= (1 << 0);
    if (enumSetBits.WRITE) mask |= (1 << 1);
    if (enumSetBits.EXECUTE) mask |= (1 << 2);
    if (enumSetBits.ADMIN) mask |= (1 << 3);
    if (enumSetBits.AUDIT) mask |= (1 << 4);
    return {
      maskValue: mask,
      binaryString: mask.toString(2).padStart(8, '0'),
      activeCount: [enumSetBits.READ, enumSetBits.WRITE, enumSetBits.EXECUTE, enumSetBits.ADMIN, enumSetBits.AUDIT].filter(Boolean).length
    };
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-900/40 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-mono uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Java 16+ Records • DDD Architecture • Java 5+ Enums</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {language === 'fr' 
                ? 'Record, Modèle de Domaine Anémique & Enum' 
                : 'Record, Anemic Domain Model & Enum'}
            </h1>
            <p className="mt-2 text-sm text-slate-400 max-w-3xl leading-relaxed">
              {language === 'fr'
                ? 'Explorez la différence physique en mémoire, au niveau du compilateur et de l\'architecture objet entre les Records immuables (Java 16), l\'anti-pattern du Modèle de Domaine Anémique (Fowler) versus le Modèle Riche, et la puissance des Enums Java (bien au-delà des simples entiers du C).'
                : 'Explore the memory, bytecode, and architectural differences between immutable Java Records (Java 16), Martin Fowler\'s Anemic Domain Model anti-pattern vs Rich DDD aggregates, and the JVM power of Java Enums (far beyond basic C integer constants).'}
            </p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-indigo-900/30">
          <button
            onClick={() => setActiveTab('record')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'record'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 border border-indigo-400/30'
                : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/50'
            }`}
          >
            <Box className="w-4 h-4" />
            <span>{language === 'fr' ? '1. Java Record (Immutabilité)' : '1. Java Record (Immutability)'}</span>
          </button>
          <button
            onClick={() => setActiveTab('anemic')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'anemic'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30 border border-amber-400/30'
                : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/50'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>{language === 'fr' ? '2. Modèle Anémique vs Modèle Riche' : '2. Anemic vs Rich Domain Model'}</span>
          </button>
          <button
            onClick={() => setActiveTab('enum')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'enum'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 border border-emerald-400/30'
                : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/50'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{language === 'fr' ? '3. Enum Java (Au-delà du C)' : '3. Java Enum (Beyond C)'}</span>
          </button>
        </div>
      </div>

      {/* TAB 1: RECORD */}
      {activeTab === 'record' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Comparison Cards: JavaBean vs Record */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* JavaBean Boilerplate */}
            <div className="bg-slate-900/90 border border-rose-900/30 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono uppercase px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30">
                  JavaBean Traditionnel (Java 1.1 - 15)
                </span>
                <span className="text-xs text-slate-400 font-mono">~50+ lignes de code</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Classe Mutable avec Getters / Setters</h3>
              <p className="text-xs text-slate-400 mb-4">
                {language === 'fr'
                  ? 'Nécessite du code verbeux pour equals(), hashCode(), toString(), constructeurs et getters. Risque élevé de mutation accidentelle des champs.'
                  : 'Requires verbose boilerplate for equals(), hashCode(), toString(), getters, and setters. Prone to accidental mutation.'}
              </p>
              <div className="bg-slate-950 p-3 rounded-xl font-mono text-xs text-slate-300 border border-slate-800 overflow-x-auto max-h-64">
                <pre>{`public final class Point {
    private final int x;
    private final int y;

    public Point(int x, int y) {
        this.x = x;
        this.y = y;
    }
    public int getX() { return x; }
    public int getY() { return y; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Point p)) return false;
        return x == p.x && y == p.y;
    }
    @Override
    public int hashCode() {
        return Objects.hash(x, y);
    }
    @Override
    public String toString() {
        return "Point[x=" + x + ", y=" + y + "]";
    }
}`}</pre>
              </div>
            </div>

            {/* Java Record */}
            <div className="bg-slate-900/90 border border-indigo-900/40 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono uppercase px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                  Java 16+ Record
                </span>
                <span className="text-xs text-emerald-400 font-mono">1 seule ligne !</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Transporteur de Données Immuable & Nominal</h3>
              <p className="text-xs text-slate-400 mb-4">
                {language === 'fr'
                  ? 'Le compilateur génère automatiquement : champs private final, constructeur canonique, accesseurs x() et y() (sans préfixe get), equals(), hashCode() et toString().'
                  : 'Compiler automatically generates: private final fields, canonical constructor, accessors x() and y() (no "get" prefix), equals(), hashCode(), and toString().'}
              </p>
              <div className="bg-slate-950 p-3 rounded-xl font-mono text-xs text-indigo-300 border border-indigo-900/40 overflow-x-auto max-h-64">
                <pre>{`// Déclaration complète en 1 seule ligne !
public record Point(int x, int y) {}

// Utilisation :
Point p = new Point(10, 20);
int x = p.x(); // Pas getX(), mais x() !
System.out.println(p); // Point[x=10, y=20]
Point p2 = new Point(10, 20);
boolean eq = p.equals(p2); // true (valeur pure !)`}</pre>
              </div>
            </div>
          </div>

          {/* Interactive Compact Constructor Sandbox */}
          <div className="bg-slate-900/90 border border-indigo-900/30 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  {language === 'fr' ? 'Atelier Interactif : Compact Constructor & Validation' : 'Interactive Lab: Compact Constructor & Validation'}
                </h3>
                <p className="text-xs text-slate-400">
                  {language === 'fr'
                    ? 'Un Record supporte un constructeur compact sans liste de paramètres redondante pour valider et normaliser les invariants avant assignation.'
                    : 'A Record supports a compact constructor without redundant parameter lists to validate invariants prior to field assignment.'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Code viewer */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-300">
                <div className="text-indigo-400 mb-2">// TransferRecord avec Constructeur Compact</div>
                <pre>{`public record TransferRecord(String iban, double amount) {
    // Constructeur compact : pas de (String iban, double amount) !
    public TransferRecord {
        if (iban == null || iban.trim().length() < 15) {
            throw new IllegalArgumentException("IBAN invalide");
        }
        if (amount <= 0.0) {
            throw new IllegalArgumentException("Montant doit être > 0");
        }
        // Normalisation automatique avant écriture dans les champs
        iban = iban.replaceAll("\\s+", "").toUpperCase();
        // L'assignation this.iban = iban est faite implicitement par javac !
    }
}`}</pre>
              </div>

              {/* Interactive form */}
              <div className="space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      {language === 'fr' ? 'Compte IBAN du bénéficiaire :' : 'Recipient IBAN Account:'}
                    </label>
                    <input
                      type="text"
                      value={recordIban}
                      onChange={(e) => setRecordIban(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
                      placeholder="FR763000..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      {language === 'fr' ? 'Montant du virement (€) :' : 'Transfer Amount (€):'}
                    </label>
                    <input
                      type="number"
                      value={recordAmount}
                      onChange={(e) => setRecordAmount(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={handleValidateRecord}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-md shadow-indigo-600/30"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>{language === 'fr' ? 'Instancier new TransferRecord()' : 'Instantiate new TransferRecord()'}</span>
                  </button>

                  {compactValidationResult && (
                    <div
                      className={`p-3 rounded-xl border text-xs font-mono ${
                        compactValidationResult.success
                          ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
                          : 'bg-rose-950/40 border-rose-800/60 text-rose-300'
                      }`}
                    >
                      {compactValidationResult.message}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Deep vs Shallow Immutability Warning */}
          <div className="bg-amber-950/20 border border-amber-800/40 rounded-2xl p-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-amber-300">
                  {language === 'fr' 
                    ? 'Attention : Les Records sont immuables en surface (Shallow Immutability) !' 
                    : 'Warning: Java Records are only Shallowly Immutable!'}
                </h4>
                <p className="mt-1 text-xs text-amber-200/80 leading-relaxed">
                  {language === 'fr'
                    ? "Si un record contient une collection mutable comme 'List<String> items', la référence de la liste ne peut pas être réassignée (final), MAIS les éléments à l'intérieur de la liste peuvent être modifiés (items.add(\"hack\")) ! Pour garantir une immutabilité totale (Deep Immutability), effectuez une copie défensive dans le constructeur compact : 'items = List.copyOf(items);'."
                    : "If a record component holds a mutable collection like 'List<String> items', the pointer reference is final, BUT the contents inside the list can still be mutated (items.add(\"hack\"))! To achieve Deep Immutability, apply a defensive copy in the compact constructor: 'items = List.copyOf(items);'."}
                </p>
              </div>
            </div>
          </div>

          {/* Bytecode & ClassFile Internals of Records */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-base font-bold text-white mb-3 flex items-center space-x-2">
              <Terminal className="w-4 h-4 text-indigo-400" />
              <span>{language === 'fr' ? 'Sous le capot JVM : L\'attribut Record dans le fichier .class' : 'JVM Under the Hood: The Record ClassFile Attribute'}</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              {language === 'fr'
                ? 'Contrairement à une simple classe générée par Lombok (@Value), Java 16 a introduit un attribut standardisé au niveau du format de fichier binaire .class (Major Version 60) : l\'attribut Record avec sa table RecordComponent_info. Cela permet à l\'API Reflection (Class.isRecord()) et aux frameworks de sérialisation (Jackson, JSON) d\'inspecter directement les composants sans heuristique.'
                : 'Unlike Lombok bytecode generators, Java 16 introduced an official ClassFile attribute in the JVM specification (Major version 60): the Record attribute with RecordComponent_info. This allows JVM reflection (Class.isRecord()) and serializers to access record components natively.'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
                <div className="font-mono text-indigo-400 font-bold mb-1">Superclasse fixe</div>
                <div className="text-slate-300">Hérite obligatoirement et exclusivement de <code className="text-amber-300">java.lang.Record</code>. Ne peut pas faire <code className="text-rose-400">extends AutreClasse</code>.</div>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
                <div className="font-mono text-indigo-400 font-bold mb-1">Classe implicitement finale</div>
                <div className="text-slate-300">Tous les records sont <code className="text-amber-300">final</code>. Aucune classe fille ne peut étendre un record, interdisant toute altération de contrat.</div>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
                <div className="font-mono text-indigo-400 font-bold mb-1">invokedynamic (Indy)</div>
                <div className="text-slate-300">equals(), hashCode() et toString() sont résolus dynamiquement via le bootstrap <code className="text-amber-300">ObjectMethods.bootstrap</code> pour des performances JIT optimales.</div>
              </div>
            </div>
          </div>

          {/* Record Pattern Matching & Deconstruction Lab (Java 21 JEP 440) */}
          <div className="bg-slate-900/90 border border-indigo-900/30 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                <GitBranch className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-bold text-white">
                    {language === 'fr' ? 'Pattern Matching & Déconstruction de Records (Java 21 JEP 440)' : 'Record Pattern Matching & Deconstruction (Java 21 JEP 440)'}
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    Java 21 LTS
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  {language === 'fr'
                    ? 'Décomposez un objet record et extrayez directement ses composants typés en une seule expression instanceof ou switch !'
                    : 'Deconstruct a record instance and extract its typed components directly in a single instanceof or switch expression!'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Controls */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    {language === 'fr' ? '1. Sélectionner le Record Shape :' : '1. Select Shape Record:'}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['circle', 'rectangle', 'point'] as const).map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedShape(s)}
                        className={`py-2 px-3 rounded-xl text-xs font-mono font-bold capitalize transition-all ${
                          selectedShape === s
                            ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30 border border-purple-400'
                            : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      {selectedShape === 'circle' ? 'Rayon (r) :' : selectedShape === 'rectangle' ? 'Largeur (w) :' : 'Abscisse (x) :'}
                    </label>
                    <input
                      type="number"
                      value={shapeParamA}
                      onChange={(e) => setShapeParamA(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  {selectedShape !== 'circle' && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        {selectedShape === 'rectangle' ? 'Hauteur (h) :' : 'Ordonnée (y) :'}
                      </label>
                      <input
                        type="number"
                        value={shapeParamB}
                        onChange={(e) => setShapeParamB(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  )}
                </div>

                {/* Live Deconstructed Output */}
                <div className="p-4 rounded-xl bg-slate-950 border border-purple-900/40 text-xs font-mono space-y-2">
                  <div className="text-purple-400 font-bold flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Déconstruction en mémoire :</span>
                  </div>
                  <div className="text-slate-200">
                    Composants extraits : <span className="text-amber-300 font-bold">{computePatternResult().deconstructed}</span>
                  </div>
                  <div className="text-emerald-400 font-bold text-sm">
                    {computePatternResult().result}
                  </div>
                </div>
              </div>

              {/* Code viewer */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto">
                <div className="text-purple-400 font-bold mb-2">// Switch Pattern Matching (JEP 440)</div>
                <pre>{`// Déclaration des records
public sealed interface Shape permits Circle, Rectangle, Point {}
public record Circle(double radius) implements Shape {}
public record Rectangle(double width, double height) implements Shape {}
public record Point(int x, int y) implements Shape {}

// Switch avec déconstruction directe des composants :
public String describe(Shape shape) {
    return switch (shape) {
        case Circle(double r) -> 
            "Cercle de rayon " + r + " (Aire = " + (Math.PI * r * r) + ")";
        case Rectangle(double w, double h) when w == h -> 
            "Carré parfait de côté " + w;
        case Rectangle(double w, double h) -> 
            "Rectangle " + w + "x" + h + " (Aire = " + (w * h) + ")";
        case Point(int x, int y) -> 
            "Point aux coordonnées (" + x + ", " + y + ")";
    };
}`}</pre>
              </div>
            </div>
          </div>

          {/* Masterclass: Serialization Security & CVE Immunity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center space-x-2 text-rose-400 mb-2">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <h4 className="font-bold text-white">Pourquoi la sérialisation classique est vulnérable (CVEs)</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mb-3">
                {language === 'fr'
                  ? 'En Java classique, la désérialisation d\'un objet (Serializable) n\'appelle AUCUN constructeur ! Elle alloue un bloc mémoire brut et injecte directement les champs par réflexion (ou via le mécanisme interne de sun.misc.Unsafe). Des attaquants peuvent ainsi fabriquer des flux binaires corrompus qui contournent toutes les validations de vos constructeurs, menant aux fameuses attaques par Gadget Chains (ex: failles Log4Shell, Apache Commons Collections).'
                  : 'In classic Java, deserialization invokes NO constructor! It allocates raw heap memory and writes fields reflectively, bypassing all validations and enabling malicious gadget chain exploits.'}
              </p>
            </div>

            <div className="bg-slate-900/90 border border-indigo-900/40 rounded-2xl p-6">
              <div className="flex items-center space-x-2 text-emerald-400 mb-2">
                <ShieldCheck className="w-5 h-5 shrink-0" />
                <h4 className="font-bold text-white">L'Immunité Native des Records en Désérialisation</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mb-3">
                {language === 'fr'
                  ? 'La spécification JVM de Java 16 impose une règle stricte : un Record DÉSÉRIALISÉ DOIT OBLIGATOIREMENT passer par son Constructeur Canonique ! Aucun champ ne peut être écrit par Unsafe. Si un attaquant injecte un montant négatif ou un IBAN malformé, le constructeur compact lève une exception et interrompt immédiatement l\'attaque. Les Records sont sécurisés par conception (*Secure by Design*).'
                  : 'The Java 16 JVM specification mandates that Records MUST be deserialized through their Canonical Constructor! Unsafe field injection is forbidden. Any malicious payload triggers validation exceptions immediately.'}
              </p>
            </div>
          </div>

          {/* Local Records in Stream Pipelines */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
            <h4 className="text-base font-bold text-white mb-2 flex items-center space-x-2">
              <Code2 className="w-4 h-4 text-indigo-400" />
              <span>{language === 'fr' ? 'Records Locaux dans les Méthodes & Streams' : 'Local Records in Methods & Streams'}</span>
            </h4>
            <p className="text-xs text-slate-400 mb-3">
              {language === 'fr'
                ? 'Besoin d\'un type intermédiaire pour regrouper des données dans une pipeline Stream ? Fini les Map.Entry ou les tableaux Object[] ! Vous pouvez déclarer un record directement à l\'intérieur d\'une méthode :'
                : 'Need an intermediate tuple in a stream pipeline? No more untyped Object[] or Pair hacks! Declare records locally inside methods:'}
            </p>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto">
              <pre>{`public List<CustomerTotal> getTopSpenders(List<Order> orders) {
    // Record local déclaré DANS la méthode : invisible hors de celle-ci
    record CustomerSpend(String customerId, double total) {}

    return orders.stream()
        .collect(Collectors.groupingBy(Order::customerId, Collectors.summingDouble(Order::amount)))
        .entrySet().stream()
        .map(e -> new CustomerSpend(e.getKey(), e.getValue())) // Fortement typé !
        .filter(cs -> cs.total() > 1000.0)
        .map(cs -> new CustomerTotal(cs.customerId(), cs.total()))
        .toList();
}`}</pre>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ANEMIC VS RICH DOMAIN MODEL */}
      {activeTab === 'anemic' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Explanation Header */}
          <div className="bg-slate-900/90 border border-amber-900/30 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-2">
              {language === 'fr'
                ? 'L\'Anti-pattern du Modèle de Domaine Anémique (Martin Fowler)'
                : 'The Anemic Domain Model Anti-Pattern (Martin Fowler)'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {language === 'fr'
                ? 'Dans un modèle de domaine anémique, les entités métiers ne sont que des "sacs de données" passifs (simples JavaBeans remplis de getters et setters sans aucune logique). Toute la logique métier est déportée dans des services procéduraux (OrderService, InvoiceService). En Programation Orientée Objet (POO) et en Domain-Driven Design (DDD), c\'est l\'antithèse même de l\'encapsulation !'
                : 'In an Anemic Domain Model, entities are merely passive bags of data with getters and setters. All business rules and state transitions are decoupled into separate procedural service classes. In OOP and Domain-Driven Design (DDD), this breaks encapsulation and leads to duplicate validations and corrupted states.'}
            </p>
          </div>

          {/* Interactive Simulation: Anemic vs Rich in Action */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Anemic Box */}
            <div className="bg-slate-900/90 border border-rose-900/40 rounded-2xl p-6 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono uppercase px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30">
                    Modèle Anémique (Anti-Pattern)
                  </span>
                  <span className="text-xs text-rose-400 font-bold">Faible Cohésion / Invariants Brisés</span>
                </div>
                <h4 className="text-base font-bold text-white mb-2">Entité passive + Service procédural</h4>
                <div className="bg-slate-950 p-3 rounded-xl font-mono text-xs text-slate-300 border border-slate-800 mb-4">
                  <pre>{`// Entité anémique : Zéro logique, portes ouvertes
public class AnemicOrder {
    private String status;
    private List<Item> items;
    // Getters et Setters partout !
    public void setStatus(String s) { this.status = s; }
    public List<Item> getItems() { return this.items; }
}

// Le service contrôle tout de l'extérieur :
order.setStatus("CANCELLED"); // N'importe qui peut l'appeler !`}</pre>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-semibold text-slate-300">
                    {language === 'fr' ? 'Tester une corruption d\'état autorisée :' : 'Trigger an unchecked state corruption:'}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      onClick={() => handleAnemicAction('FORCE_CANCEL_SHIPPED')}
                      className="py-2 px-3 rounded-xl bg-rose-900/40 hover:bg-rose-900/60 border border-rose-700/60 text-rose-200 text-xs font-semibold transition-all flex items-center justify-center space-x-1"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Forcer setStatus(CANCELLED)</span>
                    </button>
                    <button
                      onClick={() => handleAnemicAction('MODIFY_ITEMS_AFTER_PAYMENT')}
                      className="py-2 px-3 rounded-xl bg-amber-900/40 hover:bg-amber-900/60 border border-amber-700/60 text-amber-200 text-xs font-semibold transition-all flex items-center justify-center space-x-1"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Modifier getItems() payé</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Anemic Console */}
              <div className="bg-slate-950 p-3 rounded-xl border border-rose-900/30 text-[11px] font-mono text-rose-300/90 space-y-1">
                <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">Journal Anémique :</div>
                {anemicLogs.map((log, idx) => (
                  <div key={idx} className="truncate">{log}</div>
                ))}
              </div>
            </div>

            {/* Right: Rich Domain Model Box */}
            <div className="bg-slate-900/90 border border-emerald-900/40 rounded-2xl p-6 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono uppercase px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    Modèle Riche (DDD Aggregate Root)
                  </span>
                  <span className="text-xs text-emerald-400 font-bold">Haute Cohésion / Invariants Garantis</span>
                </div>
                <h4 className="text-base font-bold text-white mb-2">Entité autonome protégeant ses invariants</h4>
                <div className="bg-slate-950 p-3 rounded-xl font-mono text-xs text-slate-300 border border-slate-800 mb-4">
                  <pre>{`public class RichOrder {
    private OrderStatus status = OrderStatus.PENDING;
    private final List<OrderItem> items = new ArrayList<>();

    // Méthodes métier explicites (Intention-Revealing)
    public void pay(PaymentReceipt receipt) {
        if (status != OrderStatus.PENDING) 
            throw new IllegalStateException("Already paid or closed");
        this.status = OrderStatus.PAID;
    }
    public void ship(TrackingNumber t) { ... }
}`}</pre>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-semibold text-slate-300">
                    {language === 'fr' ? 'Exécuter une transition d\'état métier valide :' : 'Execute valid business transitions:'}
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handleRichAction('PAY')}
                      className="py-2 px-3 rounded-xl bg-indigo-900/40 hover:bg-indigo-800/60 border border-indigo-700/60 text-indigo-200 text-xs font-semibold transition-all"
                    >
                      order.pay()
                    </button>
                    <button
                      onClick={() => handleRichAction('SHIP')}
                      className="py-2 px-3 rounded-xl bg-emerald-900/40 hover:bg-emerald-800/60 border border-emerald-700/60 text-emerald-200 text-xs font-semibold transition-all"
                    >
                      order.ship()
                    </button>
                    <button
                      onClick={() => handleRichAction('CANCEL')}
                      className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 text-xs font-semibold transition-all"
                    >
                      order.cancel()
                    </button>
                  </div>
                </div>
              </div>

              {/* Rich Console */}
              <div className="bg-slate-950 p-3 rounded-xl border border-emerald-900/30 text-[11px] font-mono text-emerald-300/90 space-y-1">
                <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">
                  <span>Journal Riche DDD :</span>
                  <span className="text-amber-400">Statut courant: {orderStatus}</span>
                </div>
                {richLogs.map((log, idx) => (
                  <div key={idx} className="truncate">{log}</div>
                ))}
              </div>
            </div>
          </div>

          {/* Where do Records fit with DDD? */}
          <div className="bg-slate-900/90 border border-indigo-900/30 rounded-2xl p-6">
            <h4 className="text-base font-bold text-white mb-2 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>{language === 'fr' ? 'Quelle est la place des Records dans une architecture DDD ?' : 'Where do Records fit in DDD Architecture?'}</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 text-xs text-slate-300">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="font-bold text-indigo-300 mb-1 flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Idéal pour les Value Objects & DTOs</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  {language === 'fr'
                    ? "Les Records sont parfaits pour les Value Objects (Money, Coordinates, EmailAddress, DateRange) et les DTOs d'API / événements CQRS, car ils sont définis uniquement par leurs valeurs sans notion d'identité mutable."
                    : "Records are optimal for Value Objects (Money, Coordinates, EmailAddress, DateRange) and API DTOs / CQRS domain events, as they have value equality without mutable identity."}
                </p>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="font-bold text-amber-300 mb-1 flex items-center space-x-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Inapproprié pour les Entités & Aggregates Roots</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  {language === 'fr'
                    ? "Un Aggregate Root (ex: Order, BankAccount) a une identité propre (ID) et subit des mutations d'état au cours de sa vie. Transformer une Entité racine en Record briserait la gestion du cycle de vie et forcerait à recréer des objets complets."
                    : "An Aggregate Root (Order, BankAccount) has lifecycle identity (ID) and state transitions over time. Making it a Record breaks lifecycle continuity and forces synthetic re-allocations."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: JAVA ENUM */}
      {activeTab === 'enum' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Enum Intro Header */}
          <div className="bg-slate-900/90 border border-emerald-900/30 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-2">
              {language === 'fr'
                ? 'L\'Enum en Java : Une Classe Complète avec État et Comportement'
                : 'Java Enum: A First-Class Object with State and Behavior'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {language === 'fr'
                ? 'En C, une enum n\'est qu\'un simple entier de 4 octets sans type fort (ex: typedef enum { RED=0, GREEN=1 } Color;). En Java, une enum est une vraie classe compilée qui hérite de java.lang.Enum<E>. Elle peut posséder des champs d\'instance finaux, des constructeurs privés, des méthodes personnalisées et implémenter des interfaces !'
                : 'In C, an enum is merely a 4-byte raw integer without type safety. In Java, an enum is a full-fledged class subclassing java.lang.Enum<E>. It can have final fields, private constructors, methods, and implement interfaces!'}
            </p>
          </div>

          {/* Interactive Enum with Constant-Specific Class Bodies */}
          <div className="bg-slate-900/90 border border-emerald-900/30 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                <Code2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">
                  {language === 'fr'
                    ? 'Atelier : Méthodes Spécifiques aux Constantes (Constant-Specific Methods)'
                    : 'Interactive Lab: Constant-Specific Methods'}
                </h4>
                <p className="text-xs text-slate-400">
                  {language === 'fr'
                    ? 'Chaque constante de l\'enum peut implémenter une méthode abstraite de façon unique, éliminant les switchs verbeux !'
                    : 'Each enum constant can implement an abstract method with its own specialized behavior, removing ugly switch statements!'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Code */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-300">
                <pre>{`public enum Operation {
    PLUS("+") {
        public double apply(double x, double y) { return x + y; }
    },
    MINUS("-") {
        public double apply(double x, double y) { return x - y; }
    },
    MULTIPLY("*") {
        public double apply(double x, double y) { return x * y; }
    },
    DIVIDE("/") {
        public double apply(double x, double y) { return x / y; }
    };

    private final String symbol;
    Operation(String symbol) { this.symbol = symbol; }
    public abstract double apply(double x, double y);
}`}</pre>
              </div>

              {/* Calculator Sandbox */}
              <div className="flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Valeur A :</label>
                      <input
                        type="number"
                        value={enumValA}
                        onChange={(e) => setEnumValA(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Valeur B :</label>
                      <input
                        type="number"
                        value={enumValB}
                        onChange={(e) => setEnumValB(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      {language === 'fr' ? 'Sélectionner la constante Enum :' : 'Select Enum Constant:'}
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {(['PLUS', 'MINUS', 'MULTIPLY', 'DIVIDE'] as const).map((op) => (
                        <button
                          key={op}
                          onClick={() => setSelectedEnumOp(op)}
                          className={`py-2 px-2 rounded-xl text-xs font-bold transition-all ${
                            selectedEnumOp === op
                              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 border border-emerald-400'
                              : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                          }`}
                        >
                          {op}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Calculation outcome */}
                <div className="p-4 rounded-xl bg-slate-950 border border-emerald-900/40 text-xs font-mono space-y-2">
                  <div className="text-emerald-400 font-bold">
                    Operation.{selectedEnumOp}.apply({enumValA}, {enumValB})
                  </div>
                  <div className="text-xl font-extrabold text-white">
                    Résultat = <span className="text-amber-400">{computeEnumResult()}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                    Ordre ordinal JVM: <span className="text-indigo-400">{selectedEnumOp}.ordinal()</span> | Nom immuable: <span className="text-indigo-400">{selectedEnumOp}.name()</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Joshua Bloch Singleton via Enum */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center space-x-2 text-emerald-400 mb-2">
                <ShieldCheck className="w-5 h-5" />
                <h4 className="font-bold text-white">Le Singleton Parfait (Joshua Bloch - Effective Java)</h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                {language === 'fr'
                  ? 'Pourquoi utiliser une enum à un seul élément est la méthode absolue recommandée pour implémenter un Singleton en Java ?'
                  : 'Why is a single-element enum the best approach to implement a Singleton in Java?'}
              </p>
              <ul className="space-y-2 text-xs text-slate-400">
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span><strong>Thread-Safe natif</strong> : Initialisé par la JVM lors de la phase de chargement de classe (&lt;clinit&gt;) avec verrou de classe natif.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span><strong>Immunisé contre la Sérialisation</strong> : La JVM interdit la création de nouveaux objets lors de la désérialisation d\'un enum (règles de la JVM Spec).</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span><strong>Protégé contre la Réflexion</strong> : <code className="text-rose-400">Constructor.newInstance()</code> lève explicitement une <code className="text-rose-400">IllegalArgumentException: Cannot reflectively create enum objects</code> !</span>
                </li>
              </ul>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 font-mono text-xs text-slate-300 flex flex-col justify-between">
              <div>
                <div className="text-emerald-400 font-bold mb-2">// Singleton absolu en Java :</div>
                <pre>{`public enum DatabaseConnectionPool {
    INSTANCE; // Unique instance dans toute la JVM

    private DataSource dataSource;
    DatabaseConnectionPool() {
        // Constructeur garanti exécuté 1 seule fois
        this.dataSource = initializePool();
    }
    public Connection getConnection() {
        return dataSource.getConnection();
    }
}

// Appel partout dans l'application :
Connection conn = DatabaseConnectionPool.INSTANCE.getConnection();`}</pre>
              </div>
            </div>
          </div>

          {/* Bytecode representation of Enum */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
            <h4 className="text-base font-bold text-white mb-2 flex items-center space-x-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>{language === 'fr' ? 'Désassemblage Bytecode : Ce que javac génère réellement pour un enum' : 'Bytecode Disassembly: What javac actually generates for an enum'}</span>
            </h4>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto">
              <pre>{`// Décompilation javap de 'enum Color { RED, GREEN, BLUE }' :
public final class Color extends java.lang.Enum<Color> {
    public static final Color RED;
    public static final Color GREEN;
    public static final Color BLUE;
    private static final Color[] $VALUES;

    // Méthode statique générée automatiquement par javac
    public static Color[] values() {
        return (Color[])$VALUES.clone(); // Renvoie une copie défensive du tableau !
    }
    public static Color valueOf(java.lang.String name) { ... }

    // <clinit> : Initialisateur statique exécuté lors du chargement de classe
    static {
        RED   = new Color("RED", 0);
        GREEN = new Color("GREEN", 1);
        BLUE  = new Color("BLUE", 2);
        $VALUES = new Color[] { RED, GREEN, BLUE };
    }
}`}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
