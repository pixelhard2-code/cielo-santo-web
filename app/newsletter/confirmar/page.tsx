import ConfirmNewsletter from './ConfirmNewsletter';

export const metadata = { title: 'Confirmar suscripción', robots: { index: false, follow: false } };

export default async function ConfirmNewsletterPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token = '' } = await searchParams;
  return <main><ConfirmNewsletter token={token} /></main>;
}
