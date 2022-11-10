import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserSecret } from "@fortawesome/free-solid-svg-icons";
import { PieChart, Pie } from "recharts";
import ProgressBar from "./progressBar";
import "./App.css";

// var ProgressBar = require("progressbar.js");

function UserStats() {
    const dataUser = JSON.parse(localStorage.getItem("dataUser")) || false;
    const urlBadgeUserUser = "https://www.codewars.com/users/" + dataUser.user + "/badges/large";

    // Retreive name languages trained for the progress bar
    const listRankLang = [];
    for (var key in dataUser.ranks.languages) {
        console.log("key:", dataUser.ranks.languages[key]);
        listRankLang.push({ language: key, name: dataUser.ranks.languages[key].name, score: dataUser.ranks.languages[key].score, color: dataUser.ranks.languages[key].color });
    }
    console.log("listRankLang:", listRankLang);

    // list rank and there score for rank Up
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

    const nameRankOverall = dataUser.ranks.overall.name;
    console.log("nameRankOverall: ", nameRankOverall);

    const calcPourcRankUp = (name, score) => {
        // name of rank
        const indexRank = rankUpScore.findIndex((item) => item.name === name);
        console.log("indexRank: ", indexRank);
        console.log("rankUpScore: ", rankUpScore[indexRank].score);

        // calcul pourcentage rank Up
        var pourRkUp = ((score - rankUpScore[indexRank].score) * 100) / (rankUpScore[indexRank + 1].score - rankUpScore[indexRank].score);
        console.log("pourRkUp: ", pourRkUp);

        // round decimal superior  5.579 => 5.58
        pourRkUp = Math.round(pourRkUp * 100) / 100;
        console.log("pourRkUp: ", pourRkUp);

        return pourRkUp;
    };

    // Data for pie charts Rank Overall
    const dataPieChartOverall = [
        { name: "Rank", value: calcPourcRankUp(nameRankOverall, dataUser.ranks.overall.score), fill: "#bb432c" },
        { name: "empty", value: 100 - calcPourcRankUp(nameRankOverall, dataUser.ranks.overall.score), fill: "#38393b" },
    ];

    // create list progress bar rank up for all language
    const listBarRankLang = listRankLang.map((item) => <ProgressBar bgcolor={item.color} completed={calcPourcRankUp(item.name, item.score)} language={item.language} />);

    return (
        <div className="main-stats">
            <div className="box-1">
                <div className="div-user">
                    <div className="infos-user">
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
                            <Pie data={dataPieChartOverall} dataKey="value" cx={200} cy={200} innerRadius={70} outerRadius={90} stroke="none" startAngle={90} endAngle={-270} />
                        </PieChart>
                    </div>
                    <div className="div-progress-bar">{listBarRankLang}</div>
                </div>
            </div>
        </div>
    );
}

export default UserStats;
