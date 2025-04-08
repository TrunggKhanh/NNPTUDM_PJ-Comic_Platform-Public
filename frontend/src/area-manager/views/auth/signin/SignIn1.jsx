import React from 'react';
import { Card} from 'react-bootstrap';
import Breadcrumb from '../../../layouts/AdminLayout/Breadcrumb';
import imgManager from "../../../../assets/logo4.png";

import AuthLogin from './JWTLogin';

const Signin1 = () => {
  return (
    <React.Fragment>
      <Breadcrumb />
      <div className="auth-wrapper">
        <div className="auth-content">
          <div className="auth-bg">
            <span className="r" />
            <span className="r s" />
            <span className="r s" />
            <span className="r" />
          </div>
          <Card className="borderless text-center">
            <Card.Body>
              <div className="mb-4">
                {/* <i className="feather icon-unlock auth-icon" /> */}
                <img src={imgManager} alt="Image Manager" style={{width: '200px'}} />
              </div>
              <AuthLogin />
              
            </Card.Body>
          </Card>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Signin1;
