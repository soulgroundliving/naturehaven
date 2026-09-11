import { FAQ_ITEMS, PARKING_CAPACITY_APPROX, PETS_POLICY, PRICE_FROM, PRICE_TO, PROPERTY } from '@/data/propertyFacts';

const siteUrl = PROPERTY.url;

const postalAddress = {
  '@type': 'PostalAddress',
  addressLocality: PROPERTY.locality,
  addressRegion: PROPERTY.region,
  postalCode: PROPERTY.postalCode,
  addressCountry: PROPERTY.country,
};

const sameAs = [
  PROPERTY.lineUrl,
  PROPERTY.instagramUrl,
  PROPERTY.facebookUrl,
  PROPERTY.tiktokUrl,
];

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${siteUrl}/#organization`,
  name: PROPERTY.name,
  alternateName: ['เนเจอร์ เฮเว่น', PROPERTY.legalName],
  description:
    `Nature Haven อพาร์ทเมนท์สายไหม บนถนนเฉลิมพงษ์ เลี้ยงสัตว์ได้ทั้งตึกในกรุงเทพฯ. 25.2 sqm one-bedroom homes with a multi-purpose storage cabinet (microwave station, next to the fridge) and a private balcony (with dish sink) — pets welcome throughout the entire building; Wi-Fi, housekeeping, and A/C maintenance included (electricity and water metered separately). ${PRICE_FROM.toLocaleString('en-US')}–${PRICE_TO.toLocaleString('en-US')} THB/month by floor, private viewings by appointment via LINE. Reservations open October 2026; move-in from November 2026.`,
  url: siteUrl,
  image: `${siteUrl}/og-image-v2.jpg`,
  priceRange: '฿฿',
  address: postalAddress,
  geo: {
    '@type': 'GeoCoordinates',
    latitude: PROPERTY.latitude,
    longitude: PROPERTY.longitude,
  },
  hasMap: PROPERTY.mapsUrl,
  areaServed: { '@type': 'City', name: PROPERTY.region },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    url: PROPERTY.lineUrl,
    availableLanguage: ['th', 'en'],
  },
  sameAs,
  subjectOf: { '@id': `${siteUrl}/#apartmentcomplex` },
};

