import React from 'react';
import styled from 'styled-components';

const ErrorContent = styled.div`
  @import url('https://fonts.googleapis.com/css2?family=Rubik+Bubbles&display=swap');
  width: 100%;
  margin-top: 2.8rem;
  padding-top: 10px;
  padding-bottom: 10px;
  background-color: white;
  display: flex;
  justify-content: center;
  .error_center {
    width: 65%;
    text-align: center;
    img {
      width: 88%;
    }
    h1 {
      margin-top: 1rem;
      margin-bottom: 1rem;
      color: #042954;
      font-size: 2.5rem;
      font-family: 'Rubik Bubbles', cursive;
      font-weight: bold;
    }
  }
`;

function ErrorPage() {
  return (
    <ErrorContent>
      <div className='error_center'>
        <h1>Bunday sahifa topilmadi</h1>
        <img src='/images/error.png' alt='' />
      </div>
    </ErrorContent>
  );
}

export default ErrorPage;
