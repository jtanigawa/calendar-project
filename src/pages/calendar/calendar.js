import * as React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { auth } from '../../firebase/utils';

import styled, { css } from 'styled-components';

const Frame = styled.div`
  width: auto;
  border: 1px solid lightgrey;
  box-shadow: 2px 2px 2px #eee;
  background-color: #f5f6fa;
`;

const Header = styled.div`
  height: 80px;
  font-size: 18px;
  font-weight: bold;
  padding: 10px 10px 5px 10px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  background-color: #f5f6fa;
`;

const LogInSignUp = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
`;

const Button = styled.div`
  cursor: pointer;
`;

const Body = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
`;

const Month = styled.div`
  font-size: 24px;
  font-weight: bold;
`;

const Day = styled.div`
  width: 14.2%;
  height: 210px;
  font-size: 16px;
  font-weight: 500;
  padding: 10px 0px 0px 0px;
  border: 1px solid LightGrey;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  background-color: White;

  ${props => 
    props.isWeekDay &&
    css`
      height: 25px;
      padding: 5px 0px 0px 0px;
      background-color: #f5f6fa;
      border: none;
    `}

  ${props =>
    props.isToday &&
    css`
      border: 1.3px solid Black;
    `}

  ${props =>
    props.isSelected &&
    css`
      background-color: #eee;
    `}
`;

const CreateEventLink = styled(Link)`
  margin-top: 10px;
`;

const EventInfo = styled.span`
  visibility: hidden;
  width: 150px;
  background-color: black;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 0;
  position: absolute;
  z-index: 1;
`;

const EventLink = styled(Link)`
  margin-top: 10px;
  &:hover ${EventInfo} {
    visibility: visible;
  }
`;



const Calendar = ({ currentUser }) => {

  // comparator for sorting events by time
  const compareEvents = (a, b) => {
    const dayA = a.day;
    const dayB = b.day;

    let comparison = 0;
    if (dayA > dayB) {
      comparison = 1;
    }else if (dayA < dayB) {
      comparison = -1;
    }

    if (comparison === 0) {
      const startA = a.start;
      const startB = b.start;

      if (startA.split(':')[0] > startB.split(':')[0]) {
        comparison = 1;
      }else if (startA.split(':')[0] < startB.split(':')[0]) {
        comparison = -1;
      }
    }
    return comparison;
  }

  // convert time to AM/PM
  const convertTime = (time) => {
    let hr = time.split(':')[0];

    if (hr > 12) {
      hr = hr - 12;
      return hr + ':' + time.split(':')[1] + ' pm';
    }else{
      return time + ' am';
    }
  }

  //Get list of events for a specified day
  const getEvents = (user, year, month, currDay) => {
    const yrMo = year + '' + month;
    const ucal = user ? user.calendar : null;
    if (!ucal || !(yrMo in ucal)) return;

    // sort events by day and time
    ucal[yrMo].sort(compareEvents);

    // build list of events
    let events = [];
    for (const event of ucal[yrMo]) {
      if (currDay === event.day) {
        events.push(<EventLink to={{
                      pathname: '/viewevent',
                      state: {
                        eventMonth: month,
                        eventDay: currDay,
                        eventYear: year,
                        eventWeekDay: new Date(year, month, currDay).getDay(),
                        user: user,
                        event: event
                      }
                    }}>
                      {event.name}
                      <EventInfo>
                        {convertTime(event.start)}-{convertTime(event.end)}
                      </EventInfo>
                    </EventLink>);
      }
    }
    return events;
  }

  // build create event link
  const getCreateEventLink = (user, currDay, day, mo, yr, date) => {
    if (currDay === day && user) {
      return <CreateEventLink to={{
                pathname: '/newevent',
                state: {
                  eventMonth: mo,
                  eventDay: currDay,
                  eventYear: yr,
                  eventWeekDay: date.getDay(),
                  user: user
                }
              }}>Create event</CreateEventLink>;
    }
  }

  const getStartWeekdayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  }

  const isLeapYear = (year) => {
    if (year % 4 !== 0) return false;
    else if (year % 25 !== 0) return true;
    else if (year % 16 !== 0) return false;
    else return true;
  }

  const today = new Date();
  const [date, setDate] = useState(today);
  const [day, setDay] = useState(date.getDate());
  const [month, setMonth] = useState(date.getMonth());
  const [year, setYear] = useState(date.getFullYear());
  const [startWeekday, setStartWeekday] = useState(getStartWeekdayOfMonth(date));

  useEffect(() => {
    setDay(date.getDate());
    setMonth(date.getMonth());
    setYear(date.getFullYear());
    setStartWeekday(getStartWeekdayOfMonth(date));
  }, [date]);

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June'];
  monthNames.push('July', 'August', 'September', 'October', 'November', 'December');

  // determine days in each month 
  let daysInMonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  daysInMonths = isLeapYear(date.getFullYear()) ? 
  daysInMonths.slice(0,1).concat([29], daysInMonths.slice(2,12))
  :
  daysInMonths;
  const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  
  return (
    <Frame>
      <Header>
        <LogInSignUp>
          {
            currentUser ?
            <Button onClick={() => auth.signOut()}>Sign out</Button>
            :
            <Link to='/signin'>Sign in</Link>
          }

        </LogInSignUp>
        <Button onClick={() => setDate(new Date(year, month - 1, day))}>Prev</Button>
        <Month>
          {monthNames[month]} {year}
        </Month>
        <Button onClick={() => setDate(new Date(year, month + 1, day))}>Next</Button>
      </Header>
      <Body>
        {weekDays.map(weekDay => (
          <Day key={weekDay} isWeekDay>
            <strong>{weekDay}</strong>
          </Day>
        ))}
        {Array(daysInMonths[month] + startWeekday)
          .fill(null)
          .map((_, index) => {
            const currDay = index - (startWeekday - 1);
            //console.log(month + " " + currDay + " " + startWeekday + " " + index);
            return (
              <Day
                key={index}
                isToday={currDay === today.getDate()}
                isSelected={currDay === day}
                onClick={() => setDate(new Date(year, month, currDay))}
              >
                {currDay > 0 ? currDay : ''}
                {getEvents(currentUser, year, month, currDay)}
                {getCreateEventLink(currentUser, currDay, day, month, year, date)}
              </Day>
            );
          })}
      </Body>
    </Frame>
  );
}

export default Calendar;