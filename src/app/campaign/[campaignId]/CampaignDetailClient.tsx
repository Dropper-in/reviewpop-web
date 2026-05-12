'use client';

import { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';

import { ImageGallery, ImageViewer } from '@shared/components/ImageViewer';
import { BulletListSection } from '@features/campaign';
import { AddressMap } from '@shared/components';
import { WebButton } from '@shared/components/WebButton';
import { toast } from '@shared/components/Toast';
import { CampaignStatusBar } from '@features/campaign/components/CampaignStatusBar';
import { CampaignContents } from '@features/campaign/components/CampaignContents';
import { CampaignValue } from '@features/campaign/components/CampaignValue';
import { CampaignInfoSection } from '@features/campaign/components/CampaignInfoSection';
import StatusBadge from '@features/campaign/components/StatusBadge';
import CampaignCTA from '@features/campaign/components/CampaignCTA';
import ReviewSection from '@features/campaign/components/ReviewSection';
import { CampaignScheduleSection } from '@features/campaign/components/CampaignScheduleSection';
import { CampaignVisitReservation } from '@features/campaign/components/CampaignVisitReservation';
import { CampaignAdditionalNotice } from '@features/campaign/components/CampaignAdditionalNotice';
import { useCampaignDetails } from '@entities/campaign/hooks/useCampaignDetails';
import { usePageHeader } from '@shared/hooks/usePageHeader';
import { useApplicationDetails } from '@entities/application/hooks/useApplicationDetails';
import { useUserInfo } from '@entities/user/hooks/useUserInfo';

import styles from './page.module.scss';

interface CampaignDetailClientProps {
  campaignId: string;
  isAuthenticated: boolean;
}

export default function CampaignDetailClient({
  campaignId,
  isAuthenticated,
}: CampaignDetailClientProps) {
  const router = useRouter();
  const { data: campaign, isLoading, error } = useCampaignDetails(campaignId);
  const { data: user } = useUserInfo();
  const { data: application } = useApplicationDetails(campaignId, user?.id ?? '', {
    enabled: !!user?.id,
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

  return (
    <div
      className={`${styles.Page} ${
        isSelectedWithoutReservation ? styles['Page--reservation-pending'] : ''
      }`}
    >
      <CampaignCTA campaign={campaign} isAuthenticated={isAuthenticated} />
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
        {campaign.status !== 'completed' && campaign.status !== 'closed' && (
          <StatusBadge campaign={campaign} />
        )}
      </div>

      <CampaignContents campaign={campaign} />

      <div className={styles.Page__ValueSection}>
        <CampaignValue campaign={campaign} />
      </div>

      {campaign.status === 'completed' && <ReviewSection campaignId={campaign.id} />}

      <CampaignInfoSection campaign={campaign} />

      {campaign.status !== 'completed' && campaign.status !== 'closed' && (
        <CampaignScheduleSection campaign={campaign} />
      )}

      <BulletListSection title="당첨 조건" items={campaign.requirements || []} />

      <CampaignVisitReservation campaign={campaign} />

      {(() => {
        const notice =
          campaign.status !== 'completed' &&
          campaign.status !== 'closed' &&
          campaign.visitReservation?.visitReservationNotice
            ? campaign.visitReservation.visitReservationNotice
            : null;
        return notice && <CampaignAdditionalNotice content={notice} />;
      })()}

      {campaign.address && <AddressMap placeName={campaign.brand} address={campaign.address} />}

      {campaign.status !== 'completed' &&
        campaign.status !== 'closed' &&
        campaign.reviewMission &&
        campaign.reviewMission.length > 0 && (
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

      {campaign.status !== 'completed' && campaign.status !== 'closed' && keywordsText && (
        <div className={styles.Page__KeywordsSection}>
          <WebButton
            buttonType="copy"
            label="키워드"
            text={keywordsText}
            onClick={handleCopyKeywords}
          />
        </div>
      )}

      {campaign.status !== 'completed' &&
        campaign.status !== 'closed' &&
        campaign.precautions &&
        campaign.precautions.length > 0 && (
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
