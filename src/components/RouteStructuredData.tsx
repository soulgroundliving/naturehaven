import { useLocation } from 'react-router-dom';
import { useJsonLd } from '@/hooks/usePageMeta';
import { routeStructuredData } from '@/lib/structuredData';

const RouteStructuredData = () => {
  const { pathname } = useLocation();
  useJsonLd('nh-route-schema', routeStructuredData(pathname));
  return null;
};

export default RouteStructuredData;
