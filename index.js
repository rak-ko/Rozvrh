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

                        daysString += `<td id="`+id+`" class="timetableBorder class" colspan="`+ _class["Span"] +`" title="`+_class["Name"]+`" >
                            <p>`+ _class["Name"] +`</p>
                            <p class="classInfo">`+ _class["Info"] +`</p>
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

//Tooltip
document.body.addEventListener('touchstart', function() {
    document.body.classList.add('touched');
});