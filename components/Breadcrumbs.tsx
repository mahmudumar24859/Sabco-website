import Link from 'next/link'

type Crumb = { name: string; href?: string }

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: it.href ? `https://sabco.com.ng${it.href}` : undefined,
    })),
  }

  return (
    <>
      <nav aria-label="Breadcrumb" className="text-sm">
        <ol className="flex flex-wrap items-center gap-2 text-slate-700 dark:text-slate-300">
          {items.map((it, i) => (
            <li key={`${it.name}-${i}`} className="flex items-center gap-2">
              {it.href ? (
                <Link href={it.href} className="hover:underline">
                  {it.name}
                </Link>
              ) : (
                <span aria-current="page">{it.name}</span>
              )}
              {i < items.length - 1 && <span className="opacity-60">/</span>}
            </li>
          ))}
        </ol>
      </nav>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  )
}