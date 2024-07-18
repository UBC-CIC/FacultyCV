import React, { useState, useEffect } from 'react';
import PageContainer from './PageContainer.jsx';
import FacultyMenu from '../Components/FacultyMenu';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import '../CustomStyles/scrollbar.css';
import PDFPreview from '../Components/PDFPreview';
import Report from '../Components/Report.jsx';

const mockPrevReports = ["Grants 2024", "Teaching 2023", "Publications 2022"];

const Reports = ({ userInfo, getCognitoUser }) => {
  const [user, setUser] = useState(userInfo);
  const [selectedTemplate, setSelectedTemplate] = useState('');

  useEffect(() => {
    setUser(userInfo);
  }, [userInfo]);

  const handleSave = () => {
    // Save report
  }

  const getFormattedDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  return (
    <PageContainer className="custom-scrollbar">
      <FacultyMenu userName={user.preferred_name || user.first_name} getCognitoUser={getCognitoUser} />
      <main className='ml-2 h-full w-full'>
        <div className='flex w-full h-full'>
          <div className='flex-1 min-w-96 !overflow-auto !h-full custom-scrollbar'>
            <h1 className="text-4xl ml-2 font-bold my-3 text-zinc-600">Reports</h1>
            <label className="form-control ml-2 w-full max-w-xs">
              <div className="label">
                <span className="label-text">Template</span>
              </div>
              <select 
                className="select select-bordered"
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
              >
                <option disabled value="">Select Template</option>
                <option value="Teaching">Teaching</option>
                <option value="Grant_Application">Grant Application</option>
                <option value="Publications">Publications</option>
              </select>
            </label>
            <label className="ml-2 mt-2 form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Title</span>
              </div>
              <input type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" />
            </label>
            <button onClick={handleSave} className="ml-2 mt-6 text-white btn btn-success min-h-0 h-6 leading-tight mb-1">Save</button>
            <h2 className="ml-2 mt-10 text-2xl font-bold my-3 text-zinc-600">Previous</h2>
              {mockPrevReports.map((report, index) => (
                <Report key={index} title={report} />
              ))}
          </div>
          <div className='flex-none w-0.5 bg-neutral h-screen' />

          {selectedTemplate !== '' &&
          <div className='flex-grow !overflow-auto !h-full !custom-scrollbar'>
            <PDFViewer className='p-4 ' showToolbar={false} style={{ width: '100%', height: '95%' }}>
              <PDFPreview userInfo={user} />
            </PDFViewer>
            <div className='flex justify-center'>
              <PDFDownloadLink 
                document={<PDFPreview userInfo={user} />} 
                fileName={`${user.preferred_name || user.first_name}_${selectedTemplate}_${getFormattedDate()}.pdf`}
              >
                {({ blob, url, loading, error }) =>
                  loading ? (
                    <button className="text-white btn btn-accent min-h-0 h-6 leading-tight">
                      Loading document...
                    </button>
                  ) : (
                    <button className="text-white btn btn-accent min-h-0 h-6 leading-tight">
                      Download
                    </button>
                  )
                }
              </PDFDownloadLink>
            </div>
          </div>
          }

        </div>
      </main>
    </PageContainer>
  );
}

export default Reports;
