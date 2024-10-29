import "../../styles/GoalWidget.css"

function GoalWidget() {
    return (
        <div className="goal-widget">
            <h5>You are $<span> </span></h5>
            <button className="primary-button button mt-2">Manage Goal</button>
        </div>
    );
}

export default GoalWidget;