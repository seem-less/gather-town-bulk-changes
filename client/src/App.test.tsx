import { render } from '@testing-library/react'
import App from './App'

test('renders learn react link', () => {
  const { getByText } = render(<App />)
  getByText('Gather Town Bulk Changes')
  getByText('Edit API Key')
  getByText('Add new Space')
})
