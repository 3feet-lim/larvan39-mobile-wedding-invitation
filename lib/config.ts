export function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

export const siteConfig = {
  groom: { ko: '김범수', en: 'BEOMSU KIM' },
  bride: { ko: '예진', en: 'YEJIN' },
  dateTime: '2026년 9월 6일 일요일 오전 11시',
  venue: '더 리버사이드 호텔',
  address: '서울특별시 서초구 강남대로107길 6',
  lat: 37.5177142,
  lng: 127.0187306,
  greeting:
    '서로의 삶에 따뜻한 계절이 되어 주기로 약속합니다. 소중한 분들을 모시고 작은 시작을 함께 나누고 싶습니다.',
  families: {
    groomParents: '아버님 · 어머님의 장남 김범수',
    brideParents: '아버님 · 어머님의 딸 예진',
  },
  accounts: [
    { side: '신랑 측', name: '김범수', bank: '은행명', number: '000-0000-0000', kakaoPayUrl: 'https://qr.kakaopay.com/' },
    { side: '신부 측', name: '예진', bank: '은행명', number: '000-0000-0000', kakaoPayUrl: 'https://qr.kakaopay.com/' },
  ],
};
