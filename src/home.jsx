import { useState } from "react";
import { useNavigate, createSearchParams } from "react-router-dom";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import "./App.css";

function Home(props) {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");

    const [isLoading, setIsLoading] = useState(false);

    // input userName
    const userNameChange = (e) => {
        setUsername(e.target.value);
    };

    // Submit Form Username
    const submitFormUsername = async () => {
        // remove all
        localStorage.clear();
        console.log("username", username);
        var cptPageChal = 0;
        var arrData = [];
        var nbPages = 0;

        setIsLoading(true);

        // call api for infos User
        try {
            const res = await axios.get("https://www.codewars.com/api/v1/users/" + username, {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            });
            // insert in LocalStorage infos user colect with API
            console.log("res:", res.data);
            localStorage.setItem(
                "dataUser",
                JSON.stringify({
                    user: username,
                    honor: res.data.honor,
                    position: res.data.leaderboardPosition,
                    ranks: res.data.ranks,
                    clan: res.data.clan,
                    challenges: res.data.codeChallenges,
                    skills: res.data.skills,
                })
            );

            // define number of page in fonction of number of completed challenge
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
                const res = await axios.get("https://www.codewars.com/api/v1/users/" + username + "/code-challenges/completed?page=" + x, {
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                });
                console.log("res:", res.data);
                // insert values in array for push in LocalStorage
                arrData.push(res.data.data);
                nbPages = res.data.totalPages;
            } catch (err) {
                console.log(err);
            }
        }

        arrData = arrData[0];

        // Regroup challanges completed by date (day)
        const arrGroupByDate = arrData.reduce((group, elem) => {
            const completedAt = elem.completedAt.split("T")[0];
            console.log(completedAt);

            group[completedAt] = group[completedAt] ?? [];
            group[completedAt].push(elem);
            return group;
        }, {});

        // insert in LocalStorage element colect with API if nb pages > 0
        if (nbPages > 0) {
            localStorage.setItem(
                "completedChallenges",
                JSON.stringify({
                    totalPages: nbPages,
                    data: arrData,
                    regroupDate: arrGroupByDate,
                })
            );
        }

        // 👇️ redirect to /stats
        navigate({
            pathname: "/stats",
            search: `?${createSearchParams({
                user: username,
            })}`,
        });
    };

    return (
        <div className="main-home">
            <div className="header">
                <img src="https://www.codewars.com/packs/assets/logo.61192cf7.svg"></img>
                <h1>Codewars User Stats</h1>
            </div>
            {isLoading ? (
                <h2>
                    <CircularProgress />
                </h2>
            ) : (
                <div className="text-field-username">
                    <form noValidate autoComplete="off" onSubmit={submitFormUsername}>
                        <TextField required id="outlined-required" label="Enter Username" defaultValue="Kytox" onChange={userNameChange} />
                        <IconButton type="submit" sx={{ p: "5px" }} aria-label="search">
                            <SearchIcon />
                        </IconButton>
                    </form>
                </div>
            )}
        </div>
    );
}

export default Home;
