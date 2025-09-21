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
        for (let e = 0; e < hours.length; e++) {
            var renderedClass = false;

            //Class
            for (let g = 0; g < classes.length; g++) {
                const _class = classes[g];
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
                        daysString += `<td id="`+id+`" class="timetableBorder class" title="`+ _class["Name"] +`">
                            <button onclick="alert('`+ _class["Name"] +`')">
                                <p>`+ _class["Name"] +`</p>
                                <p class="classInfo">`+ _class["Info"] +`</p>
                            </button>
                        </td>`;
                        renderedClass = true;
                    }
                }
            }

            //Empty cell
            if(!renderedClass) { daysString += "<td></td>"; }
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
Number.prototype.clamp = function(min, max) {
  return Math.min(Math.max(this, min), max);
};
function DiffWeeks(dt2, dt1) 
{
    // Calculate the difference in milliseconds between dt2 and dt1
    var diff =(dt2.getTime() - dt1.getTime()) / 1000;
    // Convert the difference from milliseconds to weeks by dividing it by the number of milliseconds in a week
    diff /= (60 * 60 * 24 * 7);
    // Return the rounded difference as the result
    return Math.round(diff); //? Clamping introduces an issue with weekend skipping and it seems to work without it so 🤷
}
function GetMonday(d)
{
    var tmp = d;
    d = new Date(today);
    var distance = tmp - d.getDay();
    d.setDate(d.getDate() + distance);

    var day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
    d.setDate(diff)
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
        document.documentElement.style.setProperty("--not-required", "#79de79");
        document.documentElement.style.setProperty("--no-info", "#C3B1E1");
        document.documentElement.style.setProperty("--homework", "#a8e4ef");

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

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js')
    .then((registration) => {
      console.log('Service Worker registered with scope:', registration.scope);
    })
    .catch((error) => {
      console.error('Service Worker registration failed:', error);
    });
}

//Get current week & hook up buttons
const today = new Date(2025, 8, 22); //! CLEAR THIS
const weekStart = new Date(2025, 8, 22);
const weekMax = 15; //? There's 16 weeks altogether so max index is 15
var curWeekActual = DiffWeeks(GetMonday(today.getDay()), weekStart);
const curWeekDay = today.getDay();
if(curWeekDay > 5 || curWeekDay == 0) { curWeekActual++; } //It's the weekend -> Skip to next week

var curWeek = curWeekActual
document.getElementById("weekMinus").addEventListener("click", () => { UpdateWeek(-1); });
document.getElementById("weekPlus").addEventListener("click", () => { UpdateWeek(1); });
document.getElementById("weekInfo").addEventListener("click", () => { UpdateWeek(curWeekActual - curWeek) });

//First render
UpdateWeek(0);

//Light/Dark mode switcher
var isLightModeOn = (localStorage.getItem("isLightModeOn") === 'true');
if(isLightModeOn == null) { isLightModeOn = true; }
if(today.getHours() >= 17) { isLightModeOn = false; } // Auto light mode
SetLightDarkMode(isLightModeOn);
document.getElementById("lightDarkModeSwitch").addEventListener("click", () => { SetLightDarkMode(!isLightModeOn); });