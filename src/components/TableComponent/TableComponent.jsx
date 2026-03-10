/* eslint-disable react/prop-types */
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function TableComponent({ columns, rows }) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 250 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            {columns.map((col) => {
              return <StyledTableCell key={col.id}>{col.name}</StyledTableCell>;
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => {
            const { title, price, bid, ask, high, low, product, sell } = row;
            return (
              <StyledTableRow key={row.id}>
                <StyledTableCell width={50}>{title}</StyledTableCell>
                {price ? (
                  <StyledTableCell width={50}>{price}</StyledTableCell>
                ) : null}
                {bid ? (
                  <StyledTableCell width={50}>{bid}</StyledTableCell>
                ) : null}
                {ask ? (
                  <StyledTableCell width={50}>{ask}</StyledTableCell>
                ) : null}
                {high ? (
                  <StyledTableCell width={50}>{high}</StyledTableCell>
                ) : null}
                {low ? (
                  <StyledTableCell width={50}>{low}</StyledTableCell>
                ) : null}
                {product ? (
                  <StyledTableCell width={50}>{product}</StyledTableCell>
                ) : null}
                {sell ? (
                  <StyledTableCell width={50}>{sell}</StyledTableCell>
                ) : null}
              </StyledTableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
