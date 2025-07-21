import apiClient from "../instance";

export interface FemaleTracking{
    _id: string;
    user_id: string;
    cycle_start_date: string; // Changed from number to string (ISO date)
    cycle_length: number;
    ovulation_day: string;
    fertility_window?: string;
    notes?: string;
    remind_pill?: boolean;
    created_at: string;
    updated_at: string;
    __v: number;
}
export interface FemaleTrackingResponse {
    success: boolean;
    count: number;
    data: FemaleTracking[];
}

export interface FemaleTrackingDetailResponse {
    success: boolean;
    data: FemaleTracking;
}

export const getFemaleTrackings = async (): Promise<FemaleTrackingResponse> => {
    const response  = await apiClient.get("/female-tracking");
    return response.data;
}
export const getFemaleTrackingById = async (id: string): Promise<FemaleTrackingDetailResponse> => {
    const response = await apiClient.get(`/female-tracking/${id}`);
    return response.data;
}