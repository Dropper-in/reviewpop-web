'use client';

import { CONSTANTS } from '@shared/config/constants';
import { ROUTES } from '@shared/config/routes';

import { OAuthLoginButton } from '../OAuthLoginButton';

import type { KakaoLoginButtonProps } from './types';

import styles from './style.module.scss';

export function KakaoLoginButton({ className }: KakaoLoginButtonProps) {
  const buttonClassName = [styles.KakaoLoginButton, className].filter(Boolean).join(' ');

  return (
    <OAuthLoginButton
      label="카카오로 계속하기"
      icon={{ src: '/images/icons/IcoKakao.svg', alt: '카카오 로고' }}
      config={{
        mockCodePrefix: 'mock-kakao-code',
        callbackRoute: ROUTES.AUTH_CALLBACK.KAKAO,
        authorizeUrl: CONSTANTS.OAUTH.KAKAO.AUTHORIZE_URL,
        clientId: process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID,
      }}
      className={buttonClassName}
    />
  );
}
