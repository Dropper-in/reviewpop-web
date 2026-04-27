import { useCampaignDetail } from '@entities/campaign/hooks/useCampaignDetail';

export function useCampaignBottomSheetData(campaignId: string, enabled = true) {
  return useCampaignDetail(campaignId, enabled);
}
