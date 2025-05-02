'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import CampaignDetail from '@/Components/(postclips)/campaigns/CampaignDetail/CampaignDetail';
import { useCallback } from 'react';

interface CampaignDetailWrapperProps {
    campaign: {
        id: string;
        title: string;
        description: string;
        profile_picture: string | null;
        targeted_social_networks: string[];
        end_date: string | null;
        targeted_amount_of_views: number;
        amount_cpm_payout: number;
        status: string;
        rules: string[];
        brand_message: string | null;
        total_budget: number;
        preview_images: {
            id: string;
            image_url: string;
            created_at: string;
            campaign_id: string;
        }[];
        example_clips: {
            id: string;
            clip_url: string;
            created_at: string;
            campaign_id: string;
        }[];
    };
}

const CampaignDetailWrapper: React.FC<CampaignDetailWrapperProps> = ({ campaign }) => {
    const router = useRouter();

    const handleRedirect = useCallback(() => {
        router.push('/brand/campaigns');
    }, [router]);

    useEffect(() => {
        if (!campaign) {
            toast.error('Campaign not found');
            handleRedirect();
            return;
        }

        if (campaign.status === 'active') {
            toast.error('You cannot edit active campaigns');
            handleRedirect();
            return;
        }
    }, [campaign, handleRedirect]);

    if (!campaign || campaign.status === 'active') {
        return null;
    }

    return <CampaignDetail campaign={campaign} />;
};

export default CampaignDetailWrapper; 