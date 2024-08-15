import React, { useState } from 'react';
import { signIn, signUp, confirmSignIn, confirmSignUp, resendSignUpCode, 
  getCurrentUser, resetPassword, confirmResetPassword, updatePassword } from 'aws-amplify/auth';
import PageContainer from './PageContainer.jsx';
import '../CustomStyles/scrollbar.css';
import { addUser, getUser, updateUser, getExistingUser, addToUserGroup } from '../graphql/graphqlHelpers.js';
import { useNavigate } from 'react-router-dom';

const AuthPage = ({ getCognitoUser }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('Faculty');
  const [institution_user_id, setInstitutionUserId] = useState('0'); // HARDCODED INSTITUTION USER ID TO ADD BULK USERS
  const [newUserPassword, setNewUserPassword] = useState(false);
  const [newSignUp, setNewSignUp] = useState(false);
  const [signUpConfirmation, setSignUpConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [confirmationError, setConfirmationError] = useState('');
  const [incorrectPasswordError, setIncorrectPasswordError] = useState('');
  const [forgotPassword, setForgotPassword] = useState(false); //TODO: FORGOT PASSWORD FUNCTIONALITY
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    setIncorrectPasswordError('');
    event.preventDefault();
    try {
      setLoading(true);
      const user = await signIn({
        username: username,
        password: password
      });
      console.log('User logged in:', user.isSignedIn, user.nextStep.signInStep);
      if (!user.isSignedIn) {
        if (user.nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED') {
          setNewUserPassword(true);
          setLoading(false);
        } else if (user.nextStep.signInStep === 'CONFIRM_SIGN_UP') {
          setSignUpConfirmation(true);
          setLoading(false);
        }
      } else {
        getCognitoUser();
        navigate('/home');
      }
    } catch (error) {
      console.log('Error logging in:', error);
      setIncorrectPasswordError('Incorrect email or password.');
      setLoading(false);
    }
  };

  const handleNewPasswordUser = async (event) => {
    event.preventDefault();
    const newPassword = event.target.newPassword.value;
    const confirmNewPassword = event.target.confirmNewPassword.value;

    if (newPassword !== confirmNewPassword) {
      setPasswordError('Passwords do not match!');
      return;
    }
    setPasswordError('');
    try {
      setLoading(true);
      console.log('Setting new password for user:', username);
      const attributes = {};
      const user = await confirmSignIn({
        challengeResponse: newPassword,
        options: {
          userAttributes: attributes
        }
      });
      console.log('User logged in:', user.isSignedIn, user.nextStep.signInStep);
      if (user.isSignedIn) {
        storeUserData(firstName, lastName, username, role, institution_user_id);
      }
    } catch (error) {
      console.log('Error setting new password:', error);
      setLoading(false);
      setNewUserPassword(false);
    }
  };

  const handleConfirmSignUp = async (event) => {
    event.preventDefault();
    const confirmationCode = event.target.confirmationCode.value;

    try {
      setLoading(true);
      const user = await confirmSignUp({
        username: username,
        confirmationCode: confirmationCode
      });
      setLoading(false);
      console.log('User signed up:', user.isSignUpComplete, user.nextStep.signInStep);
      if (user.isSignUpComplete) {
        storeUserData(firstName, lastName, username, role, institution_user_id);
      }
    } catch (error) {
      console.log('Error setting new password:', error);
      setConfirmationError('Invalid confirmation code');
      setLoading(false);
    }
  };

  const resendConfirmationCode = async () => {
    try {
      setLoading(true);
      await resendSignUpCode({ username: username });
      setLoading(false);
      setConfirmationError('');
    } catch (error) {
      console.log('Error resending confirmation code:', error);
      setLoading(false);
    }
  };


  const handleSignUp = async (event) => {
    event.preventDefault();
    const confirmPassword = event.target.confirmPassword.value;

    // Password specifications
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^\s]{8,}$/;

    // Username specification
    const usernameRegex = /@mail\.ubc\.ca$/;

    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match!');
      return;
    } else if (!passwordRegex.test(password)) {
      setPasswordError('Password must be at least 8 characters long, contain a lowercase letter, an uppercase letter, and a digit.');
      return;
    } else if (!usernameRegex.test(username)) {
      setPasswordError('Email must be a valid UBC email address.');
      return;
    }
    setPasswordError('');

    try {
      setLoading(true);
      const { isSignUpComplete, userId, nextStep } = await signUp({
        username: username,
        password: password,
        attributes: {
          email: username
        }
      });
      setLoading(false);
      setNewSignUp(false);
      console.log('User signed up:', isSignUpComplete, userId, nextStep);
      if (!isSignUpComplete) {
        if (nextStep.signUpStep === 'CONFIRM_SIGN_UP') {
          setSignUpConfirmation(true);
        }
      }
    } catch (error) {
      console.log('Error signing up:', error);
      setLoading(false);
    }
  };

  const storeUserData = async (first_name, last_name, email, role, institution_user_id) => {
    setLoading(true);
    //sign in user
    try {
      let user = null;
      try {
        user = await getCurrentUser();
      } catch (error) {
        console.log('Not signed in, signing in...', error);
        user = await signIn({
          username: username,
          password: password
        });
      }      
    } catch (error) {
      console.log('Error getting user:', error);
      setLoading(false);
      return;
    }

    //put user in user group
    try {
      const result = await addToUserGroup(email, role);
      console.log('Adding user to user group', result);
    } catch (error) {
      console.log('Error adding user to group:', error);
      setLoading(false);
      return;
    }
    
    // put user data in database if it doesn't already exist
    try {
      const userInformation = await getExistingUser(institution_user_id);
      console.log('User already exists in database');
      if (!userInformation.role) {
        console.log(`Updating user with group ${role}`);
        console.log(
          await updateUser(
            userInformation.user_id, userInformation.first_name, userInformation.last_name, userInformation.preferred_name,
            email, role, userInformation.bio, userInformation.rank,
            userInformation.primary_department, userInformation.secondary_department, userInformation.primary_faculty,
            userInformation.secondary_faculty, userInformation.campus, userInformation.keywords,
            userInformation.institution_user_id, userInformation.scopus_id, userInformation.orcid_id
          )
        )
      }
    } catch (error) {
      try {
        const result = await addUser(first_name, last_name, '', email, role, '', '', '', '', '', '', '', '', '', '', '');
        console.log(result);
      } catch (error) {
        console.log('Error adding user to database:', error);
        setLoading(false);
      }
    }
    getCognitoUser();
    console.log('User data stored and navigating to home page');
    navigate('/home');
  };

  return (
    <PageContainer>
      <div className="flex w-full rounded-lg mx-auto shadow-lg overflow-hidden bg-gray-100">
        <div className="w-3/5 flex flex-col items-center justify-center overflow-auto custom-scrollbar">
          {loading && <div className="block text-m mb-1 mt-6 text-zinc-600">Loading...</div>}
          {!loading && !newUserPassword && !newSignUp && !signUpConfirmation && (
            <div>
              <div>
              <h1 className="text-4xl font-bold my-3 text-zinc-600">Sign in to manage your CV</h1>
              <p>Sign in below or <span className="text-zinc-600 font-bold underline underline-offset-2 cursor-pointer" onClick={() => setNewSignUp(true)}>create an account</span></p>
              </div>
              <div className='flex flex-col items-center justify-center'>
                <form onSubmit={handleLogin}>
                  <label className="block text-m mb-1 mt-6">Email</label>
                  <input className="input input-bordered w-full text-sm" value={username} onChange={e => setUsername(e.target.value)} placeholder="Email" required />
                  <label className="block text-m mb-1 mt-6">Password</label>
                  <input className="input input-bordered w-full text-sm" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" required />
                  <button className="btn btn-neutral mt-6 mb-3 w-full text-base" type="submit">Sign In</button>
                </form>
                <span className="text-zinc-600 text-sm font-bold underline underline-offset-2 cursor-pointer" onClick={() => setForgotPassword(true)}>Forgot Password</span>
                {incorrectPasswordError && <div className="text-m mt-4 text-red-600">{incorrectPasswordError}</div>}
              </div>
            </div>
          )}
          {/* {!loading && forgotPassword && (
            <div>
              <h1 className="text-3xl font-bold my-3 text-zinc-600">Reset Password</h1>
              <p className='text-sm'>Please enter the email for your account.</p>
              <div className='flex flex-col items-center justify-center max-w-xl'>
                <form onSubmit>
                  <label className="block text-xs mt-4">Email</label>
                  <input className="input input-bordered mt-1 h-10 w-full text-xs" value={username} onChange={e => setUsername(e.target.value)} placeholder="Email" required />
                  {passwordError && <div className="block text-m mb-1 mt-6 text-red-600">{passwordError}</div>}
                  <button className="btn btn-neutral mt-4 min-h-5 h-8 w-full" type="submit">Send Reset Code</button>
                </form>
              </div>
            </div>
            
          )} */}
          {!loading && newSignUp && (
            <div className='mt-20 mb-5'>
              <div>
                <h1 className="text-3xl font-bold my-3 text-zinc-600">Create an account</h1>
                <p className='text-sm'>Enter your account details below or <span className="text-zinc-600 font-bold underline underline-offset-2 cursor-pointer" onClick={() => setNewSignUp(false)}>sign in</span></p>
              </div>
              <div className='flex flex-col items-center justify-center'>
                <form onSubmit={handleSignUp}>
                  <label className="block text-xs mt-4">First Name</label>
                  <input className="input input-bordered mt-1 h-10 w-full text-xs" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="First Name" required />
                  <label className="block text-xs mt-4">Last Name</label>
                  <input className="input input-bordered mt-1 h-10 w-full text-xs" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Last Name" required />
                  <label className="block text-xs mt-4">Email</label>
                  <input className="input input-bordered mt-1 h-10 w-full text-xs" value={username} onChange={e => setUsername(e.target.value)} placeholder="Email" required />
                  <label className="block text-xs mt-4">Password</label>
                  <input className="input input-bordered mt-1 h-10 w-full text-xs" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" required />
                  <label className="block text-xs mt-4">Confirm Password</label>
                  <input className="input input-bordered mt-1 h-10 w-full text-xs" name="confirmPassword" placeholder="Confirm Password" type="password" required />
                  <div className="mt-2 flex justify-between">
                    <div className="mt-2">
                      <input type="radio" id="faculty" name="role" value="Faculty" onChange={e => setRole(e.target.value)} defaultChecked />
                      <label className="ml-1 text-xs">Faculty</label>
                    </div>
                    <div className="mt-2">
                        <input type="radio" id="assistant" name="role" value="Assistant"onChange={e => setRole(e.target.value)} />
                        <label className="ml-1 text-xs">Assistant</label>
                    </div>
                  </div>
                  
                  {passwordError && <div className="text-m mb-1 mt-6 text-red-600">{passwordError}</div>}
                  <button className="btn btn-neutral mt-4 min-h-5 h-8 w-full" type="submit">Create Account</button>
                </form>
              </div>
            </div>
          )}
          {!loading && newUserPassword && (
            <div>
              <h1 className="text-3xl font-bold my-3 text-zinc-600">New User</h1>
              <p className='text-sm'>Please enter a the following information for your account.</p>
              <div className='flex flex-col items-center justify-center max-w-xl'>
                <form onSubmit={handleNewPasswordUser}>
                  <label className="block text-xs mt-4">First Name</label>
                  <input className="input input-bordered mt-1 h-10 w-full text-xs" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="First Name" required />
                  <label className="block text-xs mt-4">Last Name</label>
                  <input className="input input-bordered mt-1 h-10 w-full text-xs" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Last Name" required />
                  <label className="block text-xs mt-4">New Password</label>
                  <input className="input input-bordered mt-1 h-10 w-full text-xs" name="newPassword" placeholder="New Password" type="password" required />
                  <label className="block text-xs mt-4">Confirm New Password</label>
                  <input className="input input-bordered mt-1 h-10 w-full text-xs" name="confirmNewPassword" placeholder="Confirm New Password" type="password" required />
                  <div className="mt-2 flex justify-between">
                    <div className="mt-2">
                      <input type="radio" id="faculty" name="role" value="Faculty" onChange={e => setRole(e.target.value)} defaultChecked />
                      <label className="ml-1 text-xs">Faculty</label>
                    </div>
                    <div className="mt-2">
                        <input type="radio" id="assistant" name="role" value="Assistant"onChange={e => setRole(e.target.value)} />
                        <label className="ml-1 text-xs">Assistant</label>
                    </div>
                    <div className="mt-2">
                        <input type="radio" id="admin" name="role" value="Admin"onChange={e => setRole(e.target.value)} />
                        <label className="ml-1 text-xs">Admin</label>
                    </div>
                  </div>
                  {passwordError && <div className="block text-m mb-1 mt-6 text-red-600">{passwordError}</div>}
                  <button className="btn btn-neutral mt-4 min-h-5 h-8 w-full" type="submit">Submit</button>
                </form>
              </div>
            </div>
            
          )}
          {!loading && signUpConfirmation && (
            <div>
              <h1 className="text-3xl font-bold my-3 text-zinc-600">Account not confirmed</h1>
              <p className='text-sm'>Please enter the confirmation code sent to your email.</p>
              <div className='flex flex-col items-center justify-center'>
                <form onSubmit={handleConfirmSignUp}>
                  <input className="input input-bordered mt-1 h-10 w-full text-xs" name="confirmationCode" placeholder="Confirmation Code" type="password" required />
                  {confirmationError && <div className="block text-m mb-1 mt-6 text-red-600">{confirmationError}</div>}
                  <button className="btn btn-neutral mt-4 min-h-5 h-8 w-full" type="submit">Submit</button>
                  <button className="btn btn-secondary mt-4 min-h-5 h-8 w-full" type="button" onClick={resendConfirmationCode}>Resend Code</button>
                </form>
              </div>
              
            </div>
          )}
        </div>
        <div className="w-2/5" style={{ backgroundImage: "url(/UBC.jpg)", backgroundRepeat: "no-repeat", backgroundSize: "cover" }}></div>
      </div>
   </PageContainer>
  );
};

export default AuthPage;