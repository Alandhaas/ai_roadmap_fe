import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { generateText } from "../helpers/api";
import { Settings } from "lucide-react";

/* ---------------- CONSTANTS ---------------- */

const DEFAULT_PARAMS_A = {
   temperature: 0.5,
   top_p: 0.9,
   max_tokens: 200,
};

const DEFAULT_PARAMS_B = {
   temperature: 0.8,
   top_p: 0.95,
   max_tokens: 200,
};

/* ---------------- MAIN ---------------- */

export default function LLMPlayground() {
   const [prompt, setPrompt] = useState("");
   const [model, setModel] = useState("tinyllama");
   const [loading, setLoading] = useState(false);

   const [history, setHistory] = useState([]);

   const [showSettings, setShowSettings] = useState(false);
   const [showRunB, setShowRunB] = useState(false);

   const [paramsA, setParamsA] = useState(DEFAULT_PARAMS_A);
   const [paramsB, setParamsB] = useState(DEFAULT_PARAMS_B);

   const chatRef = useRef(null);

   /* ---------------- EFFECTS ---------------- */

   useEffect(() => {
      chatRef.current?.scrollTo({
         top: chatRef.current.scrollHeight,
         behavior: "smooth",
      });
   }, [history, loading]);

   /* ---------------- HANDLERS ---------------- */

   const runGeneration = useCallback(async () => {
      if (!prompt.trim() || loading) return;

      const userPrompt = prompt;
      setPrompt("");
      setLoading(true);

      setHistory((prev) => [...prev, { prompt: userPrompt, outputs: { A: "", B: "" } }]);

      try {
         const [resA, resB] = await Promise.all([
            generateText({ prompt: userPrompt, model, ...paramsA }),
            showRunB
               ? generateText({ prompt: userPrompt, model, ...paramsB })
               : Promise.resolve(""),
         ]);

         setHistory((prev) => {
            const next = [...prev];
            next[next.length - 1] = {
               ...next[next.length - 1],
               outputs: { A: resA, B: resB },
            };
            return next;
         });
      } catch (err) {
         console.error(err);
         setHistory((prev) => {
            const next = [...prev];
            next[next.length - 1] = {
               ...next[next.length - 1],
               outputs: { A: "⚠️ Error generating response.", B: "" },
            };
            return next;
         });
      } finally {
         setLoading(false);
      }
   }, [prompt, loading, showRunB, model, paramsA, paramsB]);

   /* ---------------- RENDER ---------------- */

   return (
      <div className="relative h-full w-full">
         {/* CHAT (fills component) */}
         <div
            ref={chatRef}
            className="absolute inset-0 overflow-y-auto space-y-10 pt-6 px-8"
            style={{
               paddingBottom: "100px", // space for input bar
            }}>
               <AnimatePresence>
                  {history.map((turn, i) => (
                     <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25 }}
                        className="space-y-4">
                        <UserMessage text={turn.prompt} />

                        {showRunB ? (
                           <div className="grid grid-cols-2 gap-6">
                              <OutputBox>
                                 <AssistantOutput
                                    label="A"
                                    text={turn.outputs.A}
                                    loading={loading && i === history.length - 1}
                                 />
                              </OutputBox>

                              <OutputBox>
                                 <AssistantOutput
                                    label="B"
                                    text={turn.outputs.B}
                                    loading={loading && i === history.length - 1}
                                 />
                              </OutputBox>
                           </div>
                        ) : (
                           <AssistantOutput
                              label="A"
                              text={turn.outputs.A}
                              loading={loading && i === history.length - 1}
                           />
                        )}
                     </motion.div>
                  ))}
               </AnimatePresence>
         </div>

         {/* INPUT (absolute, always visible) */}
         <div className="absolute bottom-0 left-0 right-0 z-20 px-6 pb-2">
            <div className="items-center gap-3">
               <PromptInput
                  value={prompt}
                  onChange={setPrompt}
                  onSubmit={runGeneration}
                  disabled={loading}
               />

               <span
                  onClick={() => setShowSettings(true)}
                  className="
      text-xs
      text-gray-400
      hover:text-gray-600
      underline
      cursor-pointer
      block
      text-center 
      mt-2
   ">
                  control panel
               </span>
            </div>
         </div>

         {showSettings && (
            <SettingsModal
               onClose={() => setShowSettings(false)}
               showRunB={showRunB}
               setShowRunB={setShowRunB}
               paramsA={paramsA}
               setParamsA={setParamsA}
               paramsB={paramsB}
               setParamsB={setParamsB}
               model={model}
               setModel={setModel}
            />
         )}
      </div>
   );
}

/* ---------------- UI ---------------- */

function UserMessage({ text }) {
   return (
      <div className="text-right">
         <div className="text-xs opacity-50 mb-1">You</div>
         <div className="text-sm">{text}</div>
      </div>
   );
}

