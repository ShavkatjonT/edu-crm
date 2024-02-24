import React from 'react';
import { Radio, RevolvingDot, Rings, RotatingLines, BallTriangle, Blocks, ThreeCircles } from 'react-loader-spinner';
import styled from 'styled-components';
import PropTypes from 'prop-types';
const Loder = ({ stop }) => {
  return (
    <div>
      {stop && (
        <Container stop={stop}>
          <Content>
            <ThreeCircles
              visible={true}
              height='70'
              width='70'
              radius='9'
              color='#e0970f'
              ariaLabel='three-dots-loading'
            />
          </Content>
        </Container>
      )}
    </div>
  );
};

const Container = styled.div`
  position: fixed;
  left: 0;
  bottom: 0;
  right: 0;
  top: 0;
  z-index: 99999;
  width: 100%;
  background-color: rgba(221, 221, 221, 0.884);
  backdrop-filter: blur(5px);
`;
const Content = styled.div`
  position: absolute;
  left: 48%;
  transform: translateX(-50%);
  top: 50%;
  transform: translateY(-50%);
  @media screen and (max-width: 550px) {
    left: 42.5%;
    transform: translateX(-50%);
    top: 49%;
    transform: translateY(-49%);
  }
`;
Loder.propTypes = {
  stop: PropTypes.bool.isRequired,
};

// ThreeCircles

// Triangle

export default Loder;
