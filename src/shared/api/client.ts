/**
 * Axios HTTP 클라이언트 설정
 *
 * 앱 전체에서 사용하는 HTTP 클라이언트입니다.
 * 공통 설정, 인터셉터, 에러 처리 등이 포함되어 있습니다.
 */

import axios, { AxiosError } from 'axios';
import { env } from '@shared/config/env';

/**
 * Axios 인스턴스 생성
 */
export const apiClient = axios.create({
  baseURL: env.apiUrl,
  timeout: 10000, // 10초
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * 응답 인터셉터
 *
 * 공통 에러 처리를 수행합니다.
 */
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    // 에러 처리
    if (error.response) {
      // 서버가 응답을 반환한 경우
      const { status } = error.response;

      switch (status) {
        case 401:
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          break;
        case 403:
          // 권한 없음
          console.error('접근 권한이 없습니다.');
          break;
        case 404:
          // 찾을 수 없음
          console.error('요청한 리소스를 찾을 수 없습니다.');
          break;
        case 500:
          // 서버 에러
          console.error('서버 오류가 발생했습니다.');
          break;
        default:
          console.error('오류가 발생했습니다:', error.message);
      }
    } else if (error.request) {
      // 요청은 보냈지만 응답을 받지 못한 경우
      console.error('서버로부터 응답이 없습니다.');
    } else {
      // 요청 설정 중 에러가 발생한 경우
      console.error('요청 중 오류가 발생했습니다:', error.message);
    }

    return Promise.reject(error);
  },
);
