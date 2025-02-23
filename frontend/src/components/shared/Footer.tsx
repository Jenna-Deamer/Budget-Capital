function Footer() {
    const CURRENTYEAR = new Date().getFullYear();

    return (
        <footer>
            <p>&copy;{CURRENTYEAR}. All rights reserved.</p>
        </footer>
    );
}

export default Footer;
