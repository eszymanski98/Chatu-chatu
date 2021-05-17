import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import Userlist from "./userlist.jsx";
import "./chat.css";

let socket = io.connect("http://localhost:5000");

const Chat = () => {
  const ref = useRef();
  const [chat, setchat] = useState([]);
  const [message, setmessage] = useState("");
  const [userName, setuserName] = useState("");
  const scrollToBottom = () => {
    ref.current.scrollTop = ref.current.scrollHeight;
  };
  const receiveHistory = (history) => {
    setchat(history);
    scrollToBottom();
  };
  const receiveMsg = (msg) => {
    setchat([...chat, msg]);
    scrollToBottom();
  };
  useEffect(() => {
    socket.on("messagehistory", receiveHistory);
    socket.on("message", receiveMsg);
    return () => {
      socket.off("message", receiveMsg);
      socket.off("messagehistory", receiveHistory);
    };
  });
  return (
    <>
      <div className="banner">
        <h1>Chatu-chatu</h1>
      </div>
      <div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (userName && message) {
              socket.emit("message", { userName, message });
              scrollToBottom();
              document.querySelector('#userMessage').value='';
            }else if (userName =='' && message == ''){
              alert("Enter username and message")
            }
            else if(userName == ''){
              alert("Enter user name!")
            }else if(message == ''){
              alert("Enter your message!")
            }
          }}
        >
          <div className="inputBoxes">
            <div className="userInputBox">
              <input
                placeholder="Enter your name"
                onChange={(e) => setuserName(e.target.value)}
                type="text"
                name=""
                id=""
              />
            </div>
            <div className="inputbox">
              <input
                placeholder="Enter your message"
                onChange={(e) => setmessage(e.target.value)}
                type="text"
                name=""
                id="userMessage"
              />
            </div>
          </div>
          <button className="guzik" type="submit">
            Send your message
          </button>
        </form>
        <div className="gamebox">
          <Userlist socket={socket} />
          <div className="chatbox" ref={ref}>
            {chat.map((msg, i) => (
              <p key={i}>{msg.userName + ": " + msg.message}</p>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;
