import { PageProject } from '@/features/projects/PageProject'

type Props = {
  params: Promise<{ id: string }>
}

export default async function ProjectPage({ params }: Props) {
  const { id } = await params
  return <PageProject projectId={id} />
}
