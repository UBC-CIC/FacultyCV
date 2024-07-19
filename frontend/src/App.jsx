import { Amplify } from 'aws-amplify';
import './App.css';
import '@aws-amplify/ui-react/styles.css';
import React, { useEffect, useState } from 'react';
import { getCurrentUser, signOut } from 'aws-amplify/auth';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './Views/AuthPage';
import NotFound from './Views/NotFound';
import AcademicWork from './Views/AcademicWork';
import Reports from './Views/Reports.jsx';
import Assistants from './Views/Assistants.jsx';
import { getElsevierAuthorMatches, getUser } from './graphql/graphqlHelpers.js';
import PageContainer from './Views/PageContainer.jsx';
import FacultyHomePage from './Views/FacultyHomePage.jsx';
import AssistantHomePage from './Views/AssistantHomePage.jsx';
import AdminHomePage from './Views/AdminHomePage.jsx';
import Archive from './Views/Archive.jsx';

Amplify.configure({
  API: {
    GraphQL: {
      endpoint: process.env.REACT_APP_APPSYNC_ENDPOINT,
      region: process.env.REACT_APP_AWS_REGION,
      defaultAuthMode: 'userPool',
    }
  },
  Auth: {
    Cognito: {
      region: process.env.REACT_APP_AWS_REGION,
      userPoolClientId: process.env.REACT_APP_COGNITO_USER_POOL_CLIENT_ID,
      userPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID,
      allowGuestAccess: false
    }
  },
});

function App() {
  const [user, setUser] = useState(null);
  const [userInfo, setUserInfo] = useState({});
  const [loading, setLoading] = useState(false);

  async function getUserInfo(email) {
    try {
      const userInformation = await getUser(email);
      console.log('User information:', userInformation);
      setUserInfo(userInformation);
      setLoading(false);
      return userInformation;
    } catch (error) {
      setLoading(false);
      console.log('Error getting user:', error);
    }
  }

  async function getCognitoUser() {
    try {
      setLoading(true);
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      console.log(currentUser.signInDetails.loginId, "is signed in");
      await getUserInfo(currentUser.signInDetails.loginId);
      <Navigate to="/home" />
    }
    catch (error) {
      setUser(null);
      setUserInfo(null);
      signOut();
      console.log('Error getting user:', error);
      setLoading(false);
      <Navigate to="/auth" />
    }
  }

  useEffect(() => {    
    getCognitoUser();
  }, []);

  if (loading) {
    return (
      <PageContainer>
        <div className='flex items-center justify-center w-full'>
          <div className="block text-m mb-1 mt-6 text-zinc-600">Loading...</div>
        </div>
      </PageContainer>
    ) 
  }

  return (
    <Router>
      <Routes>
        <Route path="/home" element={user ? (
          userInfo.role === 'Admins' ? <AdminHomePage userInfo={userInfo} setUserInfo={setUserInfo} getCognitoUser={getCognitoUser} getUser={getUserInfo}/> :
          userInfo.role === 'Assistants' ? <AssistantHomePage userInfo={userInfo} setUserInfo={setUserInfo} getCognitoUser={getCognitoUser} getUser={getUserInfo}/> :
          userInfo.role === 'Faculty' ? <FacultyHomePage userInfo={userInfo} setUserInfo={setUserInfo} getCognitoUser={getCognitoUser} getUser={getUserInfo}/> :
          <PageContainer>
            <div className='flex items-center justify-center w-full'>
              <div className="block text-m mb-1 mt-6 text-zinc-600">Loading...</div>
            </div>
          </PageContainer>
        ) : <Navigate to="/auth" />} />
        <Route path="/auth" element={user ? <Navigate to="/home" /> : <AuthPage getCognitoUser = {getCognitoUser} />} />
        <Route path="/academic-work" element={user ? <AcademicWork userInfo = {userInfo} getCognitoUser = {getCognitoUser}/> : <Navigate to="/auth" />} />
        <Route path="/reports" element={user ? <Reports userInfo = {userInfo} getCognitoUser = {getCognitoUser}/> : <Navigate to="/auth" />} />
        <Route path="/assistants" element={user ? <Assistants userInfo = {userInfo} getCognitoUser = {getCognitoUser}/> : <Navigate to="/auth" />} />
        <Route path="/archive" element={user ? <Archive userInfo = {userInfo} getCognitoUser = {getCognitoUser}/> : <Navigate to="/auth" />} />
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
