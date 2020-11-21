import React from 'react';

import FormInput from '../form-input/form-input';
import CustomButton from '../custom-button/custom-button';

import { auth, signInWithGoogle } from '../../firebase/utils';

import styled from 'styled-components';

const SigninContainer = styled.div`
  width: 30vw;
  display: flex;
  flex-direction: column;
`

const Title = styled.h2`
  margin: 10px 0;
`

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
`

class Signin extends React.Component {

  constructor() {
    super();

    this.state = {
      email: '',
      password: ''
    }
  }

  handleSubmit = async (event) => {
    event.preventDefault();

    const { email, password } = this.state;

    try {
      await auth.signInWithEmailAndPassword(email, password);

      this.setState({
        email: '',
        password: ''
      });
    }catch (error) {
      console.log(error);
    }


  }

  handleChange = (event) => {
    const { value, name } = event.target;

    this.setState({
      [name]: value
    })
  }

  render() {
    return (
      <SigninContainer>
        <Title>I already have an account</Title>
        <span>Sign in with your email and password</span>

        <form onSubmit={this.handleSubmit}> 
          <FormInput 
            name='email'
            type='email'
            label='email'
            value={this.state.email}
            handleChange={this.handleChange}
            required 
          />

          <FormInput
            name='password'
            type='password'
            label='password'
            value={this.state.password}
            handleChange={this.handleChange}
            required 
          />
          <ButtonsContainer>
            <CustomButton type='submit'>Sign in</CustomButton>
            <CustomButton
              type='button'
              onClick={signInWithGoogle}
              isGoogleSignIn
            >
              Google sign in
            </CustomButton>
          </ButtonsContainer>  
        </form>
      </SigninContainer>
    );
  }
}

export default Signin;