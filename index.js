async function GetJSON()
{
    return await fetch("source.json")
        .then((res) => res.json())
        .then((json) => {
            return json
        })
        .catch((e) => console.error(e));   
}
async function Render(week)
{
    const data = await GetJSON();

    //Fill out hours
    const hours = data["Hours"];
    var hoursString = "<tr><th style=\"color: gray;\">Week "+ (week + 1) +"</th>";
    for (let i = 0; i < hours.length; i++) { hoursString += "<th class=\"timetableBorder\">" + hours[i] + "</th>"; }
    hoursString += "</tr>";

    //Generate days
    const days = data["Days"];
    var daysString = hoursString;
    for (let i = 0; i < days.length; i++) {
        const day = days[i];
        daysString += "<tr>";
        daysString += "<th class=\"timetableBorder\">"+ day["Name"] +"</th>"

        //Classes
        const classes = day["Classes"];
        classes.sort((a, b) => a["Start"] - b["Start"])
        var classArrayIndex = 0;
        var ignoreColumnCount = 0;
        for (let e = 0; e < hours.length; e++) {
            var renderedClass = false;

            //Class
            if(classArrayIndex < classes.length)
            {
                const _class = classes[classArrayIndex];
                if(_class["Start"] == e)
                {
                    const required = _class["WeeksRequired"].includes(week);
                    const studying = _class["WeeksStudying"].includes(week);
                    const notRequired = _class["WeeksNotRequired"].includes(week);
                    const unknown = _class["WeeksUnknown"].includes(week);
                    if(required || studying || notRequired || unknown)
                    {
                        var id = "classRequired";
                        if(studying) { id = "classStudy"; }
                        else if(notRequired) { id = "classNotRequired"; }
                        else if(unknown) { id = "classUnknown"; }

                        // title="`+_class["Name"]+`"
                        daysString += `<td id="`+id+`" class="timetableBorder class" colspan="`+ _class["Span"] +`" title="`+ _class["Name"] +`">
                            <button onclick="alert('`+ _class["Name"] +`')">
                                <p>`+ _class["Name"] +`</p>
                                <p class="classInfo">`+ _class["Info"] +`</p>
                            </button>
                        </td>`;
                        ignoreColumnCount = _class["Span"] - 1;
                        renderedClass = true;
                    }
                    classArrayIndex++;
                }
            }

            //Empty cell
            if(!renderedClass)
            {
                if(ignoreColumnCount <= 0) { daysString += "<td></td>"; }
                else { ignoreColumnCount--; }
            }
        }
        daysString += "</tr>";
    }
    document.getElementById("timetable").innerHTML = daysString;
}
function UpdateWeek(updateBy)
{
    //Update week
    curWeek += updateBy;
    if(curWeek < 0) { curWeek = 0; }
    else if(curWeek > weekMax) { curWeek = weekMax; }

    //Update week text box
    date = new Date(weekStart);
    date.setDate(date.getDate() + curWeek * 7);
    const from = date.toWeekString();
    date.setDate(date.getDate() + 4);
    const to = date.toWeekString();
    document.getElementById("weekInfo").innerHTML = from + "  —  " + to;

    Render(curWeek);
}

function DiffWeeks(dt2, dt1) 
{
    // Calculate the difference in milliseconds between dt2 and dt1
    var diff =(dt2.getTime() - dt1.getTime()) / 1000;
    // Convert the difference from milliseconds to weeks by dividing it by the number of milliseconds in a week
    diff /= (60 * 60 * 24 * 7);
    // Return the absolute value of the rounded difference as the result
    return Math.abs(Math.round(diff));
}
function GetMonday(d) 
{
    d = new Date(d);
    var day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
    return new Date(d.setDate(diff));
}
Date.prototype.toWeekString = function() 
{
    var mm = this.getMonth() + 1;
    var dd = this.getDate();
    var year = this.getFullYear();
    return dd + ". " + mm + ". " + year;
};

function SetLightDarkMode(lightModeOn)
{
    if(lightModeOn)
    {
        document.getElementById("lightDarkModeSwitch").innerHTML = "🌘";

        document.documentElement.style.setProperty("--main-color", "white");
        document.documentElement.style.setProperty("--table-background-color", "rgb(247, 247, 247)");
        document.documentElement.style.setProperty("--table-border-color", "gray");
        document.documentElement.style.setProperty("--table-border-inside-color", "rgb(167, 167, 167)");
        document.documentElement.style.setProperty("--text-color", "black");
        document.documentElement.style.setProperty("--info-text-color", "rgba(0, 0, 0, 0.65)");
        document.documentElement.style.setProperty("--required", "rgb(255, 169, 169)");
        document.documentElement.style.setProperty("--studying", "rgb(255, 228, 110)");
        document.documentElement.style.setProperty("--not-required", "rgb(159, 255, 159)");
        document.documentElement.style.setProperty("--homework", "lightblue");
        document.documentElement.style.setProperty("--no-info", "rgb(255, 196, 240)");
        document.documentElement.style.setProperty("--week-info-background-hover", "lightgray");
        document.documentElement.style.setProperty("--week-info-background-active", "gray");
    }
    else
    {
        document.getElementById("lightDarkModeSwitch").innerHTML = "☀️";

        document.documentElement.style.setProperty("--main-color", "#181a1b");
        document.documentElement.style.setProperty("--table-background-color", "rgb(29, 31, 32)");
        document.documentElement.style.setProperty("--table-border-color", "rgb(84, 91, 94)");
        document.documentElement.style.setProperty("--table-border-inside-color", "#494f52");
        document.documentElement.style.setProperty("--text-color", "white");
        document.documentElement.style.setProperty("--info-text-color", "rgba(232, 230, 227, 0.65)");
        document.documentElement.style.setProperty("--required", "rgb(103, 0, 0)");
        document.documentElement.style.setProperty("--studying", "rgb(104, 84, 0)");
        document.documentElement.style.setProperty("--not-required", "rgb(27, 109, 0)");
        document.documentElement.style.setProperty("--homework", "#1b4958");
        document.documentElement.style.setProperty("--no-info", "rgb(86, 0, 64)");
        document.documentElement.style.setProperty("--week-info-background-hover", "rgb(51, 51, 51)");
        document.documentElement.style.setProperty("--week-info-background-active", "rgb(37, 37, 37)");
    }
    isLightModeOn = lightModeOn;
    localStorage.setItem("isLightModeOn", isLightModeOn);
}

//Get current week & hook up buttons
const weekStart = new Date(2024, 8, 30);
const weekMax = 12;
const curWeekActual = DiffWeeks(GetMonday(new Date()), weekStart);;

var curWeek = curWeekActual
document.getElementById("weekMinus").addEventListener("click", () => { UpdateWeek(-1); });
document.getElementById("weekPlus").addEventListener("click", () => { UpdateWeek(1); });
document.getElementById("weekInfo").addEventListener("click", () => { UpdateWeek(curWeekActual - curWeek) });

//First render
UpdateWeek(0);

//Light/Dark mode switcher
var isLightModeOn = (localStorage.getItem("isLightModeOn") === 'true');
if(isLightModeOn == null) { isLightModeOn = true; }
SetLightDarkMode(isLightModeOn);
document.getElementById("lightDarkModeSwitch").addEventListener("click", () => { SetLightDarkMode(!isLightModeOn); });