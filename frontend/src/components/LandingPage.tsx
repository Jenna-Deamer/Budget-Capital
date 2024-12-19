import "../styles/LandingPage.css";


interface LandingPageProps {
    user: { id: string; username: string | null; firstName: string; lastName: string } | null;
}


function LandingPage({ user }: LandingPageProps) {
    return (
        <section className="landing-container">
            <h1>Budget Capital</h1>
            {!user && (
                <>
                    <h2>Create an Account or Login to Begin:</h2>
                    <div className="landing-button-container">
                        <a href="/login" className="button primary-button">
                            Login
                        </a>
                        <a href="/signup" className="button secondary-button">
                            Sign Up
                        </a>
                    </div>
                </>
            )}
        </section>
    );
}

export default LandingPage;