function OutputBox({ children }) {
   return (
      <div
         className="rounded-xl p-4"
         style={{
            backgroundColor: "rgba(255,255,255,0.03)",
            border: "1px solid var(--border-subtle)",
         }}>
         {children}
      </div>
   );
}

function AssistantOutput({ label, text, loading }) {
   return (
      <div>
         <div className="text-xs opacity-50 mb-1">Assistant {label}</div>
         <div className="text-sm leading-relaxed whitespace-pre-wrap">
            {text || (loading && <Spinner />)}
         </div>
      </div>
   );
}

function Spinner() {
   return (
      <span className="inline-flex gap-1">
         <span className="animate-bounce">•</span>
         <span className="animate-bounce [animation-delay:150ms]">•</span>
         <span className="animate-bounce [animation-delay:300ms]">•</span>
      </span>
   );
}

function PromptInput({ value, onChange, onSubmit, disabled }) {
   return (
      <div
         className="flex flex-1 items-center rounded-full px-4 py-1"
         style={{
            backgroundColor: "var(--bg-navbar)",
            border: "1px solid var(--border-subtle)",
         }}>
         <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Message the assistant…"
            className="flex-1 bg-transparent outline-none text-sm"
            onKeyDown={(e) => e.key === "Enter" && onSubmit()}
         />
         <button
            onClick={onSubmit}
            disabled={disabled}
            className="ml-3 rounded-full p-2 hover:bg-blue-500/10 transition disabled:opacity-50">
            ➤
         </button>
      </div>
   );
}

/* ---------------- SETTINGS ---------------- */

function SettingsModal({
   onClose,
   showRunB,
   setShowRunB,
   paramsA,
   setParamsA,
   paramsB,
   setParamsB,
   model,
   setModel,
}) {
   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
         <div className="absolute inset-0 bg-black/30" onClick={onClose} />

         <div
            className="relative w-full max-w-3xl rounded-lg shadow-lg p-6 z-10"
            style={{
               backgroundColor: "var(--bg-main)",
               border: "1px solid var(--border-subtle)",
            }}>
            <Header onClose={onClose} />

            <div
               className={`grid gap-6 justify-center ${
                  showRunB ? "grid-cols-[auto_auto]" : "grid-cols-[auto]"
               }`}>
               <ControlColumn title="Run A" params={paramsA} setParams={setParamsA} />
               {showRunB && <ControlColumn title="Run B" params={paramsB} setParams={setParamsB} />}
            </div>

            <CompareToggle show={showRunB} toggle={() => setShowRunB((v) => !v)} />
            <SamplingInfo />
            <Footer model={model} setModel={setModel} />
         </div>
      </div>
   );
}

function Header({ onClose }) {
   return (
      <div className="flex items-center justify-between pb-3 mb-4 border-b">
         <h2 className="text-sm font-semibold opacity-90">Generation settings</h2>
         <button onClick={onClose}>✕</button>
      </div>
   );
}

function CompareToggle({ show, toggle }) {
   return (
      <div className="flex justify-center mt-4">
         <button
            onClick={toggle}
            className="px-4 py-1.5 rounded text-xs"
            style={{ border: "1px solid var(--border-subtle)" }}>
            {show ? "Hide Run B" : "Compare with Run B"}
         </button>
      </div>
   );
}

function Footer({ model, setModel }) {
   return (
      <div className="mt-6 pt-4 flex justify-between border-t">
         <span className="text-sm opacity-70">Non-streaming mode</span>
         <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="bg-transparent text-xs">
            <option value="tinyllama">TinyLlama (local)</option>
            <option value="openai">OpenAI</option>
         </select>
      </div>
   );
}

function ControlColumn({ title, params, setParams }) {
   return (
      <div className="rounded-xl p-4 space-y-3 border">
         <div className="text-xs font-medium">{title}</div>
         <MiniSlider
            label="Temp"
            value={params.temperature}
            min={0}
            max={2}
            step={0.1}
            onChange={(v) => setParams({ ...params, temperature: v })}
         />
         <MiniSlider
            label="Top-p"
            value={params.top_p}
            min={0.1}
            max={1}
            step={0.05}
            onChange={(v) => setParams({ ...params, top_p: v })}
         />
      </div>
   );
}

function MiniSlider({ label, value, min, max, step, onChange }) {
   return (
      <div className="flex items-center gap-3">
         <span className="w-12 text-xs opacity-60">{label}</span>
         <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-32"
         />
         <span className="w-8 text-xs text-right">{value}</span>
      </div>
   );
}

function SamplingInfo() {
   return (
      <div className="mt-4 grid gap-3 sm:grid-cols-2 text-xs opacity-70">
         <div>
            <strong>Temperature</strong> controls randomness.
         </div>
         <div>
            <strong>Top-p</strong> limits token probability mass.
         </div>
      </div>
   );
}
