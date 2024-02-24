import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PropTypes from 'prop-types';

const MessageTable = (props) => {
    const [expanded, setExpanded] = React.useState(false);
    const { mesData } = props;
    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    return (
        <div style={{ marginTop: '0.3rem' }}>
            {
                mesData &&
                mesData.map((e, index) => (
                    <Accordion
                         key={index}
                        expanded={expanded === `panel${index}`}
                        onChange={handleChange(`panel${index}`)}
                        sx={{ width: '100%',}}
                    >
                        <AccordionSummary
                            style={{color: '#484747', fontSize: '1rem', fontWeight: 'bold'}}
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1bh-content"
                            id="panel1bh-header"
                        >
                            <p style={{width:'6%'}} >
                                {index + 1}
                            </p>
                            <p  style={{width:'27%'}} >
                                {e.student}
                            </p>
                            <p  style={{width:'20.5%'}} >
                                {e.phone}
                            </p>
                            <p  style={{width:'26%'}} >
                                {e.groupName}
                            </p>
                            <p  style={{width:'20%'}} >
                                {e.time.substring(4, 24)}
                            </p>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography sx={{marginLeft: '6%'}}>
                               Yuborilgan xabar
                            </Typography>
                            <p style={{marginLeft: '6%'}}>{e.messageText}</p>
                        </AccordionDetails>
                    </Accordion>
                ))
            }


        </div>
    );
};

MessageTable.propTypes = {
    mesData: PropTypes.array.isRequired,
};

export default MessageTable;