type CategoryPageProps = {
  params: { slug: string }
}

export default function Page({ params }: CategoryPageProps) {
  return <div>Category: {params.slug}</div>
}
