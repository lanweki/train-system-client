import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#f0f0f0',
        padding: 20,
    },
    section: {
        marginBottom: 10,
        padding: 10,
        backgroundColor: '#ffffff',
        borderRadius: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        color: '#333333',
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        color: '#333333',
    },
    infoText: {
        fontSize: 14,
        marginBottom: 8,
        color: '#555555',
    },
});

const TicketPdf = ({ departureTrip, ticketBooking }) => {
    const { selectedPrice } = departureTrip;

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.section}>
                    <Text style={styles.title}>Lift Ticket Information</Text>
                    <Text style={styles.header}>{ticketBooking.departureCity} - {ticketBooking.destinationCity}</Text>
                    <Text style={styles.header}>{ticketBooking.departureTime} - {ticketBooking.destinationTime}</Text>
                    <Text style={styles.infoText}>Duration: {ticketBooking.duration}</Text>
                    <Text style={styles.infoText}>Train: {ticketBooking.trainInfo.name} {ticketBooking.trainInfo.number}</Text>
                    <Text style={styles.infoText}>Travel Class: {departureTrip.selectedClass}</Text>
                    <Text style={styles.infoText}>Price: {selectedPrice}€</Text>
                    <Text style={styles.header}>{ticketBooking.transactionNumber}</Text>
                </View>
            </Page>
        </Document>
    );
};
export default TicketPdf;