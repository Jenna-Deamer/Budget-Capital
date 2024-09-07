function LandingPage() {
    return (
        <section className="landing-container">
            <h1>Budget App Title</h1>
            <h2>Create an Account or Login to Begin</h2>
            <div className="landing-button-container">
                <a href="/login" className="btn btn-primary">
                    Login
                </a>
                <a href="/signup" className="btn btn-secondary">
                    Sign Up
                </a>
            </div>
        </section>
    );
}

export default LandingPage;
