'use client';

import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

// 서버 화면과 첫 화면을 같게 그린 뒤(하이드레이션 오류 방지) 기기의 '동작 줄이기' 설정을 따른다
export function useReduceMotion(): boolean {
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted ? !!reduce : false;
}
