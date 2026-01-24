import Editor from "@monaco-editor/react";

const CodeEditor = ({ language, code, setCode, highlightLine }) => {
  return (
    // Added h-full to the container div
    <div className="rounded-b-xl overflow-hidden bg-[#0f172a] h-full w-full relative">
      <Editor
        height="100%" // Changed from 47vh to 100% to fill the responsive parent
        language={language}
        theme="vs-dark"
        value={code}
        onChange={(value) => setCode(value)}
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          automaticLayout: true,
          scrollBeyondLastLine: false,
          wordWrap: "on",
          theme: "vs-dark",
          background: "#0f172a",
        }}
        // Note: Monaco React doesn't natively accept highlightLine as a direct prop like this. 
        // You usually handle decorations via onMount, but keeping it as you passed it to not break your existing logic if you have a wrapper.
      />
    </div>
  );
};

export default CodeEditor;