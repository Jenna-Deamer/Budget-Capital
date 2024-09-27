import "../styles/landing.css";

interface LandingPageProps {
    user: any;
}

function LandingPage({ user }: LandingPageProps) {
    return (
        <section className="landing-container">
            <h1>Budget Capital</h1>
            {!user && (
                <div className="landing-button-container">
                    <h2>Create an Account or Login to Begin:</h2>
                    <a href="/login" className="button primary-button">
                        Login
                    </a>
                    <a href="/signup" className="button secondary-button">
                        Sign Up
                    </a>
                </div>
            )}
        </section>
    );
}

export default LandingPage;
