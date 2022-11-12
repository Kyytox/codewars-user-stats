import { React, useState } from "react";

import CalendarHeatmap from "react-calendar-heatmap";
import ReactTooltip from "react-tooltip";
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis } from "recharts";
import ProgressBar from "./progressBar";
import Button from "@mui/material/Button";

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
    // console.log("listCompletKata", listCompletKata.regroupDate);

    const arrKataByLang = listCompletKata.KataByLang;
    console.log("arrKataByLang", arrKataByLang);

    const arrKataByLangForm = [];
    for (const [key, value] of Object.entries(arrKataByLang)) {
        console.log("key, value", key, value);
        arrKataByLangForm.push({ language: key, nbKata: value.length });
    }
    console.log("arrKataByLangForm", arrKataByLangForm);

    const CustomizedLabel = (props) => {
        const { x, y, value, width, height } = props;

        console.log("width", x + width);

        const fireOffset = x + width < 240;
        const offset = fireOffset ? -28 : 5;

        const fireOffset2 = value.toString().length === 1;
        const offset2 = fireOffset2 ? -10 : 0;

        return (
            <text x={x + width - offset + offset2} y={y + height - 5} fill={"white"} textAnchor="end">
                {value}
            </text>
        );
    };

    const today = new Date();

    // create array with date and number of completed Kata
    for (var y = 0; y <= 365; y++) {
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
    // console.log("dataHeatMap: ", dataHeatMap);

    // Retreive name languages trained for the progress bar
    const listRankLang = [];
    for (var key in dataUser.ranks.languages) {
        // console.log("key:", dataUser.ranks.languages[key]);
        listRankLang.push({ language: key, name: dataUser.ranks.languages[key].name, score: dataUser.ranks.languages[key].score, color: dataUser.ranks.languages[key].color });
    }
    // console.log("listRankLang:", listRankLang);

    // list rank and there score for rank Up
    const rankUpScore = [
        { name: "8 kyu", score: 0, color: "white", exaCol: "#e6e6e6" },
        { name: "7 kyu", score: 20, color: "white", exaCol: "#e6e6e6" },
        { name: "6 kyu", score: 76, color: "yellow", exaCol: "#ecb613" },
        { name: "5 kyu", score: 229, color: "yellow", exaCol: "#ecb613" },
        { name: "4 kyu", score: 643, color: "blue", exaCol: "#1f87e7" },
        { name: "3 kyu", score: 1768, color: "blue", exaCol: "#1f87e7" },
        { name: "2 kyu", score: 4829, color: "purple", exaCol: "#866cc7" },
        { name: "1 kyu", score: 13147, color: "purple", exaCol: "#866cc7" },
        { name: "1 dan", score: 35759, color: "grey", exaCol: "#555" },
        { name: "2 dan", score: 97225, color: "grey", exaCol: "#555" },
    ];

    const nameRankOverall = dataUser.ranks.overall.name;
    // console.log("nameRankOverall: ", nameRankOverall);

    // image current rank
    if (nameRankOverall === "2 dan") {
        var colRankUp = "#555";
    } else {
        var colRankUp = rankUpScore[rankUpScore.findIndex((item) => item.name === nameRankOverall) + 1].color;
    }

    const calcPourcRankUp = (name, score) => {
        // name of rank
        const indexRank = rankUpScore.findIndex((item) => item.name === name);
        // console.log("indexRank: ", indexRank);
        // console.log("rankUpScore: ", rankUpScore[indexRank].score);

        if (name === "2 dan") {
            pourRkUp = 100;
        } else {
            // calcul pourcentage rank Up
            var pourRkUp = ((score - rankUpScore[indexRank].score) * 100) / (rankUpScore[indexRank + 1].score - rankUpScore[indexRank].score);
            // console.log("pourRkUp: ", pourRkUp);

            // round decimal superior  5.579 => 5.58
            pourRkUp = Math.round(pourRkUp * 100) / 100;
            // console.log("pourRkUp: ", pourRkUp);
        }

        return pourRkUp;
    };

    // Data for pie charts Rank Overall
    const dataPieChartOverall = [
        { name: "Rank", value: calcPourcRankUp(nameRankOverall, dataUser.ranks.overall.score), fill: rankUpScore[rankUpScore.findIndex((rank) => rank.name === nameRankOverall)].exaCol },
        { name: "empty", value: 100 - calcPourcRankUp(nameRankOverall, dataUser.ranks.overall.score), fill: "#38393b" },
    ];

    // create list progress bar rank up for all language
    const listBarRankLang = listRankLang.map((item) => {
        console.log(item);
        var valPourcRankUp = calcPourcRankUp(item.name, item.score);
        var nameRankUp = rankUpScore[rankUpScore.findIndex((rank) => rank.name === item.name) + 1].name;
        var colCurRank = rankUpScore[rankUpScore.findIndex((rank) => rank.name === item.name)].color;
        var colNextRank = rankUpScore[rankUpScore.findIndex((rank) => rank.name === item.name) + 1].color;
        var colProgressBar = rankUpScore[rankUpScore.findIndex((rank) => rank.name === item.name)].exaCol;

        console.log("col:", colCurRank, colNextRank);
        return (
            <div key={item.language} className="box-progress-bar">
                <ProgressBar bgcolor={colProgressBar} completed={valPourcRankUp} language={item.language} nameRank={item.name} colCurRank={colCurRank} colNextRank={colNextRank} nameRankUp={nameRankUp} />
            </div>
        );
    });

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
                    <span>
                        <p className="label-p">Clan : </p>
                        <p className="value-p">{dataUser.clan}</p>
                    </span>

                    <span>
                        <p className="label-p">Honor : </p>
                        <p className="value-p">{dataUser.honor.toLocaleString()}</p>
                    </span>

                    <span>
                        <p className="label-p">Completed Katas : </p>
                        <p className="value-p">{dataUser.challenges.totalCompleted.toLocaleString()}</p>
                    </span>
                    <span>
                        <p className="label-p">LeadBoard Position : </p>
                        <p className="value-p">{dataUser.position.toLocaleString()}</p>
                    </span>
                </div>
            </div>

            <div className="div-charts">
                <div className="div-pie-chart-overall-rank">
                    <h3>Rank Breakdown</h3>

                    <div className="div-box-rank">
                        <p>Next Rank </p>
                        <div className={"small-hex is-extra-wide " + colRankUp}>
                            <div className="inner-small-hex is-extra-wide">
                                <span>{nameRankOverall}</span>
                            </div>
                        </div>
                    </div>

                    <PieChart width={350} height={350}>
                        <Pie data={dataPieChartOverall} dataKey="value" cx={175} cy={120} innerRadius={70} outerRadius={90} stroke="none" startAngle={90} endAngle={-270} />
                    </PieChart>
                </div>

                <div className="div-progress-bar">
                    <h3>Languages Trained </h3>
                    {listBarRankLang}
                </div>

                <div className="div-kata-by-lang">
                    <h3>Number Kata by language</h3>
                    <BarChart data={arrKataByLangForm} layout="vertical" width={270} height={arrKataByLangForm.length * 40}>
                        <XAxis type="number" hide />
                        <YAxis type="category" width={80} dataKey="language" style={{ fill: "white" }} />
                        <Bar dataKey="nbKata" fill="#5a5b5e" label={CustomizedLabel} barSize={20} />
                    </BarChart>
                </div>
            </div>

            <div className="div-heat-map">
                <div className="box-heat-map">
                    <h3>Activity on CodeWars</h3>
                    <CalendarHeatmap
                        startDate={shiftDate(today, -365)}
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
                {/* <div className="box-btn-kata">
                    <h3>More details</h3>
                    <Button variant="outlined" size="large">
                        Completed Kata
                    </Button>
                    <Button variant="outlined" size="large">
                        Authored Kata
                    </Button>
                </div> */}
            </div>
        </div>
    );
}

export default UserStats;
