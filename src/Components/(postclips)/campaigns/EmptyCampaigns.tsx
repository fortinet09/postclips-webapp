import React from 'react';
import { Container, Button } from 'reactstrap';

interface EmptyCampaignsProps {}

const EmptyCampaigns: React.FC<EmptyCampaignsProps> = () => {
    return (
        <Container fluid className="empty-campaigns">
            <div className="empty-campaigns__content">
                <h2>Create your first campaign</h2>
                <p>This is your starting point to go viral</p>
                <Button
                    color="primary"
                    className="btn-chipped"
                >
                    CREATE CAMPAIGN
                </Button>
            </div>
        </Container>
    );
};

export default EmptyCampaigns;
