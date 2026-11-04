'use client';

import { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';

import { ImageGallery, ImageViewer } from '@shared/components/ImageViewer';
import { AddressMap } from '@shared/components';
import { WebButton } from '@shared/components/WebButton';
import { toast } from '@shared/components/Toast';
import {
  BulletListSection,
  CampaignContents,
  CampaignValue,
  CampaignInfoSection,
  CampaignScheduleSection,
  CampaignVisitReservation,
  CampaignAdditionalNotice,
  CampaignStatusBar,
  StatusBadge,
  CampaignCTA,
  ReviewSection,
} from '@features/campaign';
import { useCampaignDetails } from '@entities/campaign';
import { useApplicationDetails } from '@entities/application';
import { usePageHeader } from '@shared/hooks/usePageHeader';

import styles from './page.module.scss';

interface CampaignDetailClientProps {
  campaignId: string;
  userId: string | null;
}

export default function CampaignDetailClient({
  campaignId,
  userId,
}: CampaignDetailClientProps) {
  const router = useRouter();
  const { data: campaign, isLoading, error } = useCampaignDetails(campaignId);
  const { data: application } = useApplicationDetails(campaignId, userId ?? '', {
    enabled: !!userId,
  });
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  const isSelectedWithoutReservation = useMemo(() => {
    return application?.status === 'selected' && !application?.isReservated;
  }, [application]);

  usePageHeader({
    title: campaign?.brand,
    showBackButton: true,
  });

  const images = useMemo(() => {
    if (!campaign) return [];
    if (campaign.detailImages && campaign.detailImages.length > 0) {
      return campaign.detailImages;
    }
    return [campaign.thumbnail];
  }, [campaign]);

  const handleImageClick = (index: number) => {
    setViewerIndex(index);
  };

  const handleViewAllClick = () => {
    router.push(`/campaign/${campaignId}/images`);
  };

  const handleCloseViewer = () => {
    setViewerIndex(null);
  };

  const keywordsText = useMemo(() => {
    if (!campaign?.keywords?.length) return '';
    return campaign.keywords.join(', ');
  }, [campaign]);

  const keywordsTextForCopy = useMemo(() => {
    if (!campaign?.keywords?.length) return '';
    return campaign.keywords.map((keyword) => `#${keyword}`).join(' ');
  }, [campaign]);

  const handleCopyKeywords = useCallback(async () => {
    if (!keywordsTextForCopy) {
      return;
    }

    try {
      await navigator.clipboard.writeText(keywordsTextForCopy);
      toast.success('키워드가 복사되었어요');
    } catch (error) {
      console.error('복사 실패:', error);
      toast.error('키워드 복사에 실패했어요');
    }
  }, [keywordsTextForCopy]);

  if (isLoading) {
    return (
      <div className={styles.Page}>
        <div className={styles.Page__Loading}>
          <p>체험 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className={styles.Page}>
        <div className={styles.Page__Error}>
          <p>체험 정보를 불러올 수 없습니다.</p>
        </div>
      </div>
    );
  }

  const isActiveCampaign = campaign.status !== 'completed' && campaign.status !== 'closed';

  return (
    <div
      className={`${styles.Page} ${
        isSelectedWithoutReservation ? styles['Page--reservation-pending'] : ''
      }`}
    >
      <CampaignCTA campaign={campaign} userId={userId} />
      <div className={styles.Page__ImageSection}>
        <ImageGallery
          images={images}
          maxDisplay={4}
          onImageClick={handleImageClick}
          onViewAllClick={handleViewAllClick}
        />
      </div>

      {viewerIndex !== null && (
        <ImageViewer
          images={images}
          initialIndex={viewerIndex}
          isOpen={true}
          onClose={handleCloseViewer}
        />
      )}

      <div className={styles.Page__StatusBarSection}>
        <CampaignStatusBar campaign={campaign} />
        {isActiveCampaign && <StatusBadge campaign={campaign} />}
      </div>

      <CampaignContents campaign={campaign} />

      <div className={styles.Page__ValueSection}>
        <CampaignValue campaign={campaign} />
      </div>

      {campaign.status === 'completed' && <ReviewSection campaignId={campaign.id} />}

      <CampaignInfoSection campaign={campaign} />

      {isActiveCampaign && <CampaignScheduleSection campaign={campaign} />}

      <BulletListSection title="당첨 조건" items={campaign.requirements || []} />

      <CampaignVisitReservation campaign={campaign} />

      {isActiveCampaign && campaign.visitReservation?.visitReservationNotice && (
        <CampaignAdditionalNotice content={campaign.visitReservation.visitReservationNotice} />
      )}

      {campaign.address && <AddressMap placeName={campaign.brand} address={campaign.address} />}

      {isActiveCampaign && campaign.reviewMission && campaign.reviewMission.length > 0 && (
        <>
          <BulletListSection
            title="후기 미션 안내"
            items={campaign.reviewMission}
            showDivider={false}
          />

          {campaign.reviewMissionNotice && (
            <CampaignAdditionalNotice content={campaign.reviewMissionNotice} />
          )}
        </>
      )}

      {isActiveCampaign && keywordsText && (
        <div className={styles.Page__KeywordsSection}>
          <WebButton
            buttonType="copy"
            label="키워드"
            text={keywordsText}
            onClick={handleCopyKeywords}
          />
        </div>
      )}

      {isActiveCampaign && campaign.precautions && campaign.precautions.length > 0 && (
        <BulletListSection
          title="체험 시 주의사항"
          items={campaign.precautions}
          backgroundColor="var(--color-gray-50)"
          noPadding={true}
          textColor="var(--color-gray-800)"
          showDivider={false}
        />
      )}
    </div>
  );
}
