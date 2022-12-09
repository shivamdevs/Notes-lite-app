import lang from "./language";


function Footer() {

    return (
        <footer className="footer">
            <div className="cover">
                <div className="flex">
                    <div className="col">
                        <div className="copy">Private Note Lite</div>
                    </div>
                    <div className="col">
                        <div className="copy">© ShivamDevs 2022</div>
                    </div>
                    <div className="col">
                        <div className="version"><span>{lang.footer.version}:</span> 1.0.0</div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;