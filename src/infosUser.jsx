import { React } from "react";

function InfosUser(props) {
    return (
        <div className="infos-user">
            <div className="name-rank">
                <h2>{props.userName}</h2>
                <figure>
                    <img src={props.urlBadgeUserUser}></img>
                </figure>
            </div>
            <span>
                <p className="label-p">Clan : </p>
                <p className="value-p">{props.userClan}</p>
            </span>

            <span>
                <p className="label-p">Honor : </p>
                <p className="value-p">{props.userHonor.toLocaleString()}</p>
            </span>

            <span>
                <p className="label-p">Completed Katas : </p>
                <p className="value-p">{props.userCompletKata.toLocaleString()}</p>
            </span>
            <span>
                <p className="label-p">LeadBoard Position : </p>
                <p className="value-p">{props.userPosition.toLocaleString()}</p>
            </span>
        </div>
    );
}

export default InfosUser;
