'use client';

import { useSearchParams } from 'next/navigation';
import Image from 'next/image';

import { CONSTANTS } from '@shared/config/constants';
import { ROUTES } from '@shared/config/routes';
import { toUnix, toUTCString, now } from '@shared/lib/date';

import { generateState } from './utils';

interface OAuthConfig {
  mockCodePrefix: string;
  callbackRoute: string;
  authorizeUrl: string;
  clientId: string | undefined;
}

interface OAuthLoginButtonProps {
  label: string;
  icon: { src: string; alt: string };
  config: OAuthConfig;
  className?: string;
}

export function OAuthLoginButton({ label, icon, config, className }: OAuthLoginButtonProps) {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect');

  const handleLogin = () => {
    const state = generateState();

    const stateData = {
      state,
      redirectUrl: redirectUrl || ROUTES.HOME,
      timestamp: toUnix(),
    };

    const expires = toUTCString(now().add(10, 'minute'));
    document.cookie = `${CONSTANTS.STORAGE_KEYS.OAUTH_STATE}=${encodeURIComponent(JSON.stringify(stateData))}; path=/; expires=${expires}; SameSite=Lax`;

    if (process.env.NODE_ENV === 'development') {
      const mockCode = `${config.mockCodePrefix}-${toUnix()}`;
      const callbackUrl = new URL(config.callbackRoute, window.location.origin);
      callbackUrl.searchParams.set('code', mockCode);
      callbackUrl.searchParams.set('state', state);
      window.location.href = callbackUrl.toString();
      return;
    }

    const authUrl = new URL(config.authorizeUrl);
    authUrl.searchParams.set('client_id', config.clientId || '');
    authUrl.searchParams.set(
      'redirect_uri',
      `${process.env.NEXT_PUBLIC_APP_URL}${config.callbackRoute}`,
    );
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('state', state);

    window.location.href = authUrl.toString();
  };

  return (
    <button type="button" onClick={handleLogin} className={className}>
      <Image src={icon.src} width={18} height={18} alt={icon.alt} />
      <span>{label}</span>
    </button>
  );
}
