import React from "react";
import { fetchAPI } from "@/Clients/postclips/server/ApiClient";
import CampaignDetailWrapper from "@/Components/(postclips)/campaigns/CampaignDetail/CampaignDetailWrapper";
import CampaignNotFound from "@/Components/(postclips)/campaigns/CampaignNotFound";
import { Campaign } from "@/Types/(postclips)/Campaign";

type PageProps = {
    params: {
        id: string;
    };
    searchParams?: { [key: string]: string | string[] | undefined };
};

interface CampaignResponse {
    success: boolean;
    message: string;
    data: Campaign | null;
}

async function getCampaign(campaignId: string): Promise<Campaign | null> {
    try {
        const response = await fetchAPI<CampaignResponse>("GET", `/campaigns/${campaignId}`);
        if (!response?.success || !response?.data || !response?.data?.data) {
            return null;
        }
        return response.data.data;
    } catch (error) {
        console.error("Error fetching campaign:", error);
        return null;
    }
}

async function verifyPermissions(campaignId: string): Promise<boolean> {
    try {
        const response = await fetchAPI("GET", `/campaigns/${campaignId}/verify-permissions`);
        return response?.success ?? false;
    } catch (error) {
        console.error("Error verifying permissions:", error);
        return false;
    }
}

export default async function CampaignDetailPage({ params }: PageProps) {
    const { id } = await params;

    // Validate campaign ID
    if (!id || typeof id !== 'string') {
        return <CampaignNotFound />;
    }

    // Get campaign data
    const campaign = await getCampaign(id);

    if (!campaign) {
        console.log("Campaign not found");
        return <CampaignNotFound />;
    }

    // Verify permissions
    const hasPermission = await verifyPermissions(id);

    if (!hasPermission) {
        return <CampaignNotFound />;
    }

    return <CampaignDetailWrapper campaign={campaign} />;
}