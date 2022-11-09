import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserSecret } from "@fortawesome/free-solid-svg-icons";
import { PieChart, Pie } from "recharts";
import "./App.css";

function UserStats() {
    const [dataUser, setDataUser] = useState(JSON.parse(localStorage.getItem("dataUser")) || false);
    const urlBadgeUserUser = "https://www.codewars.com/users/" + dataUser.user + "/badges/large";

    const rankUpScore = [
        { name: "8 kyu", score: 0 },
        { name: "7 kyu", score: 20 },
        { name: "6 kyu", score: 76 },
        { name: "5 kyu", score: 229 },
        { name: "4 kyu", score: 643 },
        { name: "3 kyu", score: 1768 },
        { name: "2 kyu", score: 4829 },
        { name: "1 kyu", score: 13147 },
        { name: "1 dan", score: 35759 },
        { name: "2 dan", score: 97225 },
    ];

    const nameRank = dataUser.ranks.overall.name;
    console.log("nameRank: ", nameRank);

    // name of rank
    const indexRank = rankUpScore.findIndex((item) => item.name === nameRank);
    console.log("indexRank: ", indexRank);
    console.log("rankUpScore: ", rankUpScore[indexRank].score);

    // calcul pourcentage rank Up
    var pourRkUp = ((dataUser.ranks.overall.score - rankUpScore[indexRank].score) * 100) / (rankUpScore[indexRank + 1].score - rankUpScore[indexRank].score);
    console.log("pourRkUp: ", pourRkUp);

    // round decimal superior  5.579 => 5.58
    pourRkUp = Math.round(pourRkUp * 100) / 100;
    console.log("pourRkUp: ", pourRkUp);

    // Data for pie charts Rank Overall
    const data02 = [
        { name: "Rank", value: pourRkUp, fill: "#bb432c" },
        { name: "empty", value: 100 - pourRkUp, fill: "#38393b" },
    ];

    return (
        <div className="main-stats">
            <div className="box-1">
                <div className="div-user">
                    <div className="infos-user">
                        {/* <FontAwesomeIcon icon={faUserSecret} color={dataUser.ranks.overall.color} /> */}
                        <div className="name-rank">
                            <h2>{dataUser.user}</h2>
                            <figure>
                                <img src={urlBadgeUserUser}></img>
                            </figure>
                        </div>
                        <p>{dataUser.clan}</p>
                        <p>{dataUser.honor}</p>
                        <p>{dataUser.position}</p>
                    </div>
                </div>
                <div className="div-charts">
                    <div className="div-pie-chart-overall-rank">
                        <PieChart width={350} height={350}>
                            <Pie data={data02} dataKey="value" cx={200} cy={200} innerRadius={70} outerRadius={90} stroke="none" startAngle={90} endAngle={-270} />
                        </PieChart>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserStats;
