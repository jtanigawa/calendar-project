import React from 'react';

import FormInput from '../form-input/form-input';
import CustomButton from '../custom-button/custom-button';

import { auth, createUserProfileDocument } from '../../firebase/utils';

import styled from 'styled-components';

const SignUpContainer = styled.div`
  width: 30vw;
  display: flex;
  flex-direction: column;
`

const Title = styled.h2`
  margin: 10px 0;
`

class Signup extends React.Component {

  _isMounted = false;

  constructor() {
    super();

    this.state = {
      displayName: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleSubmit = async (event) => {
    event.preventDefault();

    const {displayName, email, password, confirmPassword} = this.state;

    if (password !== confirmPassword) {
      alert('passwords don\'t match');
      return;
    }

    try {
      const {user} = await auth.createUserWithEmailAndPassword(email, password);

      await createUserProfileDocument(user, {displayName});

      if (this._isMounted) {
        this.setState({
          displayName: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
      }
    }catch (error) {
      console.error(error);
    }
  };

  handleChange = (event) => {
    const { name, value } = event.target;

    this.setState({
      [name]: value
    });
  }

  render() {

    const {displayName, email, password, confirmPassword} = this.state;

    return(
      <SignUpContainer>
        <Title>I do not have an account</Title>
        <span>Sign up with your email and password</span>

        <form onSubmit={this.handleSubmit}>
          <FormInput
            type='text'
            name='displayName'
            value={displayName}
            onChange={this.handleChange}
            label='Display Name'
            required
          />

          <FormInput
            type='email'
            name='email'
            value={email}
            onChange={this.handleChange}
            label='Email'
            required
          />
          <FormInput
            type='password'
            name='password'
            value={password}
            onChange={this.handleChange}
            label='Password'
            required
          />
          <FormInput
            type='password'
            name='confirmPassword'
            value={confirmPassword}
            onChange={this.handleChange}
            label='Confirm Password'
            required
          />
          <CustomButton type='submit'>Sign up</CustomButton>
        </form>
      </SignUpContainer>
    )
  }
}

export default Signup;