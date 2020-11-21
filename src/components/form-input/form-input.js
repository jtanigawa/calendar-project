import React from 'react';

import styled, { css } from 'styled-components';

const Group = styled.div`
  position: relative;
  margin: 45px 0;
  input[type='password'] {
    letter-spacing: 0.3em;
  }
`

const shrink = css`
  top: -14px;
  font-size: 12px;
  color: black;
`

const getLabelStyles = (props) => {
  if (props.value.length || props.type === "time") {
    return shrink
  }
}

const FormInputLabel = styled.label`
  color: grey;
  font-size: 16px;
  font-weight: normal;
  position: absolute;
  pointer-events: none;
  left: 5px;
  top: 10px;
  transition: 300ms ease all;
  ${getLabelStyles}
`

const FormInputContainer = styled.input`
  background: none;
  background-color: white;
  color: grey;
  font-size: 18px;
  padding: 10px 10px 10px 5px;
  display: block;
  width: 100%;
  border: none;
  border-radius: 0;
  border-bottom: 2px solid grey;
  margin: 25px 0;
  &:focus {
    outline: none;
  }
  &:focus ~ ${FormInputLabel} {
    top: -14px;
    font-size: 12px;
    color: black;
  }
`

const FormInput = ({handleChange, label, ...props}) => {

  return (
    <Group>
      <FormInputContainer onChange={handleChange} {...props} />
      {
        label ?
        <FormInputLabel {...props}>{label}</FormInputLabel>
        :
        null
      }
    </Group>
  );
}

export default FormInput;