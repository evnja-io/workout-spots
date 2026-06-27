import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ClubCreate } from '~/features/clubs/components/ClubCreate'

export const Route = createFileRoute('/clubs/new')({
  component: CreateClubPage,
})

function CreateClubPage() {
  const navigate = useNavigate()
  return <ClubCreate onCancel={() => void navigate({ to: '/clubs' })} />
}
