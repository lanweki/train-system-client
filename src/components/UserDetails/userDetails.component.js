import React, {useEffect, useState} from "react";
import "../index.css";
import {Header} from "../Header/header.component";
import {AdditionalInfo} from "../AdditionalInfo/additionalInfo.component";
import {Footer} from "../Footer/footer.component";


function changeTab(tabName) {
    // Hide all content sections
    const contentSections = document.querySelectorAll('.content');
    contentSections.forEach(section => {
        section.style.display = 'none';
    });

    // Show the selected content section
    const selectedContent = document.getElementById(`${tabName}Content`);
    selectedContent.style.display = 'block';
}


export function UserDetails() {

    const [userDetails, setUserDetails] = useState([]);
    const [upcomingTrips, setUpcomingTrips] = useState([]);
    const [pastTrips, setPastTrips] = useState([]);

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [issueText, setIssueText] = useState('');
    const [repeatedNewPassword, setRepeatedNewPassword] = useState('');

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

    useEffect(() => {
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
            alert('Passwords do not match. Please try again.');
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
                        throw new Error(`Request failed with status ${response.status}`);
                    }
                })
                .then((data) => {
                    resetStates();
                    alert('Password was successfully changed.');
                })
                .catch((error) => {
                    resetStates();
                    alert('Provided old password is incorrect.');
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
                console.log(issueText);
                alert('New issue has been reported.');
            })
            .catch((error) => {
                resetStates();
                console.error('Error fetching data:', error)
            });
    }

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
                                   required></input>
                        </div>
                        <div className="form-group">
                            <input type="password" id="repeatNewPassword" name="repeatNewPassword"
                                   value={repeatedNewPassword}
                                   placeholder="Repeat new password"
                                   onChange={(e) => {
                                       setRepeatedNewPassword(e.target.value)
                                   }} required></input>
                        </div>
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
                                        <button>Cancel</button>
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
                                  required></textarea>
                        <button type="submit">Submit</button>
                    </form>
                </section>

            </div>
        </main>

        </body>
    )
}

