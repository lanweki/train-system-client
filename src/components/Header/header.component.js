import React, {useState} from "react";
import logo from "../logo.png";
import {useNavigate} from "react-router-dom";

export function Header() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [registerSuccess, setRegisterSuccess] = useState(false);
    const [error, setError] = useState(false);


    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        setError(false);

        const loginData = {
            username: username,
            password: password,
        };

        fetch('/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData),
        })
            .then(response => {
                if(response.status === 200){
                    return response.json()
                } else {
                    setError(true);
                    throw new Error(`Request failed with status ${response.status}`);
                }
            })
            .then(data => {
                localStorage.setItem('userId', data.userId);
                toggleLoginPopup();
                navigate("/");
                window.location.reload();
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    const handleRegister = (e) => {
        e.preventDefault();
        setRegisterSuccess(false);
        setError(false);

        const registerData = {
            username: username,
            password: password,
            name: name,
            surname: surname,
            email: email,
        };

        fetch('/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(registerData),
        })
            .then(response => {
                if (response.status === 201) {
                    return response.json()
                } else if (response.status === 409) {
                    setError(true);
                    throw new Error(`Request failed with status ${response.status}`);
                } else {
                    setError(true);
                    throw new Error(`Request failed with status ${response.status}`);
                }
            })
            .then(data => {
                console.log("User was successfully registered.");
                resetStates();
                setRegisterSuccess(true);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    const resetStates = () => {
        setUsername('');
        setPassword('');
        setName('');
        setSurname('');
        setEmail('');
    };

    function toggleLoginPopup() {
        resetStates()
        setRegisterSuccess(false);
        setError(false);
        const loginPopup = document.getElementById("login-popup");
        loginPopup.style.display = (loginPopup.style.display === "none" || loginPopup.style.display === "") ? "flex" : "none";
    }

    function toggleRegisterPopup() {
        resetStates()
        setRegisterSuccess(false);
        setError(false);
        const registerPopup = document.getElementById("register-popup");
        registerPopup.style.display = (registerPopup.style.display === "none" || registerPopup.style.display === "") ? "flex" : "none";
    }

    function handleLogout() {
        const confirmed = window.confirm("Are you sure you want to logout?");

        if (confirmed) {
            localStorage.removeItem("userId");
            navigate("/");
            window.location.reload();
        }
    }

    return (
        <header>
            <a className="logo" href="/"><img src={logo} alt="Lift Logo"/></a>
            <div className="button-container">
                {localStorage.getItem("userId") !== null && localStorage.getItem("userId") !== "undefined" ? (
                    <>
                        <a href="/users/details" className="menu-link">My account</a>
                        <button className="login-button" onClick={handleLogout}>Logout</button>
                    </>
                ) : (
                    <>
                        <a className="menu-link" onClick={toggleRegisterPopup}>Register</a>
                        <button className="login-button" onClick={toggleLoginPopup}>Login</button>
                    </>
                )}
            </div>
            <div id="login-popup" className="login-popup">
                <form onSubmit={handleLogin}>
                    <h2 className="popup-header">Sign In</h2>
                    <span className="close" onClick={toggleLoginPopup}>&times;</span>
                    <input
                        type="text" id="username" name="username" placeholder="Username" value={username}
                        onChange={(e) => setUsername(e.target.value)} required/>
                    <input
                        type="password" id="password" name="password" placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} required/>
                    {error && (
                        <div className="error-message">Invalid login credentials. Please try again.</div>
                    )
                    }
                    <button type="submit">Login</button>
                </form>
            </div>

            <div id="register-popup" className="register-popup">
                <form onSubmit={handleRegister}>
                    <h2 className="popup-header">Register</h2>
                    <span className="close" onClick={toggleRegisterPopup}>&times;</span>
                    <input
                        type="text" id="username" name="username" placeholder="Username" value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        pattern=".{6,}"
                        title="Username must be at least 6 characters long."
                        required/>
                    <input
                        type="password" id="password" name="password" placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$"
                        title="Password must be at least 8 characters long and include at least one letter and one number."
                        required/>
                    <input
                        type="text" id="name" name="name" placeholder="Name" value={name}
                        onChange={(e) => setName(e.target.value)} required/>
                    <input
                        type="text" id="surname" name="surname" placeholder="Surname" value={surname}
                        onChange={(e) => setSurname(e.target.value)} required/>
                    <input
                        type="email" id="email" name="email" placeholder="Email" value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                        title="Enter a valid email address."
                        required/>
                    {registerSuccess && (
                        <div className="success-message">User was successfully registered.</div>
                    )}
                    {error && (
                        <div className="error-message">Username or email is already in use.</div>
                    )
                    }
                    <button type="submit">Sign Up</button>
                </form>
            </div>
        </header>
    )
}

