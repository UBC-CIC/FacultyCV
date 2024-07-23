import React, { useState } from 'react';
import { Page, Text, View, Document } from '@react-pdf/renderer';
import { sharedStyles as styles } from '../utils/styles';
import { getSharedData } from '../utils/reportData';

const PDFPreview = ({ userInfo }) => {
    const [user, setUser] = useState(userInfo);
    const data = getSharedData(user);

    return (
        <Document title={`${data.header} CV`} author={data.header}>
          <Page size="A4" style={styles.page}>
            {/* Header */}
            <View>
              <Text style={styles.header}>{data.header}</Text>
            </View>
    
            {/* Personal Information */}
            <View style={styles.personalInfo}>
              <Text style={styles.text}>Email: {data.personalInfo.email}</Text>
              <Text style={styles.text}>Phone: {data.personalInfo.phone}</Text>
              <Text style={styles.text}>Address: {data.personalInfo.address}</Text>
            </View>
    
            {/* Education */}
            <View>
              <Text style={styles.sectionHeader}>Education</Text>
              {data.education.map((edu, index) => (
                <Text key={index} style={styles.text}>{edu}</Text>
              ))}
            </View>
    
            {/* Professional Experience */}
            <View>
              <Text style={styles.sectionHeader}>Professional Experience</Text>
              {data.professionalExperience.map((job, index) => (
                <View key={index} style={styles.listItem}>
                  <Text style={styles.subHeader}>{job.title}</Text>
                  <Text style={styles.subText}>{job.period}</Text>
                  <Text style={styles.subText}>Responsibilities:</Text>
                  {job.responsibilities.map((resp, i) => (
                    <Text key={i} style={styles.listItemSub}>- {resp}</Text>
                  ))}
                </View>
              ))}
            </View>
          </Page>
        </Document>
      );
};

export default PDFPreview;
