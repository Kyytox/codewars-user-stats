import { React } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import ReactTooltip from "react-tooltip";

import "./react-calendar-heatmap.css";

function HeatMap(props) {
    const dataHeatMap = [];
    const today = new Date();

    function shiftDate(date, numDays) {
        const newDate = new Date(date);
        newDate.setDate(newDate.getDate() + numDays);
        return newDate;
    }

    // create array with date and number of completed Kata
    for (var y = 0; y <= 365; y++) {
        var dateKata = shiftDate(today, -y);

        // format Date ( YYYY-MM-DD )
        dateKata = String(dateKata.toLocaleDateString("fr-FR", { year: "numeric", month: "numeric", day: "numeric" }))
            .split("/")
            .reverse()
            .join("-");

        // add date and number kata completed by date
        if (dateKata in props.regroupDate) {
            dataHeatMap.push({ date: dateKata, count: props.regroupDate[dateKata].length });
        } else {
            dataHeatMap.push({ date: dateKata, count: 0 });
        }
    }

    return (
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
    );
}

export default HeatMap;
