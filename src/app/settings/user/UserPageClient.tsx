'use client';

import { useRouter } from 'next/navigation';

import { ErrorBoundary } from '@shared/components/ErrorBoundary';
import { Form } from '@shared/components/Form';
import { useUpdateUserInfo } from '@entities/user/hooks/useUpdateUserInfo';
import { useUserInfo } from '@entities/user/hooks/useUserInfo';
import { FormDataType } from '@shared/components/Form/types';
import { HeaderConfig, toast } from '@shared/components';

import styles from './page.module.scss';

export default function UserPageClient() {
  const updateUser = useUpdateUserInfo();
  const { data: user, isLoading: isUserLoading } = useUserInfo();
  const router = useRouter();

  const handleSave = (formData: FormDataType) => {
    updateUser.mutate(formData, {
      onSuccess: () => {
        toast.success('정보가 수정되었습니다.');
        router.push('/settings');
      },
      onError: () => {
        toast.error('정보 수정에 실패하였습니다.');
      },
    });
  };

  return (
    <main className={styles.UserPage}>
      <HeaderConfig title="개인정보" showBackButton />
      <ErrorBoundary>
        {!isUserLoading && <Form onClick={handleSave} showTextArea={false} user={user} />}
      </ErrorBoundary>
    </main>
  );
}
