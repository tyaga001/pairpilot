"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import Editor, { type OnMount } from "@monaco-editor/react";
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";

interface CodeEditorProps {
  roomId: string;
  value: string;
  onChange: (code: string) => void;
}

export function CodeEditor({ roomId, value, onChange }: CodeEditorProps) {
  const ydocRef = useRef<Y.Doc | null>(null);
  const ytextRef = useRef<Y.Text | null>(null);
  const providerRef = useRef<WebrtcProvider | null>(null);

  useEffect(() => {
    const ydoc = new Y.Doc();
    const ytext = ydoc.getText("code");
    const provider = new WebrtcProvider(`pairpilot-${roomId}`, ydoc, {
      signaling: ["wss://signaling.yjs.dev"],
    });
    ydocRef.current = ydoc; ytextRef.current = ytext; providerRef.current = provider;
    if (ytext.length === 0 && value) ytext.insert(0, value);

    return () => { provider.destroy(); ydoc.destroy(); };
  }, [roomId]);

  const handleMount = useCallback<OnMount>((editor, monaco) => {
    const ytext = ytextRef.current!;
    // sync from yjs → monaco
    const apply = () => {
      const model = editor.getModel();
      if (!model) return;
      const newVal = ytext.toString();
      if (model.getValue() !== newVal) model.setValue(newVal);
    };
    apply();

    // yjs observer
    const observer = () => apply();
    ytext.observe(observer);

    // monaco → yjs
    const d = editor.onDidChangeModelContent(() => {
      const text = editor.getValue();
      const current = ytext.toString();
      if (text !== current) {
        ytext.delete(0, current.length);
        ytext.insert(0, text);
        onChange(text);
      }
    });

    // basic TS defaults
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2020,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.ESNext,
    });

    return () => { ytext.unobserve(observer); d.dispose(); };
  }, [onChange]);

  return (
    <div className="h-full rounded-md border">
      <Editor
        height="100%"
        defaultLanguage="typescript"
        onMount={handleMount}
        options={{ fontSize: 14, minimap: { enabled: false }, automaticLayout: true }}
      />
    </div>
  );
}

export default CodeEditor;