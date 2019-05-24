import React from 'react';

export default function List(props) {
    return (
        <div className="list">
            {props.dockets.map(docket => (
                <ListItem key={docket.id} text={docket.text} />
            ))}
        </div>
    );
}

function ListItem(props) {
    return (
        <div className="list__item">
            <input type="checkbox" />
            <span>{props.text}</span>
        </div>
    );
}