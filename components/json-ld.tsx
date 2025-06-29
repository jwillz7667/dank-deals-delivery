interface JsonLdProps {
  data: object
}

function JsonLd({ data }: JsonLdProps) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
}

export default JsonLd
export { JsonLd }
