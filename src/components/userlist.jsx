import React, { useState, useEffect } from "react";
import "./userlist.css";

const Userlist = ({ socket }) => {
  const [userlist, setuserlist] = useState([]);

  const receiveUserList = (userlist) => {
    setuserlist(userlist);
  };
  useEffect(() => {
    socket.on("users", receiveUserList);
    return () => {
      socket.off("users", receiveUserList);
    };
  });
  return (
    <ol className="userlist">
      {userlist.map((user, i) => (
        <li key={i}>{user}</li>
      ))}
    </ol>
  );
};

export default Userlist;
