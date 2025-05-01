import { useState } from "react";
import { fetchAPI } from "@/Clients/postclips/server/ApiClient";
import { toast } from "react-toastify";
import { handleApiError } from "@/Clients/postclips/server/errorHandler";

export interface Campaign {
  id: string;
  title: string;
  description: string;
  status: string;
  profile_picture: string;
  created_at: string;
  targeted_amount_of_views: number;
  analytics: {
    total_views: number;
    total_likes: number;
    total_clips: number;
    views_percentage: number;
  };
}

export interface CampaignsResponse {
  topCampaigns: Campaign[];
  statusCampaigns: Campaign[];
  totalAnalytics: {
    total_views: number;
    total_clips: number;
    total_link_clicks: number;
    average_views_per_clip: number;
  };
}

export const useCampaigns = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [topCampaigns, setTopCampaigns] = useState<Campaign[]>([]);
  const [totalAnalytics, setTotalAnalytics] = useState<CampaignsResponse['totalAnalytics']>({
    total_views: 0,
    total_clips: 0,
    total_link_clicks: 0,
    average_views_per_clip: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCampaigns = async (status: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchAPI("POST", "/campaigns/brand", { status });
      console.log("==== [USECAMPAIGNS] response", response);
      
      if (response.success && response.data?.data) {
        const campaignsData = response.data.data;
        setTopCampaigns(campaignsData.topCampaigns);
        setCampaigns(campaignsData.statusCampaigns);
        setTotalAnalytics(campaignsData.totalAnalytics);
      } else {
        const errorMessage = handleApiError(response.error);
        setError(errorMessage);
        toast.error(errorMessage);
        setCampaigns([]);
        setTopCampaigns([]);
        setTotalAnalytics({
          total_views: 0,
          total_clips: 0,
          total_link_clicks: 0,
          average_views_per_clip: 0
        });
      }
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      toast.error(errorMessage);
      setCampaigns([]);
      setTopCampaigns([]);
      setTotalAnalytics({
        total_views: 0,
        total_clips: 0,
        total_link_clicks: 0,
        average_views_per_clip: 0
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    campaigns,
    topCampaigns,
    totalAnalytics,
    loading,
    error,
    refetchCampaigns: fetchCampaigns
  };
};
