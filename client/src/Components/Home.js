import { useState } from "react" 
import VacaName from "./VacaName"
import ActivityItem from "./ActivityItem"

function Home({ userId, vacationList, handleAddVaca, handleVacaPatch, handleDeleteVaca, getActivities, activitiesList, handleAddActivity})
{

    const [vacationInput, setVacationInput] = useState("")
    function handleVacationInput(e)
    {
        setVacationInput(e.target.value)
    }

    function handleAddVacation()
    {
        const vacation = {vacationName: vacationInput}
        fetch("/vacations", 
        {
            method: 'POST',
            headers: 
            {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(vacation)
        })
        .then(resp => resp.json())
        .then(data => 
        {
            handleAddVaca(data)
            const userVaca = 
            {
                user_id: userId,
                vacation_id: data.id
            }

            fetch("/user_vacations", 
            {
                method: 'POST',
                headers: 
                {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userVaca)
            })
            .then(resp => resp.json())
        })
    }

    const vacaNameList = vacationList.map((item) =>
    {
        return (
            <VacaName item={ item } clickVacation={ clickVacation }/>
        )
    })

    const [isDetails, setIsDetails] = useState(false)
    const [selectedVaca, setSelectedVaca] = useState("")

    function clickVacation(e)
    {
        setIsDetails(true)

        const findVaca = vacationList.find((item) => item.id == e)

        setSelectedVaca(findVaca)
        getActivities(e)
    }

    function goBack()
    {
        setIsDetails(false)
        setIsEdit(false)
    }

    const [isEdit, setIsEdit] = useState(false)
    function edit()
    {
        setIsEdit((isEdit) => isEdit = !isEdit)
    }

    const [vacaPatch, setVacaPatch] = useState("")

    function handleEditVaca(e)
    {
        setVacaPatch(e.target.value)
    }

    function submitEditVaca(e)
    {
        const vacaPatchData =
        {
            vacationName: vacaPatch,
            flightToArrive: "",
            flightToLeave: "",
            hotelCheckIn: "",
            hotelCheckOut: ""
        }


        fetch(`/vacations/${selectedVaca.id}`,
        {
            method: "PATCH",
            headers:
            {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(vacaPatchData)
        })
        .then(resp => resp.json())
        .then(data => 
        {
            handleVacaPatch(data)
            // setIsEdit(false)
        })
    }

    function deleteVaca()
    {
        fetch(`/vacations/${selectedVaca.id}`, {
            method: "DELETE",
          })
        .then((res) => res.json())
        .then((data) => handleDeleteVaca(data));
    }

    const [vacaDetails, setVacaDetails] = useState({flightToArrive: "", flightToLeave: "", hotelCheckIn: "", hotelCheckOut: ""})

    function handleDetailInput(e)
    {
        setVacaDetails({...vacaDetails, [e.target.name]: e.target.value})
    }

    function submitVacaDetails(e)
    {
        e.preventDefault()
        const detailData = 
        {
            vacationName: selectedVaca.vacationName,
            flightToArrive: vacaDetails.flightToArrive,
            flightToLeave: vacaDetails.flightToLeave,
            hotelCheckIn: vacaDetails.hotelCheckIn,
            hotelCheckOut: vacaDetails.hotelCheckOut
        }

        fetch(`/vacations/${selectedVaca.id}`,
        {
            method: "PATCH",
            headers:
            {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(detailData)
        })
        .then(resp => resp.json())
        .then(data => 
        {
            handleVacaPatch(data)
        })
    }

    const [actName, setActName] = useState("")

    function handleActivityInput(e)
    {
        setActName(e.target.value)
    }

    function submitActivity()
    {
        const activity = {activityName: actName}
        fetch("/activities", 
        {
            method: 'POST',
            headers: 
            {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(activity)
        })
        .then(resp => resp.json())
        .then(data => 
        {
            handleAddActivity(data)
            const vacaAct = 
            {
                vacation_id: 9,
                activity_id: data.id
            }

            fetch("/vacation_activities", 
            {
                method: 'POST',
                headers: 
                {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(vacaAct)
            })
            .then(resp => resp.json())
        })
    }

    const dispActivities = activitiesList.map((item) =>
    {
        return (
            <ActivityItem item={ item }/>
        )
    })

    return (
        <div id="home">
            <h1>home</h1>
            { isDetails ?
                <div>
                    <h2>Vacation Details</h2>
                    <button onClick={ goBack }>Go back</button>
                    { isEdit ?
                        <div>
                            <button onClick={ edit }>Unedit</button>
                            <input onChange={ handleEditVaca }/>
                            <button onClick={ submitEditVaca }>Submit</button>
                            <button onClick={ deleteVaca }>Delete</button>
                        </div>
                    :
                        <div>
                            <button onClick={ edit }>Edit</button>
                            { selectedVaca.vacationName }
                            { selectedVaca.id }
                            <form onSubmit={ submitVacaDetails}>
                                <label>
                                    Departing flight:
                                    <input name="flightToArrive" onChange={ handleDetailInput } placeholder="yyyy/mm/dd"/>
                                </label>
                                <label>
                                    Arriving flight:
                                    <input name="flightToLeave" onChange={ handleDetailInput } placeholder="yyyy/mm/dd"/>
                                </label>
                                <label>
                                    Hotel check-in:
                                    <input name="hotelCheckIn" onChange={ handleDetailInput } placeholder="Enter..."/>
                                </label>
                                <label>
                                    Hotel check-outd:
                                    <input name="hotelCheckOut" onChange={ handleDetailInput } placeholder="Enter..."/>
                                </label>
                                <button>Submit</button>
                            </form>

                            <h5>Departing flight: { selectedVaca.flightToArrive }</h5>
                            <h5>Arrive flight: { selectedVaca.flightToLeave }</h5>
                            <h5>Hotel check-in: { selectedVaca.hotelCheckIn }</h5>
                            <h5>Hotel check-out: { selectedVaca.hotelCheckOut }</h5>

                            <h2>Activities</h2>
                            <h3>Add activity</h3>
                            <label>
                                Activity name:
                                <input onChange={ handleActivityInput }/>
                                <button onClick={ submitActivity }>Submit</button>
                            </label>
                        
                            <ul>
                                { dispActivities }
                            </ul>
                        </div>
                    }
                </div>
            :
                <div>
                    <input onChange={ handleVacationInput }></input>
                    <button onClick={ handleAddVacation }>Add vacation</button>
                    <ul>
                        { vacaNameList }
                    </ul>
                </div>
            }
        </div>
    )
}
export default Home