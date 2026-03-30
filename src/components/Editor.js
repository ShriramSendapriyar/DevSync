import React, { useEffect, useRef } from "react";
import Codemirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import ACTIONS from "../actions";

const Editor = ({ socket, roomId, onCodeChange }) => {
    const editorRef = useRef(null);

    // Initialize editor
    useEffect(() => {
        editorRef.current = Codemirror.fromTextArea(
            document.getElementById("realtimeEditor"),
            {
                mode: { name: "javascript", json: true },
                theme: "dracula",
                autoCloseTags: true,
                autoCloseBrackets: true,
                lineNumbers: true,
            }
        );

        editorRef.current.on("change", (instance, changes) => {
            const { origin } = changes;
            const code = instance.getValue();

            onCodeChange(code);

            
            if (origin !== "setValue" && socket.current) {
                socket.current.emit(ACTIONS.CODE_CHANGE, {
                    roomId,
                    code,
                });
            }
        });

        return () => {
            editorRef.current?.toTextArea();
            editorRef.current = null;
        };
    }, []);

    // Listen for remote changes
    useEffect(() => {
        if (!socket?.current) return;

        const handleCodeChange = ({ code }) => {
            if (code !== null && editorRef.current &&
                code !== editorRef.current.getValue()
            ) {
                editorRef.current.setValue(code);
            }
        };

        socket.current.on(ACTIONS.CODE_CHANGE, handleCodeChange);

        return () => {
            socket.current?.off(ACTIONS.CODE_CHANGE, handleCodeChange);
        };
    }, [socket]);

    return <textarea id="realtimeEditor"></textarea>;
};

export default Editor;