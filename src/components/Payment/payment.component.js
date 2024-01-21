import React, {useState} from "react";
import "../index.css";
import {Footer} from "../Footer/footer.component";
import {Header} from "../Header/header.component";
import {useLocation, useNavigate} from "react-router-dom";

export function Payment() {
    const {state} = useLocation();
    const departureTrip = state.chosenTrip
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');

    const navigate = useNavigate();

    const purchaseTicket = (e) => {
        e.preventDefault();
        const userId = localStorage.getItem("userId") !== null
        && localStorage.getItem("userId") !== 'undefined' ? localStorage.getItem("userId") : null;

        const ticketBookingRequest = {
            userId: userId,
            tripId: departureTrip.trip.id,
            name: name,
            surname: surname,
            email: email,
            seatClass: departureTrip.selectedClass
        };

        fetch('/bookings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(ticketBookingRequest)
        })
            .then(response => response.json())
            .then(data => {
                const ticketBooking = data;
                navigate('/ticket', {state: {departureTrip, ticketBooking}});
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    return (
        <body>
        <Header/>
        <main>
            <section className="ticket-info">
                <h2>Ticket purchasing information</h2>
                <div className="result-option">
                    <div className="result-info">
                        <div className="departure">
                            <span className="time">{departureTrip.trip.departureTime}</span>
                            <span className="travel-date">{departureTrip.tripInfo.date}</span>
                            <span className="city">{departureTrip.tripInfo.departureCity}</span>
                        </div>
                        <div className="arrival">
                            <span className="time">{departureTrip.trip.destinationTime}</span>
                            <span className="travel-date">{departureTrip.tripInfo.date}</span>
                            <span className="city">{departureTrip.tripInfo.destinationCity}</span>
                        </div>
                        <div className="duration">
                            <span className="duration-time">{departureTrip.trip.duration}</span>
                            <span
                                className="train-number">{departureTrip.trip.trainInfo.name} {departureTrip.trip.trainInfo.number}</span>
                        </div>
                        <div className="arrival">
                            <span className="travelClass">Travel class:</span>
                            <span className="travelClass">{departureTrip.selectedClass}</span>
                        </div>
                        <div className="buy-button">
                            <span className="">Price:</span>
                            <span className="number-price">{departureTrip.selectedPrice}€</span>
                        </div>
                    </div>
                </div>
            </section>

            <section className="payment-form">
                <form id="paymentForm" onSubmit={purchaseTicket}>
                    <h2>Personal information</h2>
                    <div className="form-group">
                        <input type="email" id="cardNumber" name="cardNumber" placeholder="Email" value={email}
                               onChange={(e) => setEmail(e.target.value)} required></input>
                    </div>
                    <div className="form-group">
                        <input type="text" id="cardNumber" name="cardNumber" placeholder="Name" value={name}
                               onChange={(e) => setName(e.target.value)} required></input>
                    </div>
                    <div className="form-group">
                        <input type="text" id="cardNumber" name="cardNumber" placeholder="Surname" value={surname}
                               onChange={(e) => setSurname(e.target.value)} required></input>
                    </div>
                    <h2>Payment Information</h2>
                    <div className="form-group">
                        <label form="name">Cardholder name</label>
                        <input type="text" id="name" name="name" placeholder="Name and surname" required></input>
                    </div>
                    <div className="form-group">
                        <label form="cardNumber">Card Number</label>
                        <input type="text" id="cardNumber" name="cardNumber" placeholder="**** **** **** ****"
                               pattern="\d{4} \d{4} \d{4} \d{4}"
                               title="Please enter a valid 16-digit card number in the format: 1234 5678 9012 3456"
                               required></input>
                    </div>
                    <div className="form-group">
                        <label form="expirationDate">Expiration Date</label>
                        <input type="text" id="expirationDate" name="expirationDate" placeholder="MM/YY"
                               pattern="^(0[1-9]|1[0-2])\/\d{2}$"
                               title="Please enter a valid expiration date in the format: MM/YY"
                               required></input>
                    </div>
                    <div className="form-group">
                        <label form="cvv">CVV</label>
                        <input type="text" id="cvv" name="cvv" placeholder="***" pattern="\d{3}"
                               title="Please enter a valid 3-digit CVV"
                               required></input>
                    </div>
                    <button type="submit">Pay Now</button>
                </form>
            </section>
        </main>

        <Footer/>

        </body>
    )

}