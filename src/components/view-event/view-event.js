import React from 'react';
import { Link, Redirect } from 'react-router-dom';

import FormInput from '../form-input/form-input';
import CustomButton from '../custom-button/custom-button';

import { addEventToCalendar } from '../../firebase/utils';

import styled from 'styled-components';

const Title = styled.h2`
  margin: 10px 0;
`

const NewEventContainer = styled.div`
  width: 50vw;
  display: flex;
  flex-direction: column;
`

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
`

class ViewEvent extends React.Component {

  weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  constructor(props) {
    super(props);

    this.state = {
      eventName: this.props.event.name,
      month: this.props.month > 9 ? this.props.month : "0" + this.props.month,
      monthName: this.monthNames[this.props.month],
      day: this.props.day,
      year: this.props.year,
      weekday: this.weekDays[this.props.weekday],
      startTime: this.props.event.start,
      endTime: this.props.event.end,
      guestEmail: this.props.event.guestEmail,
      description: this.props.event.description,
      user: this.props.user,
      fireRedirect: false
    }
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    
    const {eventName, month, day, year} = this.state;
    const {startTime, endTime, guestEmail, description, user} = this.state;

    if (startTime === endTime) {
      alert('event start and end are the same');
      return;
    }

    if (startTime.split(':')[0] > endTime.split(':')[0]) {
      alert('event start is after end');
      return;
    }

    if (startTime.split(':')[0] === endTime.split(':')[0] &&
        startTime.split(':')[1] > endTime.split(':')[1]) {
      alert('event start is after end');
      return;
    }

    const yrMo = year + '' + month;

    await addEventToCalendar(user, {yrMo, day, eventName, startTime, endTime, guestEmail, description});

    this.setState({
      fireRedirect: true
    })
  }


  handleChange = (event) => {
    const { name, value } = event.target;

    this.setState({
      [name]: value
    });
  }

  render() {

    const {eventName, startTime, endTime, guestEmail, description} = this.state;
    const {monthName, day, year, weekday, fireRedirect} = this.state;

    return(
      <NewEventContainer>
        <Title>View event for {weekday}, {monthName} {day}, {year}</Title>

        <form>
          <FormInput 
            type='text'
            name='eventName'
            value={eventName}
            onChange={this.handleChange}
            label='Event Name'
            disabled
          />
          <FormInput 
            type='time'
            name='startTime'
            value={startTime}
            onChange={this.handleChange}
            label='Event Start'
            disabled
          />
          <FormInput 
            type='time'
            name='endTime'
            value={endTime}
            onChange={this.handleChange}
            label='Event End'
            disabled
          />
          <FormInput
            type='email'
            name='guestEmail'
            value={guestEmail}
            onChange={this.handleChange}
            label='Guest Email'
            disabled
          />
          <FormInput 
            type='text'
            name='description'
            value={description}
            onChange={this.handleChange}
            label='Event Description'
            disabled
          />
          <ButtonsContainer>
            <Link to='/'><CustomButton type='button'>Back</CustomButton></Link>
          </ButtonsContainer>  
        </form>
        {fireRedirect && (<Redirect to='/' />)}
      </NewEventContainer>
    );
  }
}

export default ViewEvent;