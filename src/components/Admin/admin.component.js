import React, {useEffect, useState} from "react";
import "../index.css";
import {Header} from "../Header/header.component";

function changeTab(tabName) {

    const contentSections = document.querySelectorAll('.content');
    contentSections.forEach(section => {
        section.style.display = 'none';
    });

    const selectedContent = document.getElementById(`${tabName}Content`);
    selectedContent.style.display = 'block';
}


export function Admin() {
    //trains
    const [trainName, setTrainName] = useState('');
    const [trainNumber, setTrainNumber] = useState('');
    const [standardSeatsCount, setStandardSeatsCount] = useState('');
    const [standardPrice, setStandardPrice] = useState('');
    const [firstSeatsCount, setFirstSeatsCount] = useState('');
    const [firstPrice, setFirstPrice] = useState('');
    //routes
    const [departureCity, setDepartureCity] = useState('');
    const [destinationCity, setDestinationCity] = useState('');
    const [departureTime, setDepartureTime] = useState('');
    const [arrivalTime, setArrivalTime] = useState('');
    //routes
    const [departureCities, setDepartureCities] = useState([]);
    const [destinationCities, setDestinationCities] = useState([]);
    const [availableTimes, setAvailableTimes] = useState([]);
    const [trains, setTrains] = useState([]);
    const [tripDate, setTripDate] = useState('');
    const [chosenTrainId, setChosenTrainId] = useState('');
    const [chosenRouteId, setChosenRouteId] = useState('');
    //issues
    const [issues, setIssues] = useState([]);
    //delete user
    const [deleteUsername, setDeleteUsername] = useState('');

    const userId = localStorage.getItem("userId")


    useEffect(() => {
        fetch('/routes/departure')
            .then((response) => response.json())
            .then((data) => {
                setDepartureCities(data.cities)
            })
            .catch((error) => console.error('Error fetching data:', error));
    }, [])

    useEffect(() => {
        fetch('/routes/destination')
            .then((response) => response.json())
            .then((data) => {
                setDestinationCities(data.cities)
            })
            .catch((error) => console.error('Error fetching data:', error));
    }, [])

    useEffect(() => {
        fetch('/admin/trains')
            .then((response) => response.json())
            .then((data) => {
                setTrains(data)
            })
            .catch((error) => console.error('Error fetching data:', error));
    }, [])

    const fetchIssues = () => {
        fetch('/admin/issues')
            .then((response) => response.json())
            .then((data) => {
                setIssues(data);
            })
            .catch((error) => console.error('Error fetching data:', error));
    };

    useEffect(() => {
        fetchIssues();
    }, []);

    const resetTrainStates = () => {
        console.log("Resetting states...");
        setTrainName('');
        setTrainNumber('');
        setStandardSeatsCount('');
        setStandardPrice('');
        setFirstSeatsCount('');
        setFirstPrice('');
    };

    const resetRouteStates = () => {
        console.log("Resetting states...");
        
        setDepartureTime('');
        setArrivalTime('');
    };


    const addTrain = (e) => {
        e.preventDefault();

        const trainSeats = [{
            seatClass: "Standard",
            seatsCount: standardSeatsCount,
            price: standardPrice
        }, {
            seatClass: "1st class",
            seatsCount: firstSeatsCount,
            price: firstPrice
        }]

        const addTrainRequest = {
            name: trainName,
            number: trainNumber,
            trainSeats: trainSeats
        };

        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(addTrainRequest)
        };

        fetch("/admin/trains", requestOptions)
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    throw new Error(`Request failed with status ${response.status}`);
                }
            })
            .then((data) => {
                resetTrainStates();
                alert('New train was successfully added.');
            })
            .catch((error) => {
                resetTrainStates();
                console.error('Error fetching data:', error)
            });

    }

    const addRoute = (e) => {
        e.preventDefault();
        console.log(chosenRouteId + " " + chosenTrainId)

        const addRouteRequest = {
            departureCity: departureCity,
            destinationCity: destinationCity,
            departureTime: departureTime,
            arrivalTime: arrivalTime
        };

        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(addRouteRequest)
        };

        fetch("/admin/routes", requestOptions)
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    throw new Error(`Request failed with status ${response.status}`);
                }
            })
            .then((data) => {
                resetRouteStates();
                alert('New route was successfully added.');
            })
            .catch((error) => {
                resetRouteStates();
                console.error('Error fetching data:', error)
            });
    }


    function getAvailableTimes(departure, destination) {
        const requestOptions = {
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        };

        fetch(`/admin/routes?departure=${departure}&destination=${destination}`, requestOptions)
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    throw new Error(`Request failed with status ${response.status}`);
                }
            })
            .then((data) => {
                console.log(JSON.stringify(data))
                setAvailableTimes(data);
            })
            .catch((error) => {
                resetRouteStates();
                console.error('Error fetching data:', error)
            });

    }

    const showAvailableTimes = (e) => {
        e.preventDefault();
        if (departureCity !== '' && destinationCity !== '') {
            if (departureCity === destinationCity) {
                alert("Cities must not be the same!")
            }

            console.log(departureCity + "-" + destinationCity)

            getAvailableTimes(departureCity, destinationCity)

        } else {
            alert("Choose cities please!")
        }
    }

    const addTrip = (e) => {
        e.preventDefault();

        if (chosenRouteId === '' || departureCity === '' || chosenTrainId === '' || destinationCity === '' || destinationCity === '') {
            alert("Please provide all the required information!")
        }

        console.log(departureCity);
        console.log(destinationCity)
        console.log(chosenRouteId);
        console.log(tripDate);
        console.log(chosenTrainId);

        const addTripRequest = {
            routeId: chosenRouteId,
            date: tripDate,
            trainId: chosenTrainId
        };

        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(addTripRequest)
        };

        fetch("/admin/trips", requestOptions)
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    throw new Error(`Request failed with status ${response.status}`);
                }
            })
            .then((data) => {
                alert('New trip was successfully added.');
            })
            .catch((error) => {
                console.error('Error fetching data:', error)
            });
    }

    const resolveIssue = (e, id) => {
        e.preventDefault();

        const requestOptions = {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
        };

        fetch(`/admin/issues?id=${id}`, requestOptions)
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    throw new Error(`Request failed with status ${response.status}`);
                }
            })
            .then((data) => {
                fetchIssues();
                alert('Issue was successfully resolved and closed.');
            })
            .catch((error) => {
                console.error('Error fetching data:', error)
            });

    }

    const handleDeleteUser = (e) => {
        e.preventDefault();

        const requestOptions = {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
        };

        fetch(`/admin/users?username=${deleteUsername}`, requestOptions)
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    throw new Error(`Request failed with status ${response.status}`);
                }
            })
            .then((data) => {
                setDeleteUsername('');
                alert('User was successfully deleted.');
            })
            .catch((error) => {
                console.error('Error fetching data:', error)
            });
    };

    if(userId === "1") {
        return (
            <body>
            <Header/>
            <main>
                <section className="tabs">
                    <div className="tab-container">
                        <button className="tab" onClick={() => changeTab('routes')}>Routes</button>
                        <button className="tab" onClick={() => changeTab('trips')}>Trips</button>
                        <button className="tab" onClick={() => changeTab('trains')}>Trains</button>
                        <button className="tab" onClick={() => changeTab('userIssues')}>User issues</button>
                        <button className="tab" onClick={() => changeTab('deleteUser')}>Block user</button>
                    </div>
                </section>
                <div className="trips-container">
                    <section className="content" id="routesContent">
                        <div className="add-route-form">
                            <h2>Add New Route</h2>
                            <form id="addNewRoute" onSubmit={addRoute}>
                                <div className="form-group">
                                    <input type="text" id="departureCity" name="departureCity" placeholder="Departure"
                                           value={departureCity} onChange={(e) => {
                                        setDepartureCity(e.target.value)
                                    }} required/>
                                </div>
                                <div className="form-group">
                                    <input type="text" id="destinationCity" name="destinationCity" placeholder="Destination"
                                           value={destinationCity} onChange={(e) => {
                                        setDestinationCity(e.target.value)
                                    }} required/>
                                </div>
                                <div className="form-group">
                                    <a>Departure Time:</a>
                                    <input type="time" id="departureTime" name="departureTime" value={departureTime}
                                           onChange={(e) => {
                                               setDepartureTime(e.target.value)
                                           }} required/>
                                </div>
                                <div className="form-group">
                                    <a>Arrival Time:</a>
                                    <input type="time" id="arrivalTime" name="arrivalTime" value={arrivalTime}
                                           onChange={(e) => {
                                               setArrivalTime(e.target.value)
                                           }} required/>
                                </div>
                                <button type="submit">Add Route</button>
                            </form>
                        </div>
                    </section>
                    <section className="content" id="tripsContent">
                        <div className="add-trip-form">
                            <h2>Add New Trip</h2>
                            <form id="addTripForm" onSubmit={addTrip}>
                                <label htmlFor="departureCity">Departure City:</label>
                                <select className="admin-select" id="departureCity" name="departureCity" value={departureCity} onChange={(e) => {
                                    setDepartureCity(e.target.value)
                                }}>
                                    <option value="">-</option>
                                    {departureCities.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                                <label htmlFor="destinationCity">Destination City:</label>
                                <select className="admin-select" id="destinationCity" name="destinationCity" value={destinationCity}
                                        onChange={(e) => {
                                            setDestinationCity(e.target.value)
                                        }}>
                                    <option value="">-</option>
                                    {destinationCities.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>))}
                                </select>
                                <button className="admin-select" type="button" onClick={showAvailableTimes}>See Available Time</button>
                                <div id="timesDropdown">
                                    <label htmlFor="availableTimes">Available Times:</label>
                                    <select className="admin-select" id="availableTimes" name="availableTimes" value={chosenRouteId}
                                            onChange={(e) => {
                                                console.log(e.target.value)
                                                setChosenRouteId(e.target.value);
                                            }}>
                                        {availableTimes.map((option) => (
                                            <option key={option.id} value={option.id}>
                                                {option.departureTime}-{option.arrivalTime}
                                            </option>))}
                                    </select>
                                </div>
                                <label htmlFor="tripDate">Trip Date:</label>
                                <input className="admin-select"
                                       type="date"
                                       id="tripDate"
                                       name="tripDate"
                                       value={tripDate}
                                       onChange={(e) => {
                                           setTripDate(e.target.value);
                                       }}
                                       required
                                />
                                <label htmlFor="chooseTrain">Choose Train:</label>
                                <select
                                    className="admin-select"
                                    id="chooseTrain"
                                    name="chooseTrain"
                                    value={chosenTrainId}
                                    onChange={(e) => {
                                        console.log(e.target.value)
                                        setChosenTrainId(e.target.value);
                                    }}>
                                    <option value="">-</option>
                                    {trains.map((train) => (
                                        <option key={train.id} value={train.id}>
                                            {train.name} (#{train.number})
                                        </option>
                                    ))}
                                </select>
                                <button type="submit">Add New Trip</button>
                            </form>
                        </div>
                    </section>
                    <section className="content" id="trainsContent">
                        <div className="add-train-form">
                            <h2>Add New Train</h2>
                            <form id="addNewTrain" onSubmit={addTrain}>
                                <div className="form-group">
                                    <input type="text" id="trainName" name="trainName" placeholder="Name" value={trainName}
                                           onChange={(e) => {
                                               setTrainName(e.target.value)
                                           }} required/>
                                </div>
                                <div className="form-group">
                                    <input type="text" id="trainNumber" name="trainNumber" placeholder="Number"
                                           value={trainNumber}
                                           onChange={(e) => {
                                               setTrainNumber(e.target.value)
                                           }} required/>
                                </div>
                                <div className="form-group">
                                    <h3>Standard Class</h3>
                                    <input className="admin-select" type="number" id="standardSeatsCount" name="standardSeatsCount"
                                           placeholder="Seats count" value={standardSeatsCount}
                                           onChange={(e) => {
                                               setStandardSeatsCount(e.target.value)
                                           }} required/>
                                    <input type="number" id="standardPrice" name="standardPrice" value={standardPrice}
                                           onChange={(e) => {
                                               setStandardPrice(e.target.value)
                                           }} placeholder="Price"
                                           required/>
                                </div>
                                <div className="form-group">
                                    <h3>1st Class</h3>
                                    <input className="admin-select" type="number" id="firstClassSeatsCount" name="firstClassSeatsCount"
                                           placeholder="Seats count" value={firstSeatsCount}
                                           onChange={(e) => {
                                               setFirstSeatsCount(e.target.value)
                                           }} required/>
                                    <input type="number" id="standardPrice" name="standardPrice" placeholder="Price"
                                           value={firstPrice}
                                           onChange={(e) => {
                                               setFirstPrice(e.target.value)
                                           }} required/>
                                </div>
                                <button type="submit">Add Train</button>
                            </form>
                        </div>
                    </section>
                    <section className="content" id="userIssuesContent">
                        {issues.map((issue) => (
                            <div className="user-issues-block" key={issue.id}>
                                <h2>User Issue #{issue.id}</h2>
                                <p>There is an issue reported by a user. Please review and resolve:</p>
                                <div className="issue-details">
                                    <p>Issue: {issue.message}</p>
                                </div>
                                <button onClick={(e) => resolveIssue(e, issue.id)}>Resolve</button>
                            </div>
                        ))}
                    </section>

                    <section className="content" id="deleteUserContent">
                        <h2>Block User</h2>
                        <div className="delete-user-form">
                            <input
                                className="admin-select"
                                type="text"
                                id="username"
                                name="username"
                                placeholder="Username"
                                value={deleteUsername}
                                onChange={(e) => setDeleteUsername(e.target.value)}
                            />
                            <button onClick={handleDeleteUser}>Block</button>
                        </div>
                    </section>
                </div>
            </main>
            </body>
        )
    }
}
