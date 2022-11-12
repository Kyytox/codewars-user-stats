import { useState } from "react";

const ProgressBar = (props) => {
    const { bgcolor, completed, language, nameRank, colCurRank, colNextRank, nameRankUp } = props;

    const fillerStyles = {
        width: `${completed}%`,
        backgroundColor: bgcolor,
    };

    return (
        <>
            <div className="title-progress-bar">
                <div className={"small-hex is-extra-wide " + colCurRank}>
                    <div className="inner-small-hex is-extra-wide">
                        <span>{nameRank}</span>
                    </div>
                </div>
                <p>{language}</p>
                <div className={"small-hex is-extra-wide " + colNextRank}>
                    <div className="inner-small-hex is-extra-wide">
                        <span>{nameRankUp}</span>
                    </div>
                </div>
            </div>
            <div className="progress">
                <div className="progress-value" style={fillerStyles}>
                    <span className="label-progress">{`${completed}%`}</span>
                </div>
            </div>
        </>
    );
};

export default ProgressBar;
