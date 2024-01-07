import React from "react";
import {Header} from "../Header/header.component";
import TicketPdf from "../TicketPdf/ticketPdf.component";
import {pdf} from '@react-pdf/renderer';
import {saveAs} from 'file-saver';
import {useLocation} from "react-router-dom";


export function Ticket() {
    const {state} = useLocation();
    const departureTrip = state.departureTrip
    const ticketBooking = state.ticketBooking

    const Download = () => {
        const handleDownload = async () => {
            const blob = await pdf(<TicketPdf departureTrip={state.departureTrip} ticketBooking={ticketBooking}/>).toBlob()
            saveAs(blob, 'untitled.pdf')
        }

        return <button className="save-button" onClick={handleDownload}>Save</button>
    };

    return (
        <body>
        <Header/>
        <main>
            <div className="hero-ticket">
                <h1>Ticket was successfully purchased</h1>
                <p>Thank you for choosing our service!</p>
                <div className="button-container">
                    <Download/>
                </div>
            </div>

            <section className="ticket-info">
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
        </main>
        </body>
    )
}
