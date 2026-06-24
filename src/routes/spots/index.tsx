import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/spots/')({
  component: () => <main>Discover</main>,
})
