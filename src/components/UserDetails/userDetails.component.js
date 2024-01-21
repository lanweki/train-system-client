import React, {useEffect, useState} from "react";
import "../index.css";
import {Header} from "../Header/header.component";
import {AdditionalInfo} from "../AdditionalInfo/additionalInfo.component";
import {Footer} from "../Footer/footer.component";


export function UserDetails() {
    const [userDetails, setUserDetails] = useState([]);
    const [upcomingTrips, setUpcomingTrips] = useState([]);
    const [pastTrips, setPastTrips] = useState([]);

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [issueText, setIssueText] = useState('');
    const [repeatedNewPassword, setRepeatedNewPassword] = useState('');

    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const [success, setSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    function changeTab(tabName) {
        resetStates();
        setError(false);
        setSuccess(false);
        const contentSections = document.querySelectorAll('.content');
        contentSections.forEach(section => {
            section.style.display = 'none';
        });

        const selectedContent = document.getElementById(`${tabName}Content`);
        selectedContent.style.display = 'block';
    }

    useEffect(() => {
        const userId = localStorage.getItem("userId");

        const requestOptions = {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
        };

        fetch(`/users/${userId}/details`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setUserDetails(data);
            })
            .catch((error) => console.error('Error fetching data:', error));
    }, [])


    const retrieveUpcomingTrips = () => {
        const userId = localStorage.getItem("userId");

        const requestOptions = {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
        };

        fetch(`/bookings/upcoming?userId=${userId}`, requestOptions)
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    throw new Error(`Request failed with status ${response.status}`);
                }
            })
            .then((data) => {
                setUpcomingTrips(data);
                console.log(data);
            })
            .catch((error) => console.error('Error fetching data:', error));
    }

    useEffect(() => {
        retrieveUpcomingTrips();
    }, []);


    useEffect(() => {
        const userId = localStorage.getItem("userId");

        const requestOptions = {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
        };

        fetch(`/bookings/past?userId=${userId}`, requestOptions)
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    throw new Error(`Request failed with status ${response.status}`);
                }
            })
            .then((data) => {
                setPastTrips(data);
                console.log(data);
            })
            .catch((error) => console.error('Error fetching data:', error));
    }, [])

    const resetStates = () => {
        console.log("Resetting states...");
        setNewPassword('');
        setOldPassword('');
        setRepeatedNewPassword('');
    };


    const handleChangePassword = (e) => {
        e.preventDefault();

        if (newPassword !== repeatedNewPassword) {
            setError(true);
            setErrorMessage('Passwords do not match. Please try again.');
            resetStates()
        } else {
            const userId = localStorage.getItem("userId");

            const changePasswordRequest = {
                userId: userId,
                oldPassword: oldPassword,
                newPassword: newPassword,
            };

            console.log(JSON.stringify(changePasswordRequest))

            const requestOptions = {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(changePasswordRequest)
            };

            fetch("/users/password/change", requestOptions)
                .then((response) => {
                    if (response.status === 200) {
                        return response.json();
                    } else {
                        setError(true);
                        setErrorMessage('Provided old password is incorrect.');
                        throw new Error(`Request failed with status ${response.status}`);
                    }
                })
                .then((data) => {
                    resetStates();
                    setSuccess(true);
                    setSuccessMessage('Password was successfully changed.');
                })
                .catch((error) => {
                    resetStates();
                    console.error('Error fetching data:', error)
                });
        }
    }

    const addUserIssue = (e) => {
        e.preventDefault();

        const userId = localStorage.getItem("userId");
        console.log(issueText);
        const issueRequest = {
            userId: userId,
            message: issueText,
        };

        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(issueRequest)
        };

        fetch("/users/issues", requestOptions)
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    throw new Error(`Request failed with status ${response.status}`);
                }
            })
            .then((data) => {
                setIssueText('');
                setSuccess(true);
                setSuccessMessage('New issue has been reported.');
            })
            .catch((error) => {
                setIssueText('');
                console.error('Error fetching data:', error)
            });
    }

    const handleCancel = (e, tripId) => {
        e.preventDefault();

        const confirmed = window.confirm("Are you sure you want to cancel this trip?");

        if (confirmed) {
            const requestOptions = {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'},
            };

            fetch(`/bookings?id=${tripId}`, requestOptions)
                .then((response) => {
                    if (response.status === 200) {
                        return response.json();
                    } else {
                        throw new Error(`Request failed with status ${response.status}`);
                    }
                })
                .then((data) => {
                    retrieveUpcomingTrips();
                    alert("Trip was successfully canceled.")
                })
                .catch((error) => {
                    setIssueText('');
                    console.error('Error fetching data:', error)
                });
        }
    };

    return (


        <body>
        <Header/>
        <main>
            <section className="tabs">
                <div className="tab-container">
                    <button className="tab" onClick={() => changeTab('details')}>User details</button>
                    <button className="tab" onClick={() => changeTab('changePassword')}>Change password</button>
                    <button className="tab" onClick={() => changeTab('upcoming')}>Upcoming Trips</button>
                    <button className="tab" onClick={() => changeTab('past')}>Past Trips</button>
                    <button className="tab" onClick={() => changeTab('issue')}>Report an Issue</button>
                </div>
            </section>

            <div className="trips-container">
                <section className="content" id="detailsContent">
                    <h2>User Details</h2>
                    <p>Name: {userDetails.name}</p>
                    <p>Surname: {userDetails.surname}</p>
                    <p>Email: {userDetails.email}</p>
                </section>
                <section className="content" id="changePasswordContent">
                    <h2>Change Password</h2>
                    <form id="changePasswordForm" onSubmit={handleChangePassword}>
                        <div className="form-group">
                            <input type="password" id="oldPassword" name="oldPassword" value={oldPassword}
                                   placeholder="Old Password"
                                   onChange={(e) => {
                                       setOldPassword(e.target.value)
                                   }} required></input>
                        </div>
                        <div className="form-group">
                            <input type="password" id="newPassword" name="newPassword" value={newPassword}
                                   placeholder="New password"
                                   onChange={(e) => {
                                       setNewPassword(e.target.value)
                                   }}
                                   pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$"
                                   title="Password must be at least 8 characters long and include at least one letter and one number."
                                   required></input>
                        </div>
                        <div className="form-group">
                            <input type="password" id="repeatNewPassword" name="repeatNewPassword"
                                   value={repeatedNewPassword}
                                   placeholder="Repeat new password"
                                   onChange={(e) => {
                                       setRepeatedNewPassword(e.target.value)
                                   }}
                                   pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$"
                                   title="Password must be at least 8 characters long and include at least one letter and one number."
                                   required></input>
                        </div>
                        {success && (
                            <section className="success-block">
                                <div className="error-message">{successMessage}</div>
                            </section>
                        )}
                        {error && (
                            <section className="error-block">
                                <div className="error-message">
                                    {errorMessage}
                                </div>
                            </section>
                        )}
                        <button type="submit">Submit</button>
                    </form>
                </section>
                <section className="content" id="upcomingContent">
                    <h2>Upcoming Trips</h2>
                    {upcomingTrips.map((trip) => {
                        return (
                            <div key={trip.id} className="result-option">
                                <div className="result-info">
                                    <div className="departure">
                                        <span className="time">{trip.departureTime}</span>
                                        <span className="travel-date">{trip.date}</span>
                                        <span className="city">{trip.departureCity}</span>
                                    </div>
                                    <div className="arrival">
                                        <span className="time">{trip.destinationTime}</span>
                                        <span className="travel-date">{trip.date}</span>
                                        <span className="city">{trip.destinationCity}</span>
                                    </div>
                                    <div className="duration">
                                        <span className="duration-time">{trip.duration}</span>
                                        <span
                                            className="train-number">{trip.trainInfo.name} {trip.trainInfo.number}</span>
                                    </div>
                                    <div className="arrival">
                                        <span className="travelClass">Class:</span>
                                        <span className="travelClass">{trip.seatClass}</span>
                                    </div>
                                    <div className="cancel-div">
                                        <button onClick={(e) => {
                                            handleCancel(e, trip.id)
                                        }}>
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </section>
                <section className="content" id="pastContent">
                    <h2>Past Trips</h2>
                    {pastTrips.map((trip) => {
                        return (
                            <div key={trip.id} className="result-option">
                                <div className="result-info">
                                    <div className="departure">
                                        <span className="time">{trip.departureTime}</span>
                                        <span className="travel-date">{trip.date}</span>
                                        <span className="city">{trip.departureCity}</span>
                                    </div>
                                    <div className="arrival">
                                        <span className="time">{trip.destinationTime}</span>
                                        <span className="travel-date">{trip.date}</span>
                                        <span className="city">{trip.destinationCity}</span>
                                    </div>
                                    <div className="duration">
                                        <span className="duration-time">{trip.duration}</span>
                                        <span
                                            className="train-number">{trip.trainInfo.name} {trip.trainInfo.number}</span>
                                    </div>
                                    <div className="arrival">
                                        <span className="travelClass">Class:</span>
                                        <span className="travelClass">{trip.seatClass}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </section>
                <section className="content" id="issueContent">
                    <form id="reportIssueForm" onSubmit={addUserIssue}>
                        <h2>Describe the Issue</h2>
                        <textarea name="issueText" id="issueText" cols="40" rows="5"
                                  placeholder="Enter your issue description"
                                  onChange={(e) => {
                                      setIssueText(e.target.value)
                                  }}
                                  value={issueText}
                                  pattern=".{20,}"
                                  title="Please enter at least 20 characters"
                                  required></textarea>
                        {success && (
                            <section className="success-block">
                                <div className="error-message">{successMessage}</div>
                            </section>
                        )}
                        <button type="submit">Submit</button>
                    </form>
                </section>

            </div>
        </main>

        </body>
    )
}

