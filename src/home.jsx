import { useState } from "react";
import { useNavigate, createSearchParams } from "react-router-dom";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import axios from "axios";
import Footer from "./footer";

import "./App.css";

function Home(props) {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [errApi, setErrApi] = useState(false);

    // input userName
    const userNameChange = (e) => {
        setUsername(e.target.value);
    };

    // Submit Form Username
    const submitFormUsername = async (event) => {
        event.preventDefault();
        // remove all
        var topCall = 0;
        localStorage.clear();

        try {
            await axios.get("https://www.codewars.com/api/v1/users/" + username, {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            });
            topCall = 1;
        } catch (err) {
            setErrApi(true);
            console.log("err");
        }

        if (topCall === 1) {
            localStorage.setItem(
                "User",
                JSON.stringify({
                    user: username,
                })
            );

            // 👇️ redirect to /stats
            navigate({
                pathname: "/stats",
                search: `?${createSearchParams({
                    user: username,
                })}`,
            });
        }
    };

    return (
        <div className="main-home">
            <div className="header">
                <img src="https://www.codewars.com/packs/assets/logo.61192cf7.svg"></img>
                <h1>Codewars User Stats</h1>
                <h2>Tool to have a little more details on your Codewars stats</h2>
            </div>
            <div className="text-field-username">
                {errApi ? (
                    <form noValidate autoComplete="off" onSubmit={submitFormUsername}>
                        <TextField required error id="outlined-error-helper-text" label="Error" helperText="Username does not exist in Codewars" onChange={userNameChange} />
                        <IconButton type="submit" sx={{ p: "5px" }} aria-label="search">
                            <SearchIcon />
                        </IconButton>
                    </form>
                ) : (
                    <form noValidate autoComplete="off" onSubmit={submitFormUsername}>
                        <TextField required id="outlined-required" label="Enter Username" onChange={userNameChange} />
                        <IconButton type="submit" sx={{ p: "5px" }} aria-label="search">
                            <SearchIcon />
                        </IconButton>
                    </form>
                )}
            </div>
            <Footer />
        </div>
    );
}

export default Home;
