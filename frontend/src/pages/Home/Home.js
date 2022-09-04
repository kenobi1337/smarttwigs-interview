import React, { useState, useEffect,  } from 'react';
import './Home.css'

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {FormControlLabel, InputLabel, MenuItem, Radio, RadioGroup, Select} from "@mui/material";
import { Link, useNavigate } from 'react-router-dom'

import axios from 'axios'

const Home = () => {
    const API = "http://localhost:3001"

    const [showForms, setShowForms] = useState(true)
    const [player1, setPlayer1] = useState("")
    const [player2, setPlayer2] = useState("")
    const [showServerForm, setShowServerForm] = useState(false)
    const [server, setServer] = useState("")
    const [point1, setPoint1] = useState(0)
    const [point2, setPoint2] = useState(0)
    const [showWinner, setShowWinner] = useState(false)
    const [currentWinner ,setCurrentWinner] = useState("")
    const [currentUsers, setCurrentUsers] = useState([])

    const navigate = useNavigate()

    useEffect(() => {

            axios.get(`${API}/api/points`).then((allUsers) => {
                const users = allUsers.data.allPoints
                // for (let i = 0; i < users.length; i++) {
                //     console.log(users[i].username)
                //     setCurrentUsers([...currentUsers, users[i]])
                // }
                setCurrentUsers(users)
                console.log(currentUsers)
            })



    }, [])

    useEffect(() => {
        if ((point1 + point2) % 2 === 0) {
            (server === player1) ? setServer(player2) : setServer(player1)
        }

        if (point1 > 10 && point1 - point2 >= 2) {
            setCurrentWinner(player1)
            setShowWinner(true)
        } else if (point2 > 10 && point2 - point1 >= 2) {
            setCurrentWinner(player2)
            setShowWinner(true)
        }

    }, [point1, point2])

    const handleClose = () => {
        setShowForms(false)
        setShowServerForm(true)
    }

    const handleAddPoint1 = () => {
        setPoint1(point1 + 1)
    }

    const handleAddPoint2 = () => {
        setPoint2(point2 + 1)
    }

    const handleWinner = async () => {
        setShowWinner(false)

        const loser = (currentWinner === player1) ? player2 : player1
        const loserPoint = (currentWinner === player1) ? point2 : point1
        const winnerPoint = (currentWinner === player1) ? point1 : point2

        try {
            // save/update winner player
            const currentWinnerInfo = await axios.get(`${API}/api/points/${currentWinner}`)
            const winnerInfoRecord = currentWinnerInfo.data.record

            if (winnerInfoRecord === null) {
                const newPlayerInfo = await axios.post(`${API}/api/points`, {
                    username: currentWinner,
                    wins: 1,
                    cumulativePoints: winnerPoint
                })
            } else {
                const existPlayerInfo = await axios.put(`${API}/api/points/${currentWinner}`, {
                    wins: winnerInfoRecord.wins + 1,
                    cumulativePoints: winnerInfoRecord.cumulativePoints + winnerPoint
                })
            }

            // save/update loser player
            const currentLoserInfo = await axios.get(`${API}/api/points/${loser}`)
            const loserInfoRecord = currentLoserInfo.data.record

            if (loserInfoRecord === null) {
                const newPlayerInfo = await axios.post(`${API}/api/points`, {
                    username: loser,
                    wins: 0,
                    cumulativePoints: 0
                })
            }
            navigate("/leaderboard")
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <React.Fragment>
        <div className="main">
            <div className="home-container">
                <div className="first-player">
                    <div className="player-name">{player1}</div>
                    <button className="add-points-button" onClick={handleAddPoint1}>Add point</button>
                </div>
                <div className="feedback">
                    <div className="scores">{point1} - {point2}</div>
                    <div className="serves">Current Server: {server}</div>
                </div>
                <div className="second-player">
                    <div className="player-name">{player2}</div>
                    <button className="add-points-button" onClick={handleAddPoint2}>Add point</button>
                </div>
            </div>

        </div>
            <Dialog open={showForms} onClose={handleClose}>
                <DialogTitle>Set Usernames</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please type in username for player 1 and 2 or select from the drop down menu
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name1"
                        label="player 1 username"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={player1}
                        onChange={(e) => setPlayer1(e.target.value)}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name2"
                        label="player 2 username"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={player2}
                        onChange={((e) => setPlayer2(e.target.value))}
                    />
                    <DialogContentText>
                        OR
                    </DialogContentText>
                    <InputLabel>Player 1 usernames</InputLabel>
                    <Select
                        labelId="Player 1 usernames"
                        id="player-1-select"
                        value={player1}
                        label="username"
                        onChange={(e) => setPlayer1(e.target.value)}
                    >
                        {currentUsers.map((user) => <MenuItem value={user.username} key={user.username}>{user.username}</MenuItem>)}
                    </Select>
                    <br />
                    <InputLabel>Player 1 usernames</InputLabel>
                    <Select
                        labelId="Player 2 usernames"
                        id="player-2-select"
                        value={player2}
                        label="username"
                        onChange={(e) => setPlayer2(e.target.value)}
                    >
                        {currentUsers.map((user) => <MenuItem value={user.username} key={user.username}>{user.username}</MenuItem>)}
                    </Select>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                    <Button onClick={handleClose}>Confirm</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={showServerForm} onClose={() => setShowServerForm(false)}>
                <DialogTitle>Select server</DialogTitle>
                <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    name="radio-buttons-group"
                    onChange={(e) => setServer(e.target.value)}
                >
                    <FormControlLabel value={player1} control={<Radio />} label={player1} />
                    <FormControlLabel value={player2} control={<Radio />} label={player2} />
                </RadioGroup>
                <DialogActions>
                    <Button onClick={() => setShowServerForm(false)}>Close</Button>
                    <Button onClick={() => setShowServerForm(false)}>Confirm</Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={showWinner}
                onClose={() => setShowWinner(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"WE GOT THE WINNER!"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Here our winner: {currentWinner}, congratulations! For the losers, you will get them next time ;)
                    </DialogContentText>
                </DialogContent>
                <DialogActions>

                    <Button onClick={handleWinner} autoFocus>
                        Acknowledge
                    </Button>
                </DialogActions>
            </Dialog>
            <Link to="/leaderboard">Leaderboard</Link>
        </React.Fragment>
    );
};

export default Home;
