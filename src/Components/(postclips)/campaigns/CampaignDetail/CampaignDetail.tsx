"use client";
import React, { useEffect, useState } from 'react';
import { Container, Form, FormGroup, Label, Input, Button, Row, Col } from 'reactstrap';
import { useCampaigns, PreviewImage, ExampleClip } from '@/Hooks/useCampaigns';
import { toast } from 'react-toastify';
import { fetchAPI } from "@/Clients/postclips/server/ApiClient";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { setStep } from "@/Redux/Reducers/(postclips)/auth/HeaderSlice";
import CampaignStep1 from './Steps/CampaignStep1';
import CampaignStep2 from './Steps/CampaignStep2';
import { Campaign } from '@/Types/(postclips)/Campaign';

interface CampaignDetailProps {
    campaign: Campaign
}

const CampaignDetail: React.FC<CampaignDetailProps> = ({ campaign }) => {
    const [formData, setFormData] = useState({
        title: campaign.title,
        description: campaign.description,
        brand_message: campaign.brand_message,
        targeted_amount_of_views: campaign.targeted_amount_of_views || '',
        amount_cpm_payout: campaign.amount_cpm_payout || '',
        total_budget: campaign.total_budget || '',
        start_date: campaign.start_date ? new Date(campaign.start_date).toISOString().split('T')[0] : '',
        end_date: campaign.end_date ? new Date(campaign.end_date).toISOString().split('T')[0] : ''
    });

    const { updateCampaignDraft } = useCampaigns();
    const dispatch = useAppDispatch();
    const { currentStep, steps } = useAppSelector((state) => state.header);

    const handleSaveDraft = async () => {
        try {
            const dataToSave = {
                ...formData,
                targeted_amount_of_views: formData.targeted_amount_of_views === '' ? 0 : parseFloat(formData.targeted_amount_of_views as string),
                amount_cpm_payout: formData.amount_cpm_payout === '' ? 0 : parseFloat(formData.amount_cpm_payout as string),
                total_budget: formData.total_budget === '' ? 0 : parseFloat(formData.total_budget as string)
            };
            return await updateCampaignDraft(campaign.id, dataToSave);
        } catch (error) {
            toast.error('Error saving campaign draft');
        }
    };

    const handleStep = async (type: 'next' | 'previous') => {
        try {
            const response = await handleSaveDraft();
            if (response?.success) {
                dispatch(setStep(currentStep + (type === 'next' ? 1 : -1)));
            }
        } catch (error) {
            toast.error('Error saving campaign draft');
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return <CampaignStep1 campaign={campaign} handleSaveDraft={handleSaveDraft} onNextStep={() => handleStep('next')} />;
            case 2:
                return <CampaignStep2 campaign={campaign} handleSaveDraft={handleSaveDraft} onNextStep={() => handleStep('next')} onPreviousStep={() => handleStep('previous')} />;
            default:
                return <CampaignStep1 campaign={campaign} handleSaveDraft={handleSaveDraft} onNextStep={() => handleStep('next')} />;
        }
    };

    return (
        <>
            {renderStep()}
        </>
    );
};

export default CampaignDetail;
