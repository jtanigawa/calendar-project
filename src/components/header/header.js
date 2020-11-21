import React from 'react';
import { Link } from 'react-router-dom';

import styled from 'styled-components';

const Title = styled.div`
  height: 70px;
  font-size: 36px;
  font-weight: bold;
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 25px;
`;

const Header = () => (
  <Title>
    <Link to='/'>
      CALENDAR
    </Link>
  </Title>
);

export default Header;