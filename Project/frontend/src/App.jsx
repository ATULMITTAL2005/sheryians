import { useState, useRef, useMemo, useEffect } from "react";
import "./App.css";

import { Editor } from "@monaco-editor/react";
import { MonacoBinding } from "y-monaco";

import * as Y from "yjs";
import { SocketIOProvider } from "y-socket.io";

function App() {
  const editorRef = useRef(null);

  const [username, setUsername] = useState(() => {
    // get username from url query params
    const params = new URLSearchParams(window.location.search);
    return params.get("username") || "";
  }
  );

  const ydoc = useMemo(() => new Y.Doc(), []);

  const yText = useMemo(() => {
    return ydoc.getText("monaco");
  }, [ydoc]);

  const handleMount = (editor) => {
    editorRef.current = editor;

    // connect client to server
   
  };

  const handleJoin = (e) => {
    e.preventDefault();

    const value = e.target.username.value;

    setUsername(value);
    // after refresh, we can get the username from url query params and the data is recoverd
    window.history.pushState(null, null, `?username=${value}`);
  };


   useEffect(() => {
    if(username && editorRef.current) {
 const provider = new SocketIOProvider(
      "http://localhost:3000",
      "monaco-demo",
      ydoc,
      {
        autoConnect: true,
      }
    );

    // connect editor and yjs
    new MonacoBinding(
      yText,
      editorRef.current.getModel(),
      new Set([editorRef.current]),
      provider.awareness
    );
    }
  }, [username, editorRef.current]);


  // JOIN SCREEN
  if (!username) {
    return (
      <main className="h-screen w-full bg-gray-950 flex gap-4 p-4 items-center justify-center">
        <form onSubmit={handleJoin} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Enter your name"
            className="p-2 rounded-lg bg-neutral-900 text-white"
            name="username"
          />

          <button className="p-2 rounded-lg bg-amber-50">
            Join
          </button>
        </form>
      </main>
    );
  }

  // MAIN UI
  return (
    <main className="h-screen w-full bg-gray-950 flex gap-4 p-4">
      <aside className="h-full w-[25%] bg-amber-50 rounded-lg p-4">
        {username}
      </aside>

      <section className="w-[75%] bg-neutral-900 rounded-lg overflow-hidden">
        <Editor
          height="100%"
          defaultLanguage="javascript"
          defaultValue="// some comment"
          theme="vs-dark"
          onMount={handleMount}
        />
      </section>
    </main>
  );
}

export default App;