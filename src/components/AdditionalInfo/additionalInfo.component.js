import React, { useState } from "react";
import "../index.css";
export function AdditionalInfo() {
    return (
        <section className="additional-info">
            <div className="info-card">
                <h3>Travel Tips</h3>
                <p>Check out our blog for the latest travel tips and destination recommendations.</p>
                <a href="#" className="info-link">Read More</a>
            </div>
            <div className="info-card">
                <h3>Customer Reviews</h3>
                <p>See what our customers are saying about their experiences with Lift.</p>
                <a href="#" className="info-link">View Reviews</a>
            </div>
        </section>
    )
}

