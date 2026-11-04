import { useQuery } from '@tanstack/react-query';

import { getUserInfo } from '../api/userApi';

export function useUserInfo() {
  return useQuery({
    queryKey: ['user'],
    queryFn: getUserInfo,
    retry: false,
  });
}
