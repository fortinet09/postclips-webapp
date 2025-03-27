import CommonCardHeader from '@/CommonComponent/CommonCardHeader';
import { CenteredModalTitle, VerticallyCentered } from '@/Constant';
import { centeredModalSubTitle } from '@/Data/UiKits/Modal';
import React, { useState } from 'react'
import { Button, Card, CardBody, Col } from 'reactstrap';
import CreateCampaignModalForm, { CreateCampaignModalFormProps } from './CreateCampaignModalForm';

const CreateCampaignModal = ({
    modal,
    toggle
}: CreateCampaignModalFormProps) => {

    return (
        <CreateCampaignModalForm modal={modal} toggle={toggle} />
    )
}
export default CreateCampaignModal;