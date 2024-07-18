import React, { useState, useEffect } from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
    page: {
      padding: 30,
      backgroundColor: '#FFFFFF'
    },
    header: {
      fontSize: 24,
      marginBottom: 20,
      textAlign: 'center',
      textTransform: 'uppercase',
    },
    sectionHeader: {
      fontSize: 18,
      marginBottom: 10,
      textTransform: 'uppercase',
      borderBottomWidth: 1,
      borderBottomColor: '#000',
      borderBottomStyle: 'solid',
      marginTop: 20,
    },
    text: {
      fontSize: 12,
      marginBottom: 10,
    },
    subText: {
      fontSize: 10,
      marginBottom: 5,
    },
    personalInfo: {
      marginBottom: 20,
    }
  });

// Create Document Component
const PDFPreview = ({ userInfo }) => {
    const [user, setUser] = useState(userInfo);

    return (
    <Document title={user.preferred_name || user.first_name + " TEST"} author={user.preferred_name || user.first_name}>
        <Page size="A4" style={styles.page}>
        <View>
            <Text style={styles.header}>{user.preferred_name || user.first_name}</Text>
        </View>
        <View style={styles.personalInfo}>
            <Text style={styles.text}>Email: {user.email}</Text>
            <Text style={styles.text}>Phone: +1234567890</Text>
            <Text style={styles.text}>Address: 123 Main Street, Vancouver, BC</Text>
        </View>
        <View>
            <Text style={styles.sectionHeader}>Education</Text>
            <Text style={styles.text}>Ph.D. in Computer Science, University of British Columbia, 2020</Text>
            <Text style={styles.text}>M.Sc. in Computer Science, University of Toronto, 2015</Text>
            <Text style={styles.text}>B.Sc. in Computer Science, University of Toronto, 2013</Text>
        </View>
        <View>
            <Text style={styles.sectionHeader}>Professional Experience</Text>
            <View style={styles.text}>
            <Text>Assistant Professor, University of British Columbia</Text>
            <Text style={styles.subText}>2021 - Present</Text>
            <Text style={styles.subText}>Responsibilities:</Text>
            <Text style={styles.subText}>- Conduct research in the field of artificial intelligence.</Text>
            <Text style={styles.subText}>- Teach undergraduate and graduate courses.</Text>
            <Text style={styles.subText}>- Supervise graduate students.</Text>
            </View>
            <View style={styles.text}>
            <Text>Research Scientist, ABC Tech</Text>
            <Text style={styles.subText}>2016 - 2021</Text>
            <Text style={styles.subText}>Responsibilities:</Text>
            <Text style={styles.subText}>- Developed machine learning algorithms for data analysis.</Text>
            <Text style={styles.subText}>- Collaborated with cross-functional teams to deploy solutions.</Text>
            </View>
        </View>
        </Page>
    </Document>
    )
};

export default PDFPreview;