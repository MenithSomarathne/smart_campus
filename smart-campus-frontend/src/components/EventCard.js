import React from "react";

const EventCard = ({ event }) => {
    return (
        <div className="card mb-3">
            <div className="card-body">
                <h5 className="card-title">{event.title}</h5>
                <p className="card-text">{event.description}</p>
                <p className="card-text"><small className="text-muted">{new Date(event.date).toLocaleString()}</small></p>
            </div>
        </div>
    );
};

export default EventCard;