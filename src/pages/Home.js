import React, { useState } from "react";
import logo from "../Logos/DevSync.png";
import{v4 as uuidv4} from 'uuid';
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Home = () => {
   const [roomId, setRoomId] = useState("");
   const [username, setUsername] = useState("");
   const navigate = useNavigate();
   const createNewRoom = (e) =>{
      e.preventDefault();
      const id = uuidv4();
      setRoomId(id);
      toast.success('Created a new room');

   };

   const joinRoom = () =>{
      if(!roomId || !username){
         toast.error('ROOM ID and Username is required');
         return;
      }
      //redirect
      navigate(`/editor/${roomId}`, {
         state:{
            username,
         },
      });
   };
   const handleInputEnter = (e) =>{
      if(e.code === 'Enter'){
         joinRoom();
      }
   }
    return (
        <div className="homePageWrapper">
            <div className="fromWrapper">
                <img className="homePageLogo" src={logo} alt="DevSync Logo" />
                <h4 className="mainLabel">Paste Invitation ROOM ID</h4>
                <div className="imputGroup">
                    <input
                        type="text"
                        className="inputBox"
                        placeholder="ROOM ID"
                        onChange={(e) => setRoomId(e.target.value)}
                        value={roomId}
                     
                    />
                    <input
                        type="text"
                        className="inputBox"
                        placeholder="USERNAME"
                        onChange={(e) => setUsername(e.target.value)}
                        value={username}
                        onKeyUp={handleInputEnter}
                    />
                    <button onClick={joinRoom} className="btn joinBtn">JOIN</button>
                    <span className="createInfo">
                     If you don't have an invite then create &nbsp;
                     <a onClick={createNewRoom} href="" className="createNewbtn">new room</a>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Home;
