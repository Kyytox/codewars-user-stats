import { useState } from "react";

import CalendarHeatmap from "react-calendar-heatmap";
import ReactTooltip from "react-tooltip";
import { PieChart, Pie } from "recharts";
import ProgressBar from "./progressBar";

import img5Kyu from "../public/img/5_kyu.png";

import "./App.css";
import "./react-calendar-heatmap.css";

function shiftDate(date, numDays) {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + numDays);
    return newDate;
}

function UserStats() {
    const dataUser = JSON.parse(localStorage.getItem("dataUser")) || false;
    const urlBadgeUserUser = "https://www.codewars.com/users/" + dataUser.user + "/badges/large";

    const listCompletKata = JSON.parse(localStorage.getItem("completedChallenges")) || false;
    const dataHeatMap = [];
    var imgRank = "";
    // console.log("listCompletKata", listCompletKata.regroupDate);

    const today = new Date();

    // create array with date and number of completed Kata
    for (var y = 0; y <= 200; y++) {
        var dateKata = shiftDate(today, -y);

        // format Date ( YYYY-MM-DD )
        dateKata = String(dateKata.toLocaleDateString("fr-FR", { year: "numeric", month: "numeric", day: "numeric" }))
            .split("/")
            .reverse()
            .join("-");
        // console.log("dateKata", dateKata);

        // add date and number kata completed by date
        if (dateKata in listCompletKata.regroupDate) {
            dataHeatMap.push({ date: dateKata, count: listCompletKata.regroupDate[dateKata].length });
        } else {
            dataHeatMap.push({ date: dateKata, count: 0 });
        }
    }
    console.log("dataHeatMap: ", dataHeatMap);

    // Retreive name languages trained for the progress bar
    const listRankLang = [];
    for (var key in dataUser.ranks.languages) {
        // console.log("key:", dataUser.ranks.languages[key]);
        listRankLang.push({ language: key, name: dataUser.ranks.languages[key].name, score: dataUser.ranks.languages[key].score, color: dataUser.ranks.languages[key].color });
    }
    // console.log("listRankLang:", listRankLang);

    // list rank and there score for rank Up
    const rankUpScore = [
        { name: "8 kyu", score: 0, img: img5Kyu },
        { name: "7 kyu", score: 20, img: img5Kyu },
        { name: "6 kyu", score: 76, img: img5Kyu },
        { name: "5 kyu", score: 229, img: img5Kyu },
        { name: "4 kyu", score: 643, img: img5Kyu },
        { name: "3 kyu", score: 1768, img: img5Kyu },
        { name: "2 kyu", score: 4829, img: img5Kyu },
        { name: "1 kyu", score: 13147, img: img5Kyu },
        { name: "1 dan", score: 35759, img: img5Kyu },
        { name: "2 dan", score: 97225, img: img5Kyu },
    ];

    const nameRankOverall = dataUser.ranks.overall.name;
    // console.log("nameRankOverall: ", nameRankOverall);

    const calcPourcRankUp = (name, score) => {
        // name of rank
        const indexRank = rankUpScore.findIndex((item) => item.name === name);
        // console.log("indexRank: ", indexRank);
        // console.log("rankUpScore: ", rankUpScore[indexRank].score);

        imgRank = rankUpScore[indexRank + 1].img;

        // calcul pourcentage rank Up
        var pourRkUp = ((score - rankUpScore[indexRank].score) * 100) / (rankUpScore[indexRank + 1].score - rankUpScore[indexRank].score);
        // console.log("pourRkUp: ", pourRkUp);

        // round decimal superior  5.579 => 5.58
        pourRkUp = Math.round(pourRkUp * 100) / 100;
        // console.log("pourRkUp: ", pourRkUp);

        return pourRkUp;
    };

    // Data for pie charts Rank Overall
    const dataPieChartOverall = [
        { name: "Rank", value: calcPourcRankUp(nameRankOverall, dataUser.ranks.overall.score), fill: dataUser.ranks.overall.color },
        { name: "empty", value: 100 - calcPourcRankUp(nameRankOverall, dataUser.ranks.overall.score), fill: "#38393b" },
    ];

    // create list progress bar rank up for all language
    const listBarRankLang = listRankLang.map((item) => (
        <div key={item.language} className="box-progress-bar">
            <ProgressBar bgcolor={item.color} completed={calcPourcRankUp(item.name, item.score)} language={item.language} />
        </div>
    ));

    return (
        <div className="main-stats">
            <div className="div-user">
                <div className="infos-user">
                    <div className="name-rank">
                        <h2>{dataUser.user}</h2>
                        <figure>
                            <img src={urlBadgeUserUser}></img>
                        </figure>
                    </div>
                    <p>Clan: {dataUser.clan}</p>
                    <p>Honor: {dataUser.honor}</p>
                    <p>Completed Katas: {dataUser.challenges.totalCompleted}</p>
                    <p>LeadBoard Position: {dataUser.position}</p>
                </div>
            </div>
            <div className="div-charts">
                <div className="div-pie-chart-overall-rank">
                    <h3>Rank Breakdown</h3>
                    <img src={imgRank}></img>
                    <PieChart width={350} height={350}>
                        <Pie data={dataPieChartOverall} dataKey="value" cx={175} cy={120} innerRadius={70} outerRadius={90} stroke="none" startAngle={90} endAngle={-270} />
                    </PieChart>
                </div>
                <div className="div-progress-bar">{listBarRankLang}</div>
                <div className="div-kata-by-lang">Number Katas by language</div>
            </div>

            <div className="div-heat-map">
                <CalendarHeatmap
                    startDate={shiftDate(today, -150)}
                    endDate={today}
                    values={dataHeatMap}
                    classForValue={(value) => {
                        if (value.count >= 10) {
                            return "color-max";
                        }
                        return `color-${value.count}`;
                    }}
                    tooltipDataAttrs={(value) => {
                        return {
                            "data-tip": value.date + " Completed Kata: " + value.count,
                        };
                    }}
                    showWeekdayLabels={true}
                    gutterSize={2}
                />
                <ReactTooltip />
            </div>
        </div>
    );
}

export default UserStats;
