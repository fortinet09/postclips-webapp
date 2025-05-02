import { useState, useCallback, useEffect, useRef } from "react";
import { fetchAPI, ErrorResponse } from "@/Clients/postclips/server/ApiClient";
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
  total_budget: number;
  analytics: {
    total_views: number;
    total_likes: number;
    total_clips: number;
    views_percentage: number;
    total_payments: number;
    budget_percentage: number;
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

export interface CreateCampaignDraftData {
  title: string;
  description: string;
}

export interface CreateCampaignDraftResponse {
  success: boolean;
  data?: {
    success: boolean;
    message: string;
    data: {
      id: string;
      brand_id: string;
      profile_picture: string | null;
      title: string;
      description: string;
      targeted_social_networks: string[];
      end_date: string | null;
      created_at: string;
      targeted_amount_of_views: number;
      amount_cpm_payout: number;
      status: string;
      rules: string[];
      brand_message: string | null;
      total_budget: number;
    };
  };
  error?: ErrorResponse | string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  error?: string | ErrorResponse;
  data?: T;
}

export interface PreviewImage {
  id: string;
  image_url: string;
}

export interface ExampleClip {
  id: string;
  clip_url: string;
}

export interface MediaResponse {
  id: string;
  url: string;
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStatus, setCurrentStatus] = useState<string>('active');
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchCampaigns = useCallback(async (status: string | null, searchTerm: string | null) => {
    try {
      setLoading(true);
      const response = await fetchAPI("POST", "/campaigns/brand", {
        status: searchTerm ? null : status,
        searchTerm: searchTerm || null
      });

      if (response.success && response.data?.data) {
        const campaignsData = response.data.data;
        setTopCampaigns(campaignsData.topCampaigns);
        setCampaigns(campaignsData.statusCampaigns);
        setTotalAnalytics(campaignsData.totalAnalytics);
        setError(null);
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
  }, []);

  const createCampaignDraft = useCallback(async (data: CreateCampaignDraftData): Promise<CreateCampaignDraftResponse> => {
    try {
      setLoading(true);
      const response = await fetchAPI("POST", "/campaigns/draft", data);

      if (response.success) {
        toast.success('Campaign draft created successfully!');
        // Refresh the campaigns list
        await fetchCampaigns(currentStatus, null);
      } else {
        const errorMessage = handleApiError(response.error);
        toast.error(errorMessage);
      }
      return response;
    } catch (err) {
      const errorMessage = handleApiError(err);
      toast.error(errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  }, [currentStatus, fetchCampaigns]);

  const updateCampaignDraft = useCallback(async (campaignId: string, data: Record<string, any>): Promise<ApiResponse> => {
    try {
      setLoading(true);
      const response = await fetchAPI("PUT", `/campaigns/${campaignId}/draft`, data);

      if (response.success) {
        toast.success('Campaign draft updated successfully!');
        // Refresh the campaigns list
        await fetchCampaigns(currentStatus, null);
      } else {
        const errorMessage = handleApiError(response.error);
        toast.error(errorMessage);
      }
      return response;
    } catch (err) {
      const errorMessage = handleApiError(err);
      toast.error(errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  }, [currentStatus, fetchCampaigns]);

  const refetchCampaigns = useCallback((status: string) => {
    setCurrentStatus(status);
    fetchCampaigns(status, null);
  }, [fetchCampaigns]);

  const handleSearch = useCallback((searchTerm: string) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      if (searchTerm.trim()) {
        fetchCampaigns(null, searchTerm);
      } else {
        fetchCampaigns(currentStatus, null);
      }
    }, 500); // 500ms debounce
  }, [fetchCampaigns, currentStatus]);

  const uploadPreviewImage = useCallback(async (campaignId: string, file: File): Promise<ApiResponse<{ data: PreviewImage }>> => {
    try {
      // Check file size (15MB limit)
      if (file.size > 15 * 1024 * 1024) {
        toast.error('Preview image size must be less than 15MB');
        return {
          success: false,
          error: 'File size exceeds limit'
        };
      }

      setLoading(true);
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetchAPI("POST", `/campaigns/${campaignId}/preview-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.success) {
        toast.success('Image uploaded successfully!');
      } else {
        const errorMessage = handleApiError(response.error);
        toast.error(errorMessage);
        return {
          success: false,
          error: errorMessage
        };
      }
      return response;
    } catch (err) {
      const errorMessage = handleApiError(err);
      toast.error(errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const deletePreviewImage = useCallback(async (imageId: string): Promise<ApiResponse> => {
    try {
      setLoading(true);
      const response = await fetchAPI("DELETE", `/campaigns/preview-image/${imageId}`);

      if (response.success) {
        toast.success('Image deleted successfully!');
      } else {
        const errorMessage = handleApiError(response.error);
        toast.error(errorMessage);
      }
      return response;
    } catch (err) {
      const errorMessage = handleApiError(err);
      toast.error(errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadExampleClip = useCallback(async (campaignId: string, file: File): Promise<ApiResponse<{ data: ExampleClip }>> => {
    try {
      // Check file size (15MB limit)
      if (file.size > 15 * 1024 * 1024) {
        toast.error('Example clip size must be less than 15MB');
        return {
          success: false,
          error: 'File size exceeds limit'
        };
      }

      setLoading(true);
      const formData = new FormData();
      formData.append('clip', file);

      const response = await fetchAPI("POST", `/campaigns/${campaignId}/example-clip`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.success) {
        toast.success('Example clip uploaded successfully!');
      } else {
        const errorMessage = handleApiError(response.error);
        toast.error(errorMessage);
      }
      return response;
    } catch (err) {
      const errorMessage = handleApiError(err);
      toast.error(errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteExampleClip = useCallback(async (clipId: string): Promise<ApiResponse> => {
    try {
      setLoading(true);
      const response = await fetchAPI("DELETE", `/campaigns/example-clip/${clipId}`);

      if (response.success) {
        toast.success('Example clip deleted successfully!');
      } else {
        const errorMessage = handleApiError(response.error);
        toast.error(errorMessage);
      }
      return response;
    } catch (err) {
      const errorMessage = handleApiError(err);
      toast.error(errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadMedia = useCallback(async (campaignId: string, file: File): Promise<ApiResponse<{ data: MediaResponse }>> => {
    try {
      // Check file size (15MB limit)
      if (file.size > 15 * 1024 * 1024) {
        toast.error('Media file size must be less than 15MB');
        return {
          success: false,
          error: 'File size exceeds limit'
        };
      }

      setLoading(true);
      const formData = new FormData();
      formData.append('media', file);

      const response = await fetchAPI("POST", `/campaigns/${campaignId}/media`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.success) {
        toast.success('Media uploaded successfully!');
      } else {
        const errorMessage = handleApiError(response.error);
        toast.error(errorMessage);
      }
      return response;
    } catch (err) {
      const errorMessage = handleApiError(err);
      toast.error(errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteMedia = useCallback(async (mediaId: string): Promise<ApiResponse> => {
    try {
      setLoading(true);
      const response = await fetchAPI("DELETE", `/campaigns/media/${mediaId}`);

      if (response.success) {
        toast.success('Media deleted successfully!');
      } else {
        const errorMessage = handleApiError(response.error);
        toast.error(errorMessage);
      }
      return response;
    } catch (err) {
      const errorMessage = handleApiError(err);
      toast.error(errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCampaigns('active', null);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [fetchCampaigns]);

  return {
    campaigns,
    topCampaigns,
    totalAnalytics,
    loading,
    error,
    refetchCampaigns,
    handleSearch,
    createCampaignDraft,
    updateCampaignDraft,
    uploadPreviewImage,
    deletePreviewImage,
    uploadExampleClip,
    deleteExampleClip,
    uploadMedia,
    deleteMedia
  };
};
