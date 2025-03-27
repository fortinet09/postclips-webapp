"use client";

import React from "react";
import { CardBody, Card, Col, Container, Row } from "reactstrap";
import { useAuth } from "@/Providers/SessionProvider";

const ClipsApproval = () => {
  const { session } = useAuth();
    
  return (
    <Container fluid>
      <Row>
        <Col sm={12}>
          <Card className="mt-5">
            <CardBody>
              <h1>Clips Approval</h1>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
export default ClipsApproval;
