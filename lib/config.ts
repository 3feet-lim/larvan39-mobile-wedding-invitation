export function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

export const siteConfig = {
  groom: { ko: '신랑', en: 'GROOM' },
  bride: { ko: '신부', en: 'BRIDE' },
  dateTime: '2026년 10월 10일 토요일 오후 1시',
  venue: '예식장 이름',
  address: '서울특별시 예식장 주소를 입력하세요',
  lat: 37.5665,
  lng: 126.978,
  greeting:
    '서로의 삶에 따뜻한 계절이 되어 주기로 약속합니다. 소중한 분들을 모시고 작은 시작을 함께 나누고 싶습니다.',
  families: {
    groomParents: '아버님 · 어머님 의 아들 신랑',
    brideParents: '아버님 · 어머님 의 딸 신부',
  },
  accounts: [
    { side: '신랑 측', name: '신랑', bank: '은행명', number: '000-0000-0000', kakaoPayUrl: 'https://qr.kakaopay.com/' },
    { side: '신부 측', name: '신부', bank: '은행명', number: '000-0000-0000', kakaoPayUrl: 'https://qr.kakaopay.com/' },
  ],
};
