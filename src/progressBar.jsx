import { useState } from "react";

const ProgressBar = (props) => {
    const { bgcolor, completed, language } = props;

    const fillerStyles = {
        width: `${completed}%`,
        backgroundColor: bgcolor,
    };

    return (
        <div className="box-progress-bar">
            <p>{language}</p>
            <div className="progress">
                <div className="progress-value" style={fillerStyles}>
                    <span className="label-progress">{`${completed}%`}</span>
                </div>
            </div>
        </div>
    );
};

export default ProgressBar;
