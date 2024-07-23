import { Font, StyleSheet } from '@react-pdf/renderer';

// Register the Roboto font
Font.register({
    family: 'Roboto',
    src: 'https://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Me5WZLCzYlKw.ttf' // URL to the Roboto font file
});

export const sharedStyles = StyleSheet.create({
    page: {
        padding: 30,
        backgroundColor: '#FFFFFF'
    },
    header: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
        textTransform: 'uppercase',
        fontFamily: 'Roboto',
    },
    sectionHeader: {
        fontSize: 18,
        marginBottom: 10,
        textTransform: 'uppercase',
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        borderBottomStyle: 'solid',
        marginTop: 20,
        fontFamily: 'Roboto',
    },
    text: {
        fontSize: 12,
        marginBottom: 10,
        fontFamily: 'Roboto',
    },
    subText: {
        fontSize: 10,
        marginBottom: 5,
        fontFamily: 'Roboto',
    },
    personalInfo: {
        marginBottom: 20,
        fontFamily: 'Roboto',
    },
    table: {
        display: "table",
        width: "auto",
        borderStyle: "solid",
        borderWidth: 1,
        borderRightWidth: 0,
        borderBottomWidth: 0,
        fontFamily: 'Roboto',
    },
    tableRow: {
        margin: "auto",
        flexDirection: "row",
    },
    tableCol: {
        width: "33.33%",
        borderStyle: "solid",
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        fontFamily: 'Roboto',
    },
    tableCell: {
        margin: "auto",
        marginTop: 5,
        fontSize: 10,
        fontFamily: 'Roboto',
    }
});
