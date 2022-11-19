import { useState } from "react";
import { useNavigate, createSearchParams } from "react-router-dom";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import axios from "axios";

import "./App.css";

function Home(props) {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");

    // input userName
    const userNameChange = (e) => {
        setUsername(e.target.value);
    };

    // Submit Form Username
    const submitFormUsername = async () => {
        // remove all
        localStorage.clear();
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
    };

    return (
        <div className="main-home">
            <div className="header">
                <img src="https://www.codewars.com/packs/assets/logo.61192cf7.svg"></img>
                <h1>Codewars User Stats</h1>
            </div>
            <div className="text-field-username">
                <form noValidate autoComplete="off" onSubmit={submitFormUsername}>
                    <TextField required id="outlined-required" label="Enter Username" defaultValue="Kytox" onChange={userNameChange} />
                    <IconButton type="submit" sx={{ p: "5px" }} aria-label="search">
                        <SearchIcon />
                    </IconButton>
                </form>
            </div>
        </div>
    );
}

export default Home;
