import { getLLMText, tsSource, pySource } from '@/lib/source';

export const revalidate = false;

export async function GET() {
  const allPages = [...tsSource.getPages(), ...pySource.getPages()];
  const scan = allPages.map(getLLMText);
  const scanned = await Promise.all(scan);

  return new Response(scanned.join('\n\n---\n\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
