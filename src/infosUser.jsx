import { React } from "react";
import CountUp from "react-countup";

function InfosUser(props) {
    return (
        <div className="infos-user">
            <div className="name-rank" data-aos="zoom-in" data-aos-delay="100" data-aos-duration="1500">
                <h2>{props.userName}</h2>
                <figure>
                    <img src={props.urlBadgeUserUser}></img>
                </figure>
            </div>
            <span data-aos="fade-right" data-aos-delay="100" data-aos-duration="1500">
                <p className="label-p">Clan : </p>
                <p className="value-p">{props.userClan}</p>
            </span>

            <span data-aos="fade-right" data-aos-delay="300" data-aos-duration="1500">
                <p className="label-p">Honor : </p>
                <p className="value-p">
                    <CountUp end={props.userHonor} duration={2} separator=" " />
                </p>
            </span>

            <span data-aos="fade-right" data-aos-delay="500" data-aos-duration="1500">
                <p className="label-p">Completed Katas : </p>
                <p className="value-p">
                    <CountUp end={props.userCompletKata} separator=" " duration={2} />
                </p>
            </span>

            <span data-aos="fade-right" data-aos-delay="600" data-aos-duration="1500">
                <p className="label-p">LeadBoard Position : </p>
                <p className="value-p">
                    <CountUp end={props.userPosition} separator=" " duration={2} />
                </p>
            </span>
        </div>
    );
}

export default InfosUser;
