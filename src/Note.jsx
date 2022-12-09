import { useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import ReactTimeago from "react-timeago";
import { getNote } from "./firebase";
import lang from "./language";


function Note() {
    const notekey = useParams().noteid;
    const notesecret = useLocation().hash.slice(1);

    const [status, setStatus] = useState(lang.note.waiting);
    const [space, switchSpace] = useState("waiting");

    const [noteValue, setNoteValue] = useState("");
    const [noteCreated, setNoteCreated] = useState(Date.now());
    const [noteError, setNoteError] = useState(lang.note.waitfor);

    const [copyButton, setCopyButton] = useState(lang.button.copynote);

    const noteArea = useRef(null);

    if (!notekey || !notesecret || !notesecret.length === 8) return window.location.replace("/");
    window.history.replaceState({}, window.document.title, "/hidden#");

    const createNoteContent = (data) => {
        switchSpace("reader");
        setStatus(lang.note.readnote);
        setNoteValue(data.note);
        setNoteCreated(data.created);
    };

    const fetchNote = async () => {
        const docRef = await getNote(notekey, notesecret);
        if (docRef.status === "failed") {
            switchSpace("failed");
            setStatus(lang.note.failed);
            setNoteError(docRef.message);
            return;
        }
        const data = docRef.message;
        createNoteContent(data);
    };
    fetchNote();

    const backToHome = () => {
        window.location.replace("/");
    };
    const refreshUrl = () => {
        window.location.replace("/" + notekey + "#" + notesecret);
    };
    const copyNote = () => {
        noteArea.current.select();
        window.document.execCommand("copy");
        setCopyButton(lang.button.copied);
        setTimeout(() => {
            setCopyButton(lang.button.copynote);
        }, 500);
    };
    return (
        <div className="noteapp">
            <div className="flex head">
                <div className="title">{status}</div>
            </div>
            {(space === "waiting") && <>
                <div className="tip">{noteError}</div>
            </>}
            {(space === "failed") && <>
                <div className="tip error">{noteError}</div>
                <div className="flexgap">
                    <button className="button submit" type="button" onClick={refreshUrl}>{lang.button.refresh}</button>
                    <button className="button newnote" type="button" onClick={backToHome}>{lang.button.newnote}</button>
                </div>
            </>}
            {space === "reader" && <>
                <div className="created">
                    <div className="upper bound">{lang.note.created}: <span className="lower bound"><ReactTimeago date={noteCreated} /></span></div>
                </div>
                <div className="noter">
                    <textarea
                        name="note"
                        id="note"
                        className="notepad"
                        ref={noteArea}
                        placeholder={lang.home.placeholder}
                        value={noteValue}
                        readOnly={true}
                    />
                </div>
                <div className="flexgap">
                    <button className="button submit" type="button" onClick={copyNote}>{copyButton}</button>
                    <button className="button newnote" type="button" onClick={backToHome}>{lang.button.newnote}</button>
                </div>
            </>}
        </div>
    );
};

export default Note;