// Exported on its own so /residence (ResidencePage.tsx) can reuse it as its
// primary entity instead of a generic WebPage — that page IS this entity.
export const apartmentComplexSchema = {
  '@context': 'https://schema.org',
  '@type': 'ApartmentComplex',
  '@id': `${siteUrl}/#apartmentcomplex`,
  name: PROPERTY.name,
  description:
    'Nature Haven is a newly built 20-unit อพาร์ทเมนท์เลี้ยงสัตว์ได้ on Chaloem Phong Road, Sai Mai, Bangkok. 25.2 sqm homes with 1 bedroom, 1 bathroom, a multi-purpose storage cabinet with a microwave station, and a private balcony — quiet low-density community. Rent includes Wi-Fi, cleaning and A/C maintenance; electricity and water are metered separately. Reservations open October 2026; move-in from November 2026.',
  url: siteUrl,
  image: `${siteUrl}/og-image-v2.jpg`,
  address: postalAddress,
  geo: {
    '@type': 'GeoCoordinates',
    latitude: PROPERTY.latitude,
    longitude: PROPERTY.longitude,
  },
  numberOfAccommodationUnits: {
    '@type': 'QuantitativeValue',
    value: PROPERTY.totalUnits,
  },
  petsAllowed: PETS_POLICY.en,
  amenityFeature: [
    { '@type': 'LocationFeatureSpecification', name: 'Pet friendly (every floor)', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Quiet, low-density community', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Private balcony', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Free Wi-Fi (AIS Fiber)', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Solar energy integration', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Digital door lock', value: true },
    { '@type': 'LocationFeatureSpecification', name: '24/7 CCTV', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Smart resident app', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Housekeeping included', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'A/C maintenance included', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Common garden area', value: true },
    { '@type': 'LocationFeatureSpecification', name: `Resident parking (~${PARKING_CAPACITY_APPROX} spaces, first-come first-served)`, value: true },
  ],
  accommodationFloorPlan: {
    '@type': 'FloorPlan',
    name: '1-Bedroom (25.2 sqm) — Pet-Friendly',
    numberOfBedrooms: 1,
    numberOfBathroomsTotal: 1,
    floorSize: { '@type': 'QuantitativeValue', value: 25.2, unitCode: 'MTK' },
    petsAllowed: true,
  },
  makesOffer: {
    '@type': 'AggregateOffer',
    name: 'Pet-Friendly Residence — Opening Rate',
    description: `Every unit is pet-friendly. ${PRICE_FROM.toLocaleString('en-US')} THB/month on floors 3–4, ${PRICE_TO.toLocaleString('en-US')} THB/month on floors 1–2. Wi-Fi, cleaning and A/C maintenance included; electricity and water metered separately.`,
    priceCurrency: 'THB',
    lowPrice: String(PRICE_FROM),
    highPrice: String(PRICE_TO),
    offerCount: PROPERTY.totalUnits,
    availabilityStarts: PROPERTY.availableFrom,
    eligibleDuration: { '@type': 'QuantitativeValue', value: 12, unitCode: 'MON' },
  },
};

const faqPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  '@id': `${siteUrl}/#faq`,
  mainEntity: FAQ_ITEMS.map((item) => ({
    '@type': 'Question',
    name: item.q_th,
    acceptedAnswer: {
      '@type': 'Answer',
      text: `${item.a_th} ${item.a_en}`,
    },
  })),
};

export const homeStructuredData = [organizationSchema, apartmentComplexSchema, faqPageSchema];

const pageSchema = (type: 'CollectionPage' | 'WebPage', pathname: string, name: string, description: string) => ({
  '@context': 'https://schema.org',
  '@type': type,
  '@id': `${siteUrl}${pathname}#page`,
  name,
  description,
  url: `${siteUrl}${pathname}`,
  isPartOf: { '@id': `${siteUrl}/#website` },
});

export function routeStructuredData(pathname: string) {
  if (pathname === '/') return homeStructuredData;
  if (pathname === '/residence') {
    return { ...apartmentComplexSchema, '@id': `${siteUrl}/residence#apartmentcomplex`, url: `${siteUrl}/residence` };
  }
  if (pathname === '/places') {
    return pageSchema(
      'CollectionPage',
      '/places',
      'ร้านอาหาร คาเฟ่ และสถานที่ใกล้เคียงสายไหม | Nature Haven',
      'คู่มือร้านอาหาร คาเฟ่ ตลาด และสถานที่ใกล้เคียง Nature Haven ในย่านสายไหม กรุงเทพฯ พร้อมลิงก์แผนที่',
    );
  }
  if (pathname === '/journal') {
    return pageSchema(
      'CollectionPage',
      '/journal',
      'บันทึกจากเฮเวน — เรื่องเล่าการอยู่อย่างสงบ | Nature Haven',
      'เรื่องเล่าระหว่างสร้าง Nature Haven ชีวิตกับสัตว์เลี้ยง วัสดุ และย่านสายไหม กรุงเทพฯ',
    );
  }
  if (pathname.startsWith('/journal/') || pathname.startsWith('/collections/')) {
    return pageSchema('WebPage', pathname, 'Nature Haven — เรื่องเล่าจากเฮเวน', 'เรื่องเล่าและรายละเอียดการออกแบบจาก Nature Haven สายไหม กรุงเทพฯ');
  }
  if (pathname === '/links') {
    return pageSchema('WebPage', '/links', 'Nature Haven — ช่องทางทั้งหมด', 'รวม LINE, เว็บไซต์, บันทึกจากเฮเวน และแผนที่ของ Nature Haven สายไหม กรุงเทพฯ');
  }
  if (pathname === '/privacy') {
    return pageSchema('WebPage', '/privacy', 'นโยบายความเป็นส่วนตัว — Nature Haven', 'นโยบายความเป็นส่วนตัวของเว็บไซต์การตลาด Nature Haven');
  }
  return pageSchema('WebPage', pathname, 'Nature Haven', 'Nature Haven — ที่พักเงียบสงบในสายไหม กรุงเทพฯ');
}
