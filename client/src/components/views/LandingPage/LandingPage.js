import React from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';

const LandingPage = (props) => {
  const onClickHandler = () => {
    axios.get(`/api/users/logout`).then((response) => {
      if (response.data.success) {
        props.history.push('/login');
      } else {
        alert('로그아웃 할 수 없습니다.!!');
      }
    });
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100vh',
      }}
    >
      <h2>Landing Page</h2>
      <button onClick={onClickHandler}>로그아웃</button>
    </div>
  );
};

export default withRouter(LandingPage);
