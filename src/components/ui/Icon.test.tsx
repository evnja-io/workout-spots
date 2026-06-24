import { render } from '@testing-library/react'
import { expect, test } from 'vitest'
import { Icon } from './Icon'

test('renders an svg of given size', () => {
  const { container } = render(<Icon name="search" size={20} />)
  const svg = container.querySelector('svg')
  expect(svg).toBeInTheDocument()
  expect(svg).toHaveAttribute('width', '20')
})
