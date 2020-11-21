import React from 'react';
import { Link, Redirect } from 'react-router-dom';

import styled from 'styled-components';

import FormInput from '../form-input/form-input';
import CustomButton from '../custom-button/custom-button';

import { addEventToCalendar } from '../../firebase/utils';

import emailjs from 'emailjs-com';
import { init } from 'emailjs-com';
init("user_t5XUsgFioK2raWZfkQsVE");



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


class NewEvent extends React.Component {

  weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  constructor(props) {
    super(props);

    this.state = {
      eventName: '',
      month: this.props.month > 9 ? this.props.month : "0" + this.props.month,
      monthName: this.monthNames[this.props.month],
      day: this.props.day,
      year: this.props.year,
      weekday: this.weekDays[this.props.weekday],
      startTime: '',
      endTime: '',
      guestEmail: '',
      description: '',
      user: this.props.user,
      fireRedirect: false
    }
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    
    const {eventName, month, monthName, weekday, day, year} = this.state;
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

    const convertTime = (time) => {
      let hr = time.split(':')[0];
  
      if (hr > 12) {
        hr = hr - 12;
        return hr + ':' + time.split(':')[1] + ' pm';
      }else{
        return time + ' am';
      }
    }

    let eventInfo = eventName + '\n';
    eventInfo += 'scheduled for ' + weekday + ', ' + monthName + ' ' + day + ', ' + year + '\n';
    eventInfo += 'from ' + convertTime(startTime) + ' to ' + convertTime(endTime);
    let emailData = {};
    emailData.message = eventInfo;
    emailData.email = guestEmail;

    await emailjs.send('service_6s3jbl6', 'template_c186aro', emailData);

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
        <Title>Create new event for {weekday}, {monthName} {day}, {year}</Title>
        <span>Fill in the details for your event</span>

        <form onSubmit={this.handleSubmit}>
          <FormInput 
            type='text'
            name='eventName'
            value={eventName}
            onChange={this.handleChange}
            label='Event Name'
            required
          />
          <FormInput 
            type='time'
            name='startTime'
            value={startTime}
            onChange={this.handleChange}
            label='Event Start'
            required
          />
          <FormInput 
            type='time'
            name='endTime'
            value={endTime}
            onChange={this.handleChange}
            label='Event End'
            required
          />
          <FormInput
            type='email'
            name='guestEmail'
            value={guestEmail}
            onChange={this.handleChange}
            label='Guest Email'
            required
          />
          <FormInput 
            type='text'
            name='description'
            value={description}
            onChange={this.handleChange}
            label='Event Description'
            required
          />
          <ButtonsContainer>
            <CustomButton type='submit'>Create Event</CustomButton>
            <Link to='/'><CustomButton type='button'>Cancel</CustomButton></Link>
          </ButtonsContainer>  
        </form>
        {fireRedirect && (<Redirect to='/' />)}
      </NewEventContainer>
    );
  }
}

export default NewEvent;