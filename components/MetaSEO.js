import Head from 'next/head'

export default function MetaSEO({ title, description }) {
  return (
    <Head>
      <title>{title ? `${title} | Classic Jobs` : 'Classic Jobs'}</title>
      {description && <meta name="description" content={description} />}
    </Head>
  )
}
