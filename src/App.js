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

export default App;
