import { React, useState, useEffect } from "react";
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis } from "recharts";
import ProgressBar from "./progressBar";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import HeatMap from "./heatMap";
import InfosUser from "./infosUser";
import AOS from "aos";
import "aos/dist/aos.css";
import "./App.css";

AOS.init();

function UserStats() {
    const [topCallApi, setTopCallApi] = useState(false);
    const [userClan, setUserClan] = useState("");
    const [userPosition, setUserPosition] = useState("");
    const [userHonor, setUserHonor] = useState("");
    const [userCompletKata, setUserCompletKata] = useState("");
    const [rankOverall, setRankOverall] = useState("");
    const [listRankLang, setListRankLang] = useState([]);

    // arr for number of kata completed by language
    const [regroupDate, setRegroupDate] = useState([]);

    // arr for Kata completed by language
    const [arrKataByLang, setArrKataByLang] = useState({});

    const nameUser = JSON.parse(localStorage.getItem("User"));
    const urlBadgeUserUser = "https://www.codewars.com/users/" + nameUser.user + "/badges/large";

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

    useEffect(() => {
        if (topCallApi === false) {
            setTimeout(() => {
                // call function for retrieve data User with API
                retrieveData();
            }, 1000);
        }
    }, []);

    // call API for retrieve infos User
    async function retrieveData() {
        var cptPageChal = 0;
        var arrData = [];

        // call api for infos User
        try {
            const res = await axios.get("https://www.codewars.com/api/v1/users/" + nameUser.user, {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            });
            // assign infos user colect with API
            setUserClan(res.data.clan);
            setUserPosition(res.data.leaderboardPosition);
            setUserHonor(res.data.honor);
            setUserCompletKata(res.data.codeChallenges.totalCompleted);
            setRankOverall(res.data.ranks.overall);
            setListRankLang(res.data.ranks.languages);

            // define number of page in terms of number of completed challenge
            if (res.data.codeChallenges.totalCompleted < 201) {
                cptPageChal = 0;
            } else {
                cptPageChal = Math.floor(res.data.codeChallenges.totalCompleted / 200);
            }
        } catch (err) {
            console.log(err);
        }

        // call api for Challenges completed by user
        for (let x = 0; x < cptPageChal + 1; x++) {
            try {
                const res = await axios.get("https://www.codewars.com/api/v1/users/" + nameUser.user + "/code-challenges/completed?page=" + x, {
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                });

                // insert values in array for push in LocalStorage
                arrData = arrData.concat(res.data.data);
            } catch (err) {
                console.log(err);
            }
        }

        // Regroup Kata by Languages
        const arrKataByLang = arrData.reduce((group, elem) => {
            const completedLang = elem.completedLanguages;

            for (var x of completedLang) {
                group[x] = group[x] ?? [];
                group[x].push(elem.id);
            }

            return group;
        }, {});

        // Regroup challanges completed by date (day)
        const arrGroupByDate = arrData.reduce((group, elem) => {
            const completedAt = elem.completedAt.split("T")[0];

            group[completedAt] = group[completedAt] ?? [];
            group[completedAt].push(elem);
            return group;
        }, {});

        setArrKataByLang(arrKataByLang);
        setRegroupDate(arrGroupByDate);

        // display data and graph
        setTopCallApi(true);
    }

    var arrKataByLangForm = [];
    for (const [key, value] of Object.entries(arrKataByLang)) {
        arrKataByLangForm.push({ language: key, nbKata: value.length });
    }
    arrKataByLangForm = arrKataByLangForm.sort(function (a, b) {
        return a.nbKata - b.nbKata;
    });

    const CustomizedLabel = (props) => {
        const { x, y, value, width, height } = props;

        const fireOffset = x + width < 240;
        const offset = fireOffset ? -28 : 5;

        const fireOffset2 = value.toString().length === 1;
        const offset2 = fireOffset2 ? -10 : 0;

        return (
            <text x={x + width - offset + offset2} y={y + height - 3} fill={"white"} textAnchor="end">
                {value}
            </text>
        );
    };

    // Retreive name languages trained for the progress bar
    var arrRankLang = [];
    for (var key in listRankLang) {
        arrRankLang.push({ language: key, name: listRankLang[key].name, score: listRankLang[key].score, color: listRankLang[key].color });
    }
    arrRankLang = arrRankLang.sort(function (a, b) {
        return a.score - b.score;
    });

    if (topCallApi) {
        // image current rank

        if (rankOverall === "2 dan") {
            var colRankUp = "#555";
        } else {
            var colRankUp = rankUpScore[rankUpScore.findIndex((item) => item.name === rankOverall.name) + 1].color;
        }

        const calcPourcRankUp = (name, score) => {
            // name of rank
            const indexRank = rankUpScore.findIndex((item) => item.name === name);

            if (name === "2 dan") {
                pourRkUp = 100;
            } else {
                // calcul pourcentage rank Up
                var pourRkUp = ((score - rankUpScore[indexRank].score) * 100) / (rankUpScore[indexRank + 1].score - rankUpScore[indexRank].score);

                // round decimal superior  5.579 => 5.58
                pourRkUp = Math.round(pourRkUp * 100) / 100;
            }

            return pourRkUp;
        };

        // Data for pie charts Rank Overall
        var dataPieChartOverall = [
            { name: "Rank", value: calcPourcRankUp(rankOverall.name, rankOverall.score), fill: rankUpScore[rankUpScore.findIndex((rank) => rank.name === rankOverall.name)].exaCol },
            { name: "empty", value: 100 - calcPourcRankUp(rankOverall.name, rankOverall.score), fill: "#38393b" },
        ];

        // create list progress bar rank up for all language
        var listBarRankLang = arrRankLang.reverse().map((item) => {
            console.log("item", item);
            var valPourcRankUp = calcPourcRankUp(item.name, item.score);
            var nameRankUp = rankUpScore[rankUpScore.findIndex((rank) => rank.name === item.name) + 1].name;
            var colCurRank = rankUpScore[rankUpScore.findIndex((rank) => rank.name === item.name)].color;
            var colNextRank = rankUpScore[rankUpScore.findIndex((rank) => rank.name === item.name) + 1].color;
            var colProgressBar = rankUpScore[rankUpScore.findIndex((rank) => rank.name === item.name)].exaCol;

            return (
                <div key={item.language} className="box-progress-bar" data-aos="zoom-in" data-aos-delay="500" data-aos-duration="1500">
                    <ProgressBar bgcolor={colProgressBar} completed={valPourcRankUp} language={item.language} nameRank={item.name} colCurRank={colCurRank} colNextRank={colNextRank} nameRankUp={nameRankUp} />
                </div>
            );
        });
    }

    return !topCallApi ? (
        <>
            <CircularProgress />
        </>
    ) : (
        <div className="main-stats">
            <>
                <div className="div-user">
                    <InfosUser userName={nameUser.user} userClan={userClan} userHonor={userHonor} userCompletKata={userCompletKata} userPosition={userPosition} urlBadgeUserUser={urlBadgeUserUser} />
                </div>

                <div className="div-stats-user">
                    <div className="div-charts">
                        <div className="div-pie-chart-overall-rank" data-aos="zoom-in" data-aos-delay="500" data-aos-duration="1500">
                            <h3>Rank Breakdown</h3>

                            <div className="div-box-rank">
                                <p>Next Rank </p>
                                <div className={"small-hex is-extra-wide " + colRankUp}>
                                    <div className="inner-small-hex is-extra-wide">{<span>{rankUpScore[rankUpScore.findIndex((rank) => rank.name === rankOverall.name) + 1].name}</span>}</div>
                                </div>
                            </div>

                            <PieChart width={350} height={290}>
                                <Pie data={dataPieChartOverall} dataKey="value" cx={175} cy={120} innerRadius={70} outerRadius={90} stroke="none" startAngle={90} endAngle={-270} />
                            </PieChart>
                        </div>
                        <HeatMap regroupDate={regroupDate} />
                    </div>

                    <div className="div-heat-map">
                        <div className="div-progress-bar" data-aos="fade-up" data-aos-delay="500" data-aos-duration="1500">
                            <h3>Languages Trained</h3>
                            {listBarRankLang}
                        </div>

                        <div className="div-kata-by-lang" data-aos="fade-up" data-aos-delay="500" data-aos-duration="1500">
                            <h3>Completed Kata by language</h3>
                            <BarChart data={arrKataByLangForm.reverse()} layout="vertical" width={320} height={arrKataByLangForm.length * 37}>
                                <XAxis type="number" hide />
                                <YAxis type="category" width={80} dataKey="language" style={{ fill: "white" }} />
                                <Bar dataKey="nbKata" fill="rgb(0 0 0 / 43%)" label={CustomizedLabel} barSize={16} animationBegin={1000} animationDuration={2000} animationEasing="linear" radius={[0, 10, 10, 0]} />
                            </BarChart>
                        </div>
                    </div>
                </div>
            </>
        </div>
    );
}

export default UserStats;
