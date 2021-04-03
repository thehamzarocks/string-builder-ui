import "./App.css";
import React, { useEffect, useState } from "react";
import SocketService from "./socket";

function App() {
  const [entries, setEntries] = useState({
    entries: [
      {
        id: "0",
        text: "Start typing here",
        author: "Amy",
      },
    ],
  });

  const onDestroy = () => {
    SocketService.disconnectFromSocket();
  };

  useEffect(() => {
    SocketService.registerCallback("entry-update", updateEntriesFromServer);
    return onDestroy;
  }, []);

  const getExistingEntries = () => {
    const existingEntries = entries.entries.map((entry) => {
      return (
        <div className="existingEntries" id={"entry" + entry.id} key={entry.id}>
          {entry.text}
        </div>
      );
    });
    return existingEntries;
  };

  const submitEntry = (e) => {
    if (e.currentTarget.textContent === "") {
      return;
    }
    SocketService.sendMessage("entry", {
      author: "me",
      text: e.currentTarget.textContent,
    });
    setEntries({
      ...entries,
      entries: [
        ...entries.entries,
        {
          id: entries.entries.length,
          text: e.currentTarget.innerHTML,
          author: "me",
        },
      ],
    });
    e.currentTarget.innerHTML = "";
  };

  const updateEntriesFromServer = (serverEntries) => {
    setEntries({ entries: serverEntries });
  };

  return (
    <div className="mainText">
      {getExistingEntries()}
      <div
        className="mainTextInput"
        contentEditable="true"
        onBlur={(e) => submitEntry(e)}
      ></div>
    </div>
  );
}

export default App;
