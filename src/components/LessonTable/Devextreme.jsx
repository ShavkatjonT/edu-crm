import React from 'react';
import Scheduler, { Resource, View} from 'devextreme-react/scheduler';
import PropTypes from 'prop-types';
const currentDate = new Date();
const startHour = 5;
const endHour = 22;
const groups = ['room_id'];
function Devextreme({resources, appointments}) {

  const formatTime = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
    }).format(date);
  };  


  return (
    <Scheduler
      dataSource={appointments}
      height={600}
      defaultCurrentView='timelineDay'
      defaultCurrentDate={currentDate}
      cellDuration={60}
      startDayHour={startHour}
      endDayHour={endHour}
      adaptivityEnabled={false}
      editing={false}
      showAllDayPanel={false}
      crossScrollingEnabled={true}
      groups={groups}
      style={{border: '1px solid #C4C4C4'}}
      >
         <View
            type="timelineDay"
            name="Test"
            groupOrientation="vertical"
            timeCellTemplate={(data) => {
              return formatTime(data.date);
            }}
          />
      <Resource
        fieldExpr='room_id'
        dataSource={resources}
        label='Room'
        allowMultiple={false}
        
      />
  </Scheduler>
  );
}

Devextreme.propTypes = {
  resources: PropTypes.array.isRequired,
  appointments: PropTypes.array.isRequired,
};


export default Devextreme;
