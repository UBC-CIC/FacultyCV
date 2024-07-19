import React, { useState, useEffect } from 'react';
import PageContainer from './PageContainer.jsx';
import FacultyMenu from '../Components/FacultyMenu.jsx';
import '../CustomStyles/scrollbar.css';
import { updateUser } from '../graphql/graphqlHelpers.js';
import { getAllUniversityInfo } from '../graphql/graphqlHelpers.js';

const FacultyHomePage = ({ userInfo, getCognitoUser, getUser }) => {
  const [user, setUser] = useState(userInfo);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [campuses, setCampuses] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    setUser(userInfo);
    sortUniversityInfo();
  }, [userInfo]);

  const sortUniversityInfo = () => {
    getAllUniversityInfo().then(result => {
      let departments = [];
      let faculties = [];
      let campuses = [];

      result.forEach(element => {
        if (element.type === 'Department') {
          departments.push(element.value);
        } else if (element.type === 'Faculty') {
          faculties.push(element.value);
        } else if (element.type === 'Campus') {
          campuses.push(element.value);
        }
      });

      // Sort arrays alphabetically
      departments.sort();
      faculties.sort();
      campuses.sort();

      // Update state
      setDepartments(departments);
      setFaculties(faculties);
      setCampuses(campuses);
      setLoading(false);
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(event.target);
      const result = await updateUser(
        user.user_id, 
        user.first_name,
        user.last_name, 
        formData.get('preferredName'), 
        user.email,
        user.role,
        formData.get('bio'),
        formData.get('currentRank'),
        formData.get('primaryDepartment'),
        formData.get('secondaryDepartment'),
        formData.get('primaryFaculty'),
        formData.get('secondaryFaculty'),
        formData.get('campus'),
        '',
        formData.get('institutionUserId'),
        formData.get('scopusId'),
        formData.get('orcidId')
      );
      console.log(result);
      getUser(user.email);
      setIsSubmitting(false);
    } catch (error) {
      console.error('Error updating user:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <PageContainer>
      <FacultyMenu getCognitoUser={getCognitoUser} userName={user.preferred_name || user.first_name}></FacultyMenu>
      <main className='ml-4 pr-5 overflow-auto custom-scrollbar'>
        <h1 className="text-4xl font-bold my-3 text-zinc-600">Profile</h1>
        {loading ? (
          <div className='flex items-center justify-center w-full'>
            <div className="block text-m mb-1 mt-6 text-zinc-600">Loading...</div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <h2 className="text-lg font-bold mt-4 mb-2 text-zinc-500">Contact</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6">
              <div>
                <label className="block text-sm mb-1">First Name</label>
                <input id="firstName" type="text" value={user.first_name || ''} className="w-full rounded text-sm px-3 py-2 border border-gray-300 cursor-not-allowed" readOnly />
              </div>
              <div>
                <label className="block text-sm mb-1">Last Name</label>
                <input id="lastName" type="text" value={user.last_name || ''} className="w-full rounded text-sm px-3 py-2 border border-gray-300 cursor-not-allowed" readOnly/>
              </div>
              <div>
                <label className="block text-sm mb-1">Preferred Name</label>
                <input id="preferredName" name="preferredName" type="text" defaultValue={user.preferred_name || ''} className="w-full rounded text-sm px-3 py-2 border border-gray-300" />
              </div>
              <div>
                <label className="block text-sm mb-1">Email</label>
                <input id="email" type="text" value={user.email || ''} className="w-full rounded text-sm px-3 py-2 border border-gray-300 cursor-not-allowed" readOnly />
              </div>
              
            </div>

            <h2 className="text-lg font-bold mt-4 mb-2 text-zinc-500">Bio</h2>
              <div className="col-span-1 sm:col-span-2 md:col-span-4">
                <textarea id="bio" name="bio" defaultValue={user.bio || ''} className="w-full rounded text-sm px-3 py-2 border border-gray-300"></textarea>
              </div>

            <h2 className="text-lg font-bold mt-4 mb-2 text-zinc-500">Institution</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6">
              <div>
                <label className="block text-sm mb-1">Primary Department</label>
                <select id="primaryDepartment" name="primaryDepartment" defaultValue={user.primary_department || ''} className="w-full rounded text-sm px-3 py-2 border border-gray-300">
                  <option value="">-</option>
                  {departments.map((department, index) => <option key={index} value={department}>{department}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Secondary Department</label>
                <select id="secondaryDepartment" name="secondaryDepartment" defaultValue={user.secondary_department || ''} className="w-full rounded text-sm px-3 py-2 border border-gray-300">
                  <option value="">-</option>
                  {departments.map((department, index) => <option key={index} value={department}>{department}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Primary Faculty</label>
                <select id="primaryFaculty" name="primaryFaculty" defaultValue={user.primary_faculty || ''} className="w-full rounded text-sm px-3 py-2 border border-gray-300">
                  <option value="">-</option>
                  {faculties.map((faculty, index) => <option key={index} value={faculty}>{faculty}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Secondary Faculty</label>
                <select id="secondaryFaculty" name="secondaryFaculty" defaultValue={user.secondary_faculty || ''} className="w-full rounded text-sm px-3 py-2 border border-gray-300">
                  <option value="">-</option>
                  {faculties.map((faculty, index) => <option key={index} value={faculty}>{faculty}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Campus</label>
                <select id="campus" name="campus" defaultValue={user.campus || ''} className="w-full rounded text-sm px-3 py-2 border border-gray-300">
                  <option value="">-</option>
                  {campuses.map((campus, index) => <option key={index} value={campus}>{campus}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Current Rank</label>
                <input id="currentRank" name="currentRank" type="text" defaultValue={user.rank || ''} className="w-full rounded text-sm px-3 py-2 border border-gray-300" />
              </div>
            </div>

            <h2 className="text-lg font-bold mt-4 mb-2 text-zinc-500">Identifications</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6">
              <div>
                <label className="block text-sm mb-1">Institution ID</label>
                <input id="institutionUserId" name="institutionUserId" type="text" defaultValue={user.institution_user_id || ''} className="w-full rounded text-sm px-3 py-2 border border-gray-300" />
              </div>
              <div>
                <label className="block text-sm mb-1">Orcid ID</label>
                <input id="orcidId" name="orcidId" type="text" defaultValue={user.orcid_id || ''} className="w-full rounded text-sm px-3 py-2 border border-gray-300" />
              </div>
              <div>
                <label className="block text-sm mb-1">Scopus ID</label>
                <input id="scopusId" name="scopusId" type="text" defaultValue={user.scopus_id || ''} className="w-full rounded text-sm px-3 py-2 border border-gray-300" />
              </div>
            </div>
            <button type="submit" className="btn btn-success text-white py-1 px-2 float-right w-1/5 min-h-0 h-8 leading-tight" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </form>
        )}
      </main>
    </PageContainer>
  );
};

export default FacultyHomePage;
