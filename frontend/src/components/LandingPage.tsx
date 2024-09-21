import "../styles/landing.css";
function LandingPage() {
    return (
        <section className="landing-container">
            <h1>Budget App Title</h1>
            <h2>Create an Account or Login to Begin</h2>
            <div className="landing-button-container">
                <a href="/login" className="button primary-button">
                    Login
                </a>
                <a href="/signup" className="button secondary-button">
                    Sign Up
                </a>
            </div>
        </section>
    );
}

export default LandingPage;
