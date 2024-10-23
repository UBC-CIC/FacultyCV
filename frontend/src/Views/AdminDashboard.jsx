import React, { useState } from 'react';

const AdminDashboard = () => {
const [department, setDepartment] = useState('');
const [publication, setPublication] = useState('');
const [year, setYear] = useState('');
const [researchInstitute, setResearchInstitute] = useState('');
const [funder, setFunder] = useState('');
const [andOr, setAndOr] = useState('and');

// Handlers for form field changes
const handleAndOrChange = (event) => setAndOr(event.target.value);

// Placeholder for other handlers
const createReport = () => {
console.log('Creating report...');
};

const exportToCSV = () => {
console.log('Exporting to CSV...');
};

const saveReport = () => {
console.log('Saving report...');
};

return (
    <div className="dashboard">
        <h2>Dashboard Reports</h2>

        <div className="report-section">
            <h3>Create new report</h3>
            <input type="text" placeholder="Create new report" />

            <div className="predefined-reports">
                <h4>Use pre-defined report</h4>
                <select>
                    <option value="">Select a pre-defined report</option>
                    <option value="faculty">Faculty Research Publications Report</option>
                    <option value="funding">Grant Funding Summary Report</option>
                </select>
            </div>

            <div className="filters">
                {/* Department Filter */}
                <div>
                    <label>Department:</label>
                    <select onChange={(e) => setDepartment(e.target.value)}>
                        <option value="">Select Department</option>
                        <option value="allergy">Allergy & Immunology</option>
                        <option value="cardiology">Cardiology</option>
                    </select>
                    <select onChange={handleAndOrChange}>
                        <option value="and">And</option>
                        <option value="or">Or</option>
                    </select>
                </div>

                {/* Research Institute Filter */}
                <div>
                    <label>Research Institute:</label>
                    <input type="text" value={researchInstitute} onChange={(e) => setResearchInstitute(e.target.value)} />
                    <select onChange={handleAndOrChange}>
                    <option value="and">And</option>
                    <option value="or">Or</option>
                    </select>
                </div>

                {/* Funder Filter */}
                <div>
                    <label>Funder:</label>
                    <input type="text" value={funder} onChange={(e) => setFunder(e.target.value)} />
                    <select onChange={handleAndOrChange}>
                    <option value="and">And</option>
                    <option value="or">Or</option>
                    </select>
                </div>

                {/* Publication Filter */}
                <div>
                    <label>Publication:</label>
                    <input type="text" value={publication} onChange={(e) => setPublication(e.target.value)} />
                    <select onChange={handleAndOrChange}>
                    <option value="and">And</option>
                    <option value="or">Or</option>
                    </select>
                </div>

                {/* Year Filter */}
                <div>
                    <label>Year:</label>
                    <input type="text" value={year} onChange={(e) => setYear(e.target.value)} />
                    <select onChange={handleAndOrChange}>
                    <option value="and">And</option>
                    <option value="or">Or</option>
                    </select>
                </div>
                </div>

                {/* Report Preview */}
                <div className="report-preview">
                <h4>Report Preview</h4>
                <div className="preview-box"></div>
                </div>

                {/* Action Buttons */}
                <div className="actions">
                    <button onClick={createReport}>Create Report</button>
                    <button onClick={exportToCSV}>Export to CSV</button>
                    <button onClick={saveReport}>Save Report</button>
                </div>
            </div>
        </div>
    );
};
export default AdminDashboard;
