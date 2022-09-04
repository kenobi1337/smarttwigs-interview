import React, { useState, useEffect } from 'react';
import * as PropTypes from "prop-types";
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import axios from 'axios';
import {Link} from "react-router-dom";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

StyledTableRow.propTypes = {children: PropTypes.node};
const Leaderboard = () => {
    const [rows, setRows] = useState([])
    const API = "http://localhost:3001"

    useEffect(() => {
        axios.get(`${API}/api/points`).then((data) => {
            let users = data.data.allPoints
            users = users.sort((a, b) => b.wins - a.wins || b.cumulativePoints - a.cumulativePoints)
            setRows(users)
        })
    }, [])

    return (
        <div>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Username</StyledTableCell>
                            <StyledTableCell align="right">Wins</StyledTableCell>
                            <StyledTableCell align="right">Cumulative Points</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <StyledTableRow key={row.name}>
                                <StyledTableCell component="th" scope="row">
                                    {row.username}
                                </StyledTableCell>
                                <StyledTableCell align="right">{row.wins}</StyledTableCell>
                                <StyledTableCell align="right">{row.cumulativePoints}</StyledTableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Link to="/">Ping Pong Game</Link>
        </div>
    );
};

export default Leaderboard;
