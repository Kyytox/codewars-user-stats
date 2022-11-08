import { useState } from "react";
import "./App.css";

function UserStats() {
    const [dataUser, setDataUser] = useState(
        JSON.parse(localStorage.getItem("dataUser")) || false
    );

    return <div>{dataUser.ranks.overall.rank}</div>;
}

export default UserStats;
