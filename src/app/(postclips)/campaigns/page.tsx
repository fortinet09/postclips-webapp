"use client";
import { ECommerceTitle, ProductListTitle } from "@/Constant";
import React from "react";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import Breadcrumbs from "@/CommonComponent/BreadCrumbs";
import CampaignTable from "@/Components/(postclips)/campaigns/CampaignList/CampaignTable";
import CampaignHeader from "@/Components/(postclips)/campaigns/CampaignList/CampaignHeader";

const Campaigns = () => {
  return (
    <Container fluid>
      <Row>
        <Col sm={12}>
          <Card className="mt-5">
            <CardBody>
              <CampaignHeader linkTitle="New Campaign" />
              <CampaignTable />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
export default Campaigns;
