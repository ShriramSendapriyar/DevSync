import React, { useEffect, useRef, useState } from "react";
import Logo from "../Logos/DevSync.png";
import Client from "../components/Client";
import Editor from "../components/Editor";
import { initSocket } from "../socket";
import ACTIONS from "../actions";
import {
    useLocation,
    useNavigate,
    Navigate,
    useParams,
} from "react-router-dom";
import toast from "react-hot-toast";

const EditorPage = () => {
    const socketRef = useRef(null);
    const codeRef = useRef("");
    const hasInitialized = useRef(false);

    const location = useLocation();
    const navigate = useNavigate();
    const { roomId } = useParams();

    const [clients, setClients] = useState([]);
    const [socketReady, setSocketReady] = useState(false);

    useEffect(() => {
        if (hasInitialized.current) return;
        hasInitialized.current = true;

        const init = async () => {
            socketRef.current = await initSocket();

            socketRef.current.on("connect_error", handleErrors);
            socketRef.current.on("connect_failed", handleErrors);

            function handleErrors(e) {
                console.error("Socket error:", e);
                toast.error("Socket connection failed");
                navigate("/");
            }

            socketRef.current.emit(ACTIONS.JOIN, {
                roomId,
                username: location.state?.username,
            });

            socketRef.current.on(
                ACTIONS.JOINED,
                ({ clients, username, socketId }) => {
                    //Show toast for others joining
                    if (username !== location.state?.username) {
                        toast.success(`${username} joined`);
                    }


                    setClients(clients);


                    if (socketId !== socketRef.current.id) {
                        socketRef.current.emit(ACTIONS.SYNC_CODE, {
                            socketId,
                            code: codeRef.current,
                        });
                    }
                }
            );

            socketRef.current.on(
                ACTIONS.DISCONNECTED,
                ({ socketId, username }) => {
                    toast.success(`${username} left`);
                    setClients((prev) =>
                        prev.filter((client) => client.socketId !== socketId)
                    );
                }
            );

            
            setSocketReady(true);
        };

        init();

        return () => {
            socketRef.current?.disconnect();
            socketRef.current = null;
        };
    }, []);

    if (!location.state) {
        return <Navigate to="/" />;
    }

    return (
        <div className="mainWrap">
            <div className="aside">
                <div className="asideInner">
                    <img src={Logo} alt="logo" className="logoImage" />
                    <h3>Connected</h3>
                    <div className="clientsList">
                        {clients.map((client) => (
                            <Client
                                key={client.socketId}
                                username={client.username}
                            />
                        ))}
                    </div>
                </div>

                <button
                    className="btn copyBtn"
                    onClick={() => {
                        navigator.clipboard.writeText(roomId);
                        toast.success("Room ID copied");
                    }}
                >
                    Copy ROOM ID
                </button>

                <button className="btn leaveBtn" onClick={() => navigate("/")}>
                    Leave
                </button>
            </div>

            <div className="editorWrap">
                {socketReady && (
                    <Editor
                        socket={socketRef}
                        roomId={roomId}
                        onCodeChange={(code) => {
                            codeRef.current = code;
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default EditorPage;