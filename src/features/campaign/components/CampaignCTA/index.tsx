import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dayjs from 'dayjs';

import { Button, Modal, toast } from '@shared/components';
import { useApplicationDetails } from '@entities/application/hooks/useApplicationDetails';
import { useDeleteMyCampaign } from '@entities/history/hooks/useMyCampaigns';
import { CampaignDetail } from '@entities/campaign/types/campaign.types';
import { useUserInfo } from '@entities/user/hooks/useUserInfo';
import { useReservationActions } from '@features/history/hooks/useReservationActions';
import { useReservationStore } from '@features/reserve/store/reservationStore';

import styles from './style.module.scss';

/**
 * - 'Cancel': 체험단 신청 취소하기
 * - 'Closed': 아쉽지만 종료된 체험이에요
 * - 'Apply': 체험단 신청하기
 * - 'Reserve': 체험단에 선정되었어요! 체험 방문할 날짜를 설정해주세요
 * - 'Review': 체험 후기 등록
 * - 'CancelReservation': 예약 취소 (당일)
 * - 'ChangeReservation': 예약 날짜 변경 / 예약 취소 (당일 아님)
 */
type Cta =
  | 'Cancel'
  | 'Closed'
  | 'Apply'
  | 'Reserve'
  | 'Review'
  | 'CancelReservation'
  | 'ChangeReservation';

export default function CampaignCTA({
  campaign,
  isAuthenticated,
}: {
  campaign: CampaignDetail;
  isAuthenticated: boolean;
}) {
  const router = useRouter();
  const { data: user } = useUserInfo();
  const { data: application } = useApplicationDetails(campaign.id, user?.id || '', {
    enabled: isAuthenticated && !!user?.id,
  });

  const { handleChangeDate, handleCancelReservation } = useReservationActions(
    campaign.id,
    application?.reservationId,
  );

  const { mutateAsync: deleteMyCampaign } = useDeleteMyCampaign();

  if (!isAuthenticated) return null;

  const getCtaStatus = (): Cta => {
    // 1. Application-specific Logic
    if (application) {
      if (application.status === 'selected') {
        if (!application.isReservated) return 'Reserve';

        // Check if review is needed
        if (application.reviewStatus === 'visited' || application.reviewStatus === 'notReviewed') {
          return 'Review';
        }

        const isToday = dayjs(application.reservationDate).isSame(dayjs(), 'day');
        if (isToday) return 'CancelReservation';

        return 'ChangeReservation';
      }

      if (application.status === 'reviewed') {
        if (
          application.reviewStatus === 'reviewed' ||
          application.reviewStatus === 'reviewPending'
        ) {
          return 'Closed';
        }
        return 'Review';
      }

      if (application.status === 'pending') {
        if (campaign.status === 'recruiting') return 'Cancel';
      }
    }

    // 2. Campaign Logic (No active application)
    if (campaign.status === 'recruiting') {
      if (!application || ['cancelled', 'rejected'].includes(application.status)) {
        return 'Apply';
      }
    }

    if (campaign.status === 'recruiting') return 'Apply';

    return 'Closed';
  };

  const CTA_STATUS = getCtaStatus();

  // 신청 취소 핸들러
  const handleCancelApplication = async () => {
    await deleteMyCampaign(campaign.id);
    toast.success('신청이 취소되었습니다.');
    router.push('/');
  };

  // 예약 취소 핸들러
  const handleCancelReservationClick = async () => {
    await handleCancelReservation();
  };

  // 예약하기 핸들러 (스토어 초기화 후 이동)
  const handleReserveClick = () => {
    if (!application) return;

    // 예약 데이터 초기화 (캠페인 ID, 신청 ID)
    useReservationStore.getState().setReservationFormData({
      campaignId: campaign.id,
      applicationId: application.id,
      personCount: 1,
    });

    router.push(`/campaign/${campaign.id}/reserve`);
  };

  return (
    <div className={styles.CTA__Container}>
      {CTA_STATUS === 'Reserve' && <span>🎉 체험단에 선정되었어요!</span>}

      <div className={styles.CTA__ButtonWrapper}>
        {CTA_STATUS === 'Apply' && (
          <Link href={`/campaign/${campaign.id}/apply`} className={styles.CTA__Link}>
            <Button
              fullWidth
              className={styles.CTA}
              onClick={() => router.push(`/campaign/${campaign.id}/apply`)}
            >
              체험단 신청하기
            </Button>
          </Link>
        )}

        {CTA_STATUS === 'Cancel' && (
          <Modal
            variant="confirm"
            trigger={
              <Button fullWidth variant="outline" className={styles.CTA}>
                체험단 신청 취소하기
              </Button>
            }
            onConfirm={handleCancelApplication}
          />
        )}

        {CTA_STATUS === 'Reserve' && (
          <Button fullWidth className={styles.CTA} onClick={handleReserveClick}>
            체험 방문할 날짜를 설정해주세요
          </Button>
        )}

        {CTA_STATUS === 'ChangeReservation' && (
          <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
            <Button fullWidth variant="secondary" className={styles.CTA} onClick={handleChangeDate}>
              예약 날짜 변경
            </Button>
            <Modal
              variant="outline"
              trigger={
                <Button fullWidth variant="outline" className={styles.CTA}>
                  예약 취소
                </Button>
              }
              onConfirm={handleCancelReservationClick}
            />
          </div>
        )}

        {CTA_STATUS === 'CancelReservation' && (
          <Modal
            variant="outline"
            trigger={
              <Button fullWidth variant="outline" className={styles.CTA}>
                예약 취소
              </Button>
            }
            onConfirm={handleCancelReservationClick}
          />
        )}

        {CTA_STATUS === 'Review' && (
          <Link
            href={`/campaign/${campaign.id}/review/write?applicationId=${application?.id}`}
            className={styles.CTA__Link}
          >
            <Button fullWidth className={styles.CTA}>
              체험 후기 등록
            </Button>
          </Link>
        )}

        {CTA_STATUS === 'Closed' && (
          <Button fullWidth disabled className={styles.CTA}>
            아쉽지만 종료된 체험이에요
          </Button>
        )}
      </div>
    </div>
  );
}
