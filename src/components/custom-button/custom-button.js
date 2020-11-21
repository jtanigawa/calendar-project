import React from 'react';

import styled, { css } from 'styled-components';

const buttonStyles = css`
  background-color: black;
  color: white;
  border: none;
  &:hover {
    background-color: white;
    color: black;
    border: 3px solid black;
  }
`

const invertedButtonStyles = css`
  background-color: white;
  color: black;
  border: 3px solid black;
  &:hover {
    background-color: black;
    color: white;
    border: none;
  }
`

const googleSignInStyles = css`
  background-color: CornflowerBlue;
  color: white;
  &:hover {
    background-color: RoyalBlue;
    border: 3px solid black;
  }
`

const getButtonStyles = (props) => {
  if (props.isGoogleSignIn) {
    return googleSignInStyles
  }
  return props.inverted ? invertedButtonStyles : buttonStyles;
}

const CustomButtonContainer = styled.button`
  min-width: 165px;
  width: auto;
  height: 55px;
  line-height: 50px;
  padding: 0 35px 0 35px;
  font-size: 17px;
  font-weight: bold;
  cursor: pointer;
  border-radius: 25px;
  display: flex;
  justify-content: center;

  ${getButtonStyles}
`

const CustomButton = ({children, ...props}) => (
  <CustomButtonContainer {...props}>{children}</CustomButtonContainer>
);

export default CustomButton;