import './App.css';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import {SearchTicketsResult} from "./components/SearchTicketsResult/searchTicketsResult.component";
import {Payment} from "./components/Payment/payment.component";
import {UserDetails} from "./components/UserDetails/userDetails.component";
import {Admin} from "./components/Admin/admin.component";
import {Ticket} from "./components/Ticket/ticket.component";


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<SearchTicketsResult/>}/>
                <Route path="/payment" element={<Payment/>}/>
                <Route path="/users/details" element={<UserDetails/>}/>
                <Route path="/admin" element={<Admin/>}/>
                <Route path="/ticket" element={<Ticket/>}/>
            </Routes>
        </Router>
    );
}

// document.addEventListener("DOMContentLoaded", function () {
//     const searchForm = document.getElementById("searchForm");
//     const searchButton = document.getElementById("searchButton");
//
//     searchButton.addEventListener("click", handleSearch);
//
//     function handleSearch() {
//         const departure = document.getElementById("departure").value;
//         const destination = document.getElementById("destination").value;
//         const departureDate = document.getElementById("departureDate").value;
//         const returnDate = document.getElementById("returnDate").value;
//
//         const requestData = {
//             departure,
//             destination,
//             departureDate,
//             returnDate
//         };
//
//         // Assuming your API endpoint is 'your-api-endpoint'
//         const apiUrl = 'your-api-endpoint';
//
//         fetch(apiUrl, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(requestData),
//         })
//             .then(response => response.json())
//             .then(data => {
//                 // Handle the API response data
//                 console.log(data);
//             })
//             .catch(error => {
//                 console.error('Error:', error);
//             });
//     }
// });

export default App;
