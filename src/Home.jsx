import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { addNote } from "./firebase";

import lang from "./language";

function Home() {
    const noteLinkValue = useRef(null);
    const [space, switchSpace] = useState("new");
    const [status, setStatus] = useState(lang.home.newnote);
    const [copyButton, setCopyButton] = useState(lang.button.copylink);
    
    const [creationError, setCreationError] = useState("");
    const [creationValue, setCreationValue] = useState("");
    
    const [notekey, setNoteKey] = useState("");
    const [noteSecret, setNoteSecret] = useState("");

    const updateNoteValue = ({target}) => {setCreationValue(target.value)};

    const createNote = async () => {
        setCreationError("");

        const note = creationValue;

        if (note.trim() === "") return setCreationError(lang.error.empty);

        if (window.localStorage) {
            window.localStorage.setItem("note", note);
        }

        switchSpace("processing");
        setStatus(lang.home.processing);

        const data = await addNote(note);
        if (data.status === "failed") {
            setCreationError(data.message);
            setStatus(lang.home.failed);
            switchSpace("failed");
            return;
        }

        setNoteKey(data.message.id);
        setNoteSecret(data.message.secret);

        switchSpace("created");
        setStatus(lang.home.created);
    };
    const updateNote = () => {
        setStatus(lang.home.editnote);
        switchSpace("new");
        setCreationError("");
    };
    const newNote = () => {
        window.location.reload();
    };
    const copyNoteLink = () => {
        noteLinkValue.current.select();
        window.document.execCommand("copy");
        setCopyButton(lang.button.copied);
        setTimeout(() => {
            setCopyButton(lang.button.copylink);
        }, 500);
    };

    return (
        <div className="noteapp">
            <div className="flex head">
                <div className="title">{status}</div>
            </div>
            {space === "new" && <>
                <div className="noter">
                    <textarea
                        name="note"
                        id="note"
                        className="notepad"
                        placeholder={lang.home.placeholder}
                        defaultValue={creationValue}
                        onChange={updateNoteValue}
                        autoFocus={true}
                    />
                </div>
                <div className="tip error center">{creationError}</div>
            </>}
            {space === "new" && <>
                <div className="flex">
                    <button className="submit button" onClick={createNote} type="button">{lang.button.makenote}</button>
                </div>
            </>}

            {space === "processing" && <>
                <div className="tip">{lang.home.beingprocessed}</div>
            </>}

            {space === "failed" && <>
                <div className="tip">{lang.home.failedtomake}</div>
                <div className="tip error">{creationError || lang.error.noerror}</div>
                <div className="tip">{lang.home.failedtip}</div>
                <div className="flex">
                    <button className="button switch" type="button" onClick={updateNote}>{lang.button.editnote}</button>
                    <button className="button submit" type="button" onClick={newNote}>{lang.button.newnote}</button>
                </div>
            </>}

            {space === "created" && <>
                <div className="created">
                    <div className="upper bound">{lang.home.linkto}:</div>
                    <input
                        ref={noteLinkValue}
                        className="key"
                        type="text"
                        name="notekey"
                        id="notekey"
                        readOnly={true}
                        value={`${window.location.origin}/${notekey}#${noteSecret}`}
                    />
                    <div className="lower bound">{lang.home.copytip}</div>
                </div>
                <div className="flex">
                    <div className="flexblock">
                        <button className="button switch" type="button" onClick={copyNoteLink}>{copyButton}</button>
                    </div>
                    <div className="flex">
                        <div className="flexgap">
                            <Link to={`/${notekey}#${noteSecret}`} className="button submit" type="button">{lang.button.opennote}</Link>
                        </div>
                        <div className="flexblock">
                            <button className="button newnote" type="button" onClick={newNote}>{lang.button.newnote}</button>
                        </div>
                    </div>
                </div>
            </>}
        </div>
    );
};

export default Home;