'use client';

import { CONSTANTS } from '@shared/config/constants';
import { ROUTES } from '@shared/config/routes';

import { OAuthLoginButton } from '../OAuthLoginButton';

import type { NaverLoginButtonProps } from './types';

import styles from './style.module.scss';

export function NaverLoginButton({ className }: NaverLoginButtonProps) {
  const buttonClassName = [styles.NaverLoginButton, className].filter(Boolean).join(' ');

  return (
    <OAuthLoginButton
      label="네이버로 계속하기"
      icon={{ src: '/images/icons/IcoNaver.svg', alt: '네이버 로고' }}
      config={{
        mockCodePrefix: 'mock-naver-code',
        callbackRoute: ROUTES.AUTH_CALLBACK.NAVER,
        authorizeUrl: CONSTANTS.OAUTH.NAVER.AUTHORIZE_URL,
        clientId: process.env.NEXT_PUBLIC_NAVER_CLIENT_ID,
      }}
      className={buttonClassName}
    />
  );
}
