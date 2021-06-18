import React, { useState, useEffect } from 'react';
import './Clock.css'

//React time component


import { Container, Col, Row } from 'react-bootstrap';

const Clock = ({day, hour, minute, second}) => {

return (
    <div className="main-container">
        <Container>
            <Row>
                <Col className="center">
                    <span className="clock-value">
                      <span>{day}</span>
                    </span>
                    <Row>
                        <span className="gray center">day</span>
                    </Row>
                </Col>


                <Col className="center">
                    <span className="clock-value">
                        <span>{hour}</span>
                    </span>
                    <Row>
                        <span className="gray center">hr</span>
                    </Row>
                </Col>


                <Col className="center">
                    <span className="clock-value">
                    <span>{minute}</span>
                    </span>
                    <Row>
                        <span className="gray center">min</span>
                    </Row>
                </Col>


                <Col className="center">
                    <span className="clock-value">
                    <span>{second}</span>
                    </span>
                    <Row>
                        <span className="gray center">sec</span>
                    </Row>
                </Col>
            </Row>
        </Container>


    </div>
)
    

}

export default Clock;