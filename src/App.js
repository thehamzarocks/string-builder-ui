import logo from "./logo.svg";
import "./App.css";
import React, { useEffect, useState } from "react";
import Socket from "./socket";
import SocketService from "./socket";

function App() {
  const [lastSubmitText, setLastSubmitText] = useState("");

  const [entries, setEntries] = useState({
    entries: [
      {
        id: "0",
        text: "This was the beginning of something great",
        author: "Amy",
      },
      {
        id: "1",
        text: "It started small",
        author: "Bob",
      },
      {
        id: "2",
        text: "But itsy-little bits were added often",
        author: "Amy",
      },
      {
        id: "3",
        text: "And it soon became a thing to cherish.",
        author: "Charles",
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

  const setCaretPosition = (el, pos) => {
    const range = document.createRange();
    var sel = window.getSelection();
    range.setStart(el.childNodes[0], pos);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
  };

  const handleChange = (e) => {
    const currentText = e.currentTarget.innerHTML ?? "";
    if (currentText.length < lastSubmitText.length) {
      e.currentTarget.innerHTML = lastSubmitText;
      setCaretPosition(e.currentTarget, lastSubmitText.length);
    }
  };

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
    console.log("Updating entries from server");
    console.log(serverEntries);
    setEntries({ entries: serverEntries });
  };

  return (
    <div className="mainText">
      {getExistingEntries()}
      <div
        className="mainTextInput"
        contentEditable="true"
        onBlur={(e) => submitEntry(e)}
        // onInput={(e) => handleChange(e)}
      ></div>
    </div>
  );
}

export default App;
