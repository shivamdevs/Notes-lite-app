import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import Home from './Home';
import Note from './Note';
import { useEffect } from 'react';


function App(props) {
    return (
        <div className="app">
            <BrowserRouter>
                <Header />
                <main className="main">
                    <div className="cover">
                        <Routes>
                            <Route path='/:noteid' element={<Note />} />
                            <Route path='/hidden' element={<Hidden />} />
                            <Route path='/' exact element={<Home />} />
                        </Routes>
                    </div>
                </main>
                <Footer />
            </BrowserRouter>
        </div>
    );
};

export default App;

function Hidden() {
    useEffect(() => {
        window.history.replaceState({}, window.document.title, "/");
        window.location.reload();
    }, []);
    return (<></>);
};
