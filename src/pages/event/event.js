import React from 'react';

import NewEvent from '../../components/new-event/new-event';
import ViewEvent from '../../components/view-event/view-event';

import styled from 'styled-components';

const EventContainer = styled.div`
  width: 850px;
  display: flex;
  justify-content: center;
  margin: 30px auto;
`

const Event = (props) => {

  const {eventMonth, eventDay, eventYear, eventWeekDay} = props.location.state;
  const {user} = props.location.state;

  if (props.location.pathname === '/newevent') {
    return (
      <EventContainer>
        <NewEvent
          month={eventMonth}
          day={eventDay}
          year={eventYear}
          weekday={eventWeekDay}
          user={user}
        />
      </EventContainer>
    );
  }else {
    const {event} = props.location.state;
    return (
      <EventContainer>
        <ViewEvent
          month={eventMonth}
          day={eventDay}
          year={eventYear}
          weekday={eventWeekDay}
          user={user}
          event={event}
        />
      </EventContainer>
    )
  }
};

export default Event;