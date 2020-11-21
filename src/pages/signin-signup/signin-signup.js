import React from 'react';

import Signin from '../../components/signin/signin';
import Signup from '../../components/signup/signup';

import styled from 'styled-components';

const SignInAndSignUpContainer = styled.div`
  width: 850px;
  display: flex;
  justify-content: space-between;
  margin: 30px auto;
`

const SigninSignup = () => (
  <SignInAndSignUpContainer>
    <Signin />
    <Signup />
  </SignInAndSignUpContainer>
);

export default SigninSignup;