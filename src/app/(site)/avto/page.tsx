import { ServicePage, serviceMetadata } from "@/components/page/ServicePage";
import { getService } from "@/content/services";

const service = getService("avto");

export const metadata = serviceMetadata(service);

// Работы портфолио читаются из БД — обновляем раз в минуту.
export const revalidate = 60;

export default function Page() {
  return <ServicePage service={service} />;
}
