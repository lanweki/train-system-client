import React, {useEffect, useState} from "react";
import "../index.css";
import {Header} from "../Header/header.component";
import {AdditionalInfo} from "../AdditionalInfo/additionalInfo.component";
import {Footer} from "../Footer/footer.component";
import {useNavigate} from "react-router-dom";

export function SearchTicketsResult() {
    const [trips, setTrips] = useState([]);
    const [tripInfo, setTripInfo] = useState([]);
    const [travelClasses, setTravelClasses] = useState({});
    const [departureCities, setDepartureCities] = useState([]);
    const [destinationCities, setDestinationCities] = useState([]);

    const [selectedDeparture, setSelectedDeparture] = useState('');
    const [selectedDestination, setSelectedDestination] = useState('');
    const [departureDate, setDepartureDate] = useState('');
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [selectedPrices, setSelectedPrices] = useState({});
    const [chosenDepartureTrip, setChosenDepartureTrip] = useState(null);

    const navigate = useNavigate();

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

    const userId = localStorage.getItem("userId");

    console.log("Main userId=" + userId)

    const handleTravelClassChange = (trip, selectedClass, tripInfo) => {
        const tripId = trip.id
        console.log("tripId=" + tripId + ", selectedClass=" + selectedClass);
        console.log("Price: " + selectedPrices[trip.id]);
        const selectedTrip = trips.find(trip => trip.id === tripId);

        if (selectedTrip) {
            console.log("Selected Trip:", selectedTrip);

            const selectedTripClass = selectedTrip.tripClass.find(tripClass => tripClass.seatClass.toString() === selectedClass.toString());
            console.log("Selected Trip Class:", selectedTripClass);

            setTravelClasses((prevClasses) => ({
                ...prevClasses,
                [tripId]: selectedClass,
            }));

            setSelectedPrices((prevPrices) => ({
                ...prevPrices,
                [tripId]: selectedTripClass ? selectedTripClass.price : 0,
            }));

        } else {
            console.warn("Selected Trip not found");
        }
    };

    function handleSearch() {
        setError(false);
        if (selectedDeparture === '-' || selectedDestination === '-' || !departureDate || selectedDeparture === '' || selectedDestination === '') {
            console.error('Please select valid values for Departure and Destination');
            setError(true);
            setErrorMessage('Please select valid values for Departure and Destination.');
            return;
        }

        const searchRequest = {
            departureCity: selectedDeparture,
            destinationCity: selectedDestination,
            date: departureDate,
        };
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(searchRequest)
        };
        fetch('/trips', requestOptions)
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    setError(true);
                    setErrorMessage('No trips found for the selected criteria.');
                    throw new Error(`Request failed with status ${response.status}`);
                }
            })
            .then((data) => {
                if (data) {
                    setTripInfo(data)
                    setTrips(data.tripDtos)
                }
            })
            .catch((error) => console.error('Error fetching data:', error));
    }

    const handleBuyButtonClick = (e, trip, selectedPrice, selectedClass) => {
        const chosenTrip = {
            trip: trip,
            tripInfo: tripInfo,
            selectedClass: selectedClass,
            selectedPrice: selectedPrice,
        };

        //validateSeatAvailiability(chosenTrip);
        navigate('/payment', {state: {chosenTrip}});

        setChosenDepartureTrip(null);
    };

    return (
        <body>
        <Header/>
        <main>
            <section className="hero">
                <h1>Welcome to Lift</h1>
                <p>Your journey begins here. Find the perfect train for your adventure!</p>
            </section>

            <section className="search-block">
                <h2>Search for Train Tickets</h2>
                <form id="searchForm" onSubmit={(e) => {
                    e.preventDefault();
                    handleSearch();
                }}>
                    <div className="form-group">
                        <label htmlFor="departure">Departure</label>
                        <select id="departure"
                                name="departure"
                                value={selectedDeparture}
                                onChange={(e) => {
                                    console.log("Departure was changed to " + e.target.value);
                                    setSelectedDeparture(e.target.value)
                                }}>
                            <option key="-" value="-">-</option>
                            {departureCities.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="destination">Destination</label>
                        <select id="destination"
                                name="destination"
                                value={selectedDestination}
                                onChange={(e) => {
                                    console.log("Destination was changed to " + e.target.value)
                                    setSelectedDestination(e.target.value)
                                }}>
                            <option key="-" value="-">-</option>
                            {destinationCities.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="departureDate">Departure Date</label>
                        <input type="date"
                               id="departureDate"
                               name="departureDate"
                               value={departureDate}
                               onChange={(e) => setDepartureDate(e.target.value)}
                               required></input>
                    </div>

                    {error && (
                        <section className="error-block">
                            <div className="error-message">
                                {errorMessage}
                            </div>
                        </section>
                    )}
                    <button type="submit" id="searchButton">Search</button>
                </form>
            </section>

            <section className="results-label">
                {trips && trips.length > 0 ? (
                    <span className="results-labelname">
                        Train tickets for the route {tripInfo.departureCity} - {tripInfo.destinationCity}:
                    </span>
                ) : (
                    <span className="results-labelname"></span>
                )}

            </section>
        </main>
        <section className="results-block">
            {trips.map((trip) => {
                const selectedClass = travelClasses[trip.id] || '-';
                const selectedPrice = selectedPrices[trip.id] || '-';

                return (
                    <div key={trip.id} className="result-option">
                        <div className="result-info">
                            <div className="departure">
                                <span className="time">{trip.departureTime}</span>
                                <span className="travel-date">{tripInfo.date}</span>
                                <span className="city">{tripInfo.departureCity}</span>
                            </div>
                            <div className="arrival">
                                <span className="time">{trip.destinationTime}</span>
                                <span className="travel-date">{tripInfo.date}</span>
                                <span className="city">{tripInfo.destinationCity}</span>
                            </div>
                            <div className="duration">
                                <span className="duration-time">{trip.duration}</span>
                                <span className="train-number">{trip.trainInfo.name} {trip.trainInfo.number}</span>
                            </div>
                            <div className="travel-class">
                                <label htmlFor={`travelClass-${trip.id}`}>Travel Class:</label>
                                <select
                                    id={`travelClass-${trip.id}`}
                                    name={`travelClass-${trip.id}`}
                                    value={selectedClass}
                                    onChange={(e) =>
                                        handleTravelClassChange(trip, e.target.value, tripInfo)}>
                                    <option value="-">-</option>
                                    {trip.tripClass.map((tripClass) => (
                                        <option key={tripClass.seatClass} value={tripClass.seatClass}>
                                            {tripClass.seatClass}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="buy-button">
                                <div className="price">
                                    <span className="number-price">
                                        {selectedPrice}€
                                    </span>
                                </div>
                                <button
                                    onClick={(e) =>
                                        handleBuyButtonClick(e, trip, selectedPrice, selectedClass)}
                                    disabled={selectedClass === "-" || selectedClass === ""}>Buy
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })}
        </section>
        <AdditionalInfo/>
        <Footer/>
        </body>
    );
}
