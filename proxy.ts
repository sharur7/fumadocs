import { NextRequest, NextResponse } from 'next/server';
import { isMarkdownPreferred, rewritePath } from 'fumadocs-core/negotiation';
import { docsContentRoute, docsRoute, pythonContentRoute, pythonRoute } from '@/lib/shared';

const { rewrite: rewriteDocs } = rewritePath(
  `${docsRoute}{/*path}`,
  `${docsContentRoute}{/*path}/content.md`,
);
const { rewrite: rewriteDocsSuffix } = rewritePath(
  `${docsRoute}{/*path}.md`,
  `${docsContentRoute}{/*path}/content.md`,
);

const { rewrite: rewritePy } = rewritePath(
  `${pythonRoute}{/*path}`,
  `${pythonContentRoute}{/*path}/content.md`,
);
const { rewrite: rewritePySuffix } = rewritePath(
  `${pythonRoute}{/*path}.md`,
  `${pythonContentRoute}{/*path}/content.md`,
);

export default function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const suffixResult = rewriteDocsSuffix(path) || rewritePySuffix(path);
  if (suffixResult) {
    return NextResponse.rewrite(new URL(suffixResult, request.nextUrl));
  }

  if (isMarkdownPreferred(request)) {
    const prefResult = rewriteDocs(path) || rewritePy(path);
    if (prefResult) {
      return NextResponse.rewrite(new URL(prefResult, request.nextUrl));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/docs/:path*', '/python/:path*'],
};

