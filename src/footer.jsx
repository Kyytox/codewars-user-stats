import { React } from "react";
import GitHubIcon from "@mui/icons-material/GitHub";

function Footer() {
    return (
        <div className="footer">
            <p>Dev by Kytox</p>
            <a href="https://github.com/Kyytox/codewars-user-stats">
                <GitHubIcon />
            </a>
        </div>
    );
}

export default Footer;
