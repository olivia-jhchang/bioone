import { Biomaterial } from '@/types/biomaterial';

export const sampleBiomaterials: Biomaterial[] = [
  {
    id: '1',
    name: 'PLA (폴리락트산)',
    category: '생분해성 플라스틱',
    subcategory: '열가소성 수지',
    description: '옥수수, 사탕수수 등의 식물 자원에서 추출한 젖산으로 만든 생분해성 플라스틱으로, 의료용 임플란트와 포장재에 널리 사용됩니다.',
    properties: {
      biodegradable: true,
      biocompatible: true,
      tensileStrength: 50,
      elasticModulus: 3.5,
      degradationTime: '6-24개월',
      temperature: {
        min: -20,
        max: 60
      }
    },
    applications: ['의료용 임플란트', '일회용 포장재', '3D 프린팅', '의료용 봉합사'],
    suppliers: ['NatureWorks', 'Total Corbion', '한국생분해플라스틱'],
    certification: ['FDA 승인', 'CE 마크', 'ISO 17088'],
    imageUrl: '/images/pla.jpg',
    price: {
      amount: 3500,
      unit: 'kg당',
      currency: 'KRW'
    },
    inStock: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: '2',
    name: 'PCL (폴리카프로락톤)',
    category: '생분해성 플라스틱',
    subcategory: '열가소성 수지',
    description: '우수한 생체적합성과 조절 가능한 분해속도를 가진 합성 생분해성 폴리머로, 조직공학과 약물전달 시스템에 활용됩니다.',
    properties: {
      biodegradable: true,
      biocompatible: true,
      tensileStrength: 25,
      elasticModulus: 0.4,
      degradationTime: '12-24개월',
      temperature: {
        min: -30,
        max: 70
      }
    },
    applications: ['조직공학 스캐폴드', '약물전달시스템', '생체재료', '의료용 필름'],
    suppliers: ['Perstorp', 'Daicel', '삼양사'],
    certification: ['FDA 승인', 'USP Class VI', 'ISO 10993'],
    imageUrl: '/images/pcl.jpg',
    price: {
      amount: 12000,
      unit: 'kg당',
      currency: 'KRW'
    },
    inStock: true,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-18')
  },
  {
    id: '3',
    name: '콜라겐',
    category: '천연 생체재료',
    subcategory: '단백질 기반',
    description: '동물의 결합조직에서 추출한 천연 단백질로, 뛰어난 생체적합성과 생분해성을 가지며 의료 및 화장품 분야에서 광범위하게 사용됩니다.',
    properties: {
      biodegradable: true,
      biocompatible: true,
      tensileStrength: 0.5,
      elasticModulus: 0.001,
      degradationTime: '1-3개월',
      temperature: {
        min: 2,
        max: 37
      }
    },
    applications: ['상처치료', '피부재생', '화장품', '관절치료', '치과재료'],
    suppliers: ['Integra LifeSciences', 'Collagen Matrix', '메디젠바이오'],
    certification: ['FDA 승인', 'CE 마크', 'GMP'],
    imageUrl: '/images/collagen.jpg',
    price: {
      amount: 45000,
      unit: 'g당',
      currency: 'KRW'
    },
    inStock: true,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-22')
  },
  {
    id: '4',
    name: '키토산',
    category: '천연 생체재료',
    subcategory: '다당류 기반',
    description: '게, 새우 등의 갑각류 껍질에서 추출한 천연 다당류로, 항균성과 지혈효과가 뛰어나 의료용 드레싱과 약물전달에 사용됩니다.',
    properties: {
      biodegradable: true,
      biocompatible: true,
      tensileStrength: 100,
      elasticModulus: 2.0,
      degradationTime: '2-6개월',
      temperature: {
        min: -10,
        max: 80
      }
    },
    applications: ['의료용 드레싱', '약물전달', '항균 코팅', '수처리', '식품보존'],
    suppliers: ['Primex', 'Kitozyme', '해양바이오'],
    certification: ['FDA 승인', 'GRAS 인증', 'ISO 22718'],
    imageUrl: '/images/chitosan.jpg',
    price: {
      amount: 25000,
      unit: 'kg당',
      currency: 'KRW'
    },
    inStock: true,
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-19')
  },
  {
    id: '5',
    name: '하이드로겔 (PEG 기반)',
    category: '하이드로겔',
    subcategory: '합성 하이드로겔',
    description: '높은 수분 보유력과 우수한 생체적합성을 가진 폴리에틸렌글리콜 기반 하이드로겔로, 조직공학과 약물전달 분야에 활용됩니다.',
    properties: {
      biodegradable: true,
      biocompatible: true,
      tensileStrength: 0.1,
      elasticModulus: 0.01,
      degradationTime: '1-6개월',
      temperature: {
        min: 4,
        max: 37
      }
    },
    applications: ['조직공학', '약물전달', '세포배양', '상처치료', '안과용'],
    suppliers: ['Sigma-Aldrich', 'Merck', '바이오니아'],
    certification: ['USP Class VI', 'ISO 10993', 'CE 마크'],
    imageUrl: '/images/hydrogel.jpg',
    price: {
      amount: 180000,
      unit: 'kg당',
      currency: 'KRW'
    },
    inStock: false,
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-21')
  },
  {
    id: '6',
    name: '바이오세라믹 (하이드록시아파타이트)',
    category: '바이오세라믹',
    subcategory: '인산칼슘 기반',
    description: '골조직과 유사한 화학적 조성을 가진 바이오세라믹으로, 뛰어난 골전도성과 생체적합성을 제공하여 정형외과 임플란트에 사용됩니다.',
    properties: {
      biodegradable: false,
      biocompatible: true,
      tensileStrength: 100,
      elasticModulus: 80,
      degradationTime: '비분해성',
      temperature: {
        min: -50,
        max: 1000
      }
    },
    applications: ['정형외과 임플란트', '치과 임플란트', '골이식재', '코팅재료'],
    suppliers: ['Zimmer Biomet', 'Straumann', '오스템임플란트'],
    certification: ['FDA 승인', 'CE 마크', 'ISO 13485'],
    imageUrl: '/images/hydroxyapatite.jpg',
    price: {
      amount: 85000,
      unit: 'kg당',
      currency: 'KRW'
    },
    inStock: true,
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: '7',
    name: 'HeLa 세포주',
    category: '배양세포주',
    subcategory: '인간 암세포주',
    description: '자궁경부암에서 유래한 인간 불멸화 세포주로, 생물학 연구에서 가장 널리 사용되는 세포주 중 하나입니다.',
    properties: {
      biodegradable: false,
      biocompatible: true,
    },
    applications: ['암 연구', '세포생물학', '바이러스 연구', '약물 스크리닝', '백신 개발'],
    suppliers: ['ATCC', 'KCLB', '한국세포주은행'],
    certification: ['ATCC 인증', 'STR 프로파일링', 'Mycoplasma-free'],
    imageUrl: '/images/hela.jpg',
    price: {
      amount: 350000,
      unit: 'vial당',
      currency: 'KRW'
    },
    inStock: true,
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-23')
  },
  {
    id: '8',
    name: 'CHO 세포주',
    category: '배양세포주',
    subcategory: '동물 세포주',
    description: '중국 햄스터 난소 세포에서 유래한 세포주로, 단백질 생산 및 바이오의약품 제조에 광범위하게 사용됩니다.',
    properties: {
      biodegradable: false,
      biocompatible: true,
    },
    applications: ['단백질 생산', '바이오의약품 제조', '항체 생산', '백신 생산', '세포치료제'],
    suppliers: ['ATCC', 'Thermo Fisher', '셀진바이오'],
    certification: ['FDA 승인', 'GMP 적합', 'ICH 가이드라인'],
    imageUrl: '/images/cho.jpg',
    price: {
      amount: 420000,
      unit: 'vial당',
      currency: 'KRW'
    },
    inStock: true,
    createdAt: new Date('2024-01-17'),
    updatedAt: new Date('2024-01-24')
  },
  {
    id: '9',
    name: 'HEK293 세포주',
    category: '배양세포주',
    subcategory: '인간 세포주',
    description: '인간 배아 신장 세포에서 유래한 세포주로, 유전자 발현 연구와 바이러스 생산에 널리 사용됩니다.',
    properties: {
      biodegradable: false,
      biocompatible: true,
    },
    applications: ['유전자 발현', '바이러스 생산', '단백질 발현', '형질전환 연구', '백신 개발'],
    suppliers: ['ATCC', 'Invitrogen', '코스모진테크'],
    certification: ['ATCC 인증', 'Mycoplasma 음성', 'STR 검증'],
    imageUrl: '/images/hek293.jpg',
    price: {
      amount: 380000,
      unit: 'vial당',
      currency: 'KRW'
    },
    inStock: true,
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-25')
  },
  {
    id: '10',
    name: 'iPSC (유도만능줄기세포)',
    category: '배양세포주',
    subcategory: '줄기세포',
    description: '성체 세포를 역분화시켜 만든 유도만능줄기세포로, 재생의학과 질병 모델링에 혁신적인 도구입니다.',
    properties: {
      biodegradable: false,
      biocompatible: true,
    },
    applications: ['재생의학', '질병 모델링', '약물 스크리닝', '세포치료', '조직공학'],
    suppliers: ['RIKEN', 'Thermo Fisher', '차바이오텍'],
    certification: ['GMP 등급', 'Pluripotency 검증', 'Karyotype 정상'],
    imageUrl: '/images/ipsc.jpg',
    price: {
      amount: 850000,
      unit: 'vial당',
      currency: 'KRW'
    },
    inStock: false,
    createdAt: new Date('2024-01-19'),
    updatedAt: new Date('2024-01-26')
  },
  {
    id: '11',
    name: 'Bacillus subtilis (바실러스 서브틸리스)',
    category: '미생물',
    subcategory: '세균',
    description: '토양이나 장내에 널리 존재하는 그람 양성 세균으로, 효소 생산 및 프로바이오틱스로 산업적으로 중요하게 사용됩니다.',
    properties: {
      biodegradable: true,
      biocompatible: true,
    },
    applications: ['프로바이오틱스', '산업용 효소 생산', '고초균', '농업용 미생물', '환경 정화'],
    suppliers: ['ATCC', 'KCTC', 'DSM'],
    certification: ['GRAS 인증', 'Non-GMO'],
    imageUrl: '/images/bacillus.jpg',
    price: {
      amount: 150000,
      unit: 'strain당',
      currency: 'KRW'
    },
    inStock: true,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01')
  }
];

export const biomaterialCategories = [
  '생분해성 플라스틱',
  '천연 생체재료',
  '하이드로겔',
  '바이오세라믹',
  '금속 생체재료',
  '복합재료',
  '배양세포주'
];

export const biomaterialApplications = [
  '의료용 임플란트',
  '조직공학',
  '약물전달',
  '상처치료',
  '치과재료',
  '정형외과',
  '화장품',
  '포장재',
  '3D 프린팅',
  '의료기기'
]; 