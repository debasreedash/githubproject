import React from "react";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';

const getResultsTable = (results) => {
    let styles = {
        background: 'black',
        fontSize: '16px',
        border: '0',
        color: 'white',
        height: '48px',
        padding: '0 30px',
    } as React.CSSProperties;

    const classes = useStyles();

    return (
        <Paper>
            <TableContainer className={classes.container}>
                <Table className={classes.table} stickyHeader aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell style={styles}>Title</TableCell>
                            <TableCell style={styles}>User</TableCell>
                            <TableCell style={styles}>Commits</TableCell>
                            <TableCell style={styles}>Comments</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {results.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell>{row.title}</TableCell>
                                <TableCell component="th" scope="row">
                                    {row.user}
                                </TableCell>
                                <TableCell align="left">{row.commits}</TableCell>
                                <TableCell align="left">{row.comments}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
}

const useStyles = makeStyles({
    table: {
        minWidth: '650',
    },
    container: {
        maxHeight: '500px',
        borderRadius: '2px',
        boxShadow: '0 3px 5px 2px gray'
    },
});

const PullRequestTable = (props) => {
    let { results } = props;
    return <div style={{display: 'flex', justifyContent: 'center'}}>
        {results.length > 0 && getResultsTable(results)}
    </div>;
}

export default PullRequestTable;
