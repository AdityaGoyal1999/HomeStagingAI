import { Box, Heading, Text, Table } from "@chakra-ui/react"
import { useEffect, useState } from "react";
import axios from "axios";
import { auth } from "../firebase"

const TableComponent = ({transactions}) => {
    return (
        <Table.Root size="sm">
            {/* <Table.Caption>Payment History</Table.Caption> */}
            <Table.Header>
                <Table.Row>
                    <Table.ColumnHeader>Created At</Table.ColumnHeader>
                    <Table.ColumnHeader>Description</Table.ColumnHeader>
                    <Table.ColumnHeader>Payment Email</Table.ColumnHeader>
                    <Table.ColumnHeader>Currency</Table.ColumnHeader>
                    <Table.ColumnHeader>Amount</Table.ColumnHeader>
                </Table.Row>
            </Table.Header>
            
            <Table.Body>

                {
                    transactions.map((transaction) => (
                        <Table.Row key={transaction.id}>
                            <Table.Cell>{transaction.createdAt}</Table.Cell>
                            <Table.Cell>{transaction.description}</Table.Cell>
                            <Table.Cell>{transaction.customerEmail}</Table.Cell>
                            <Table.Cell>{transaction.currency}</Table.Cell>
                            <Table.Cell>{transaction.amount}</Table.Cell>
                        </Table.Row>
                    ))
                }
                
            </Table.Body>

            {/* <Table.Footer>
                <Table.Row>
                <Table.Cell />
                </Table.Row> */}
            {/* </Table.Footer> */}
        </Table.Root>
    )
}

export default function PaymentHistory() {

    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const fetchTransactions = async () => {
            const userCredential = auth.currentUser
            if (!userCredential) return;
            
            const token = await userCredential.getIdToken();

            const response = await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/payment/transactions`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            console.log("Transactions", response.data.transactions);
            setTransactions(response.data.transactions);
        }
        fetchTransactions();
    }, []);

    return (
        <Box>
            <Heading>Payment History</Heading>
            {/* <Text mt={8}>⚠️ This page is under construction</Text> */}
            <Box mt={8}>
            {transactions.length > 0 ? (

                <TableComponent transactions={transactions} />
            ) : (
                <Text>No transactions found</Text>
            )}
            </Box>
        </Box>
    )
}