import { html } from 'lit-html'
import { renderDOM, connectState } from '../src/lit-state'

const initialState = {
  firstValue: 1,
  secondValue: false
}

beforeEach(() => {
  renderDOM(() => html``)
})

const getApp = () => {
  return connectState(({ state, setState }) => {
    const changeState = () => {
      setState({ firstValue: state.firstValue + 1 })
    }
    return html`
    <div>
      <p>${state.firstValue}</p>
      <p>${state.secondValue}</p>
      <button @click=${changeState} @keypress=${() => state.secondValue = true}>Change</button>
    </div>`
  }, initialState)
}

test('renders template to DOM', () => {
  expect(document.body.querySelectorAll('*').length).toBe(0)
  renderDOM(getApp())
  expect(document.body.innerHTML).not.toBe('')
  expect(document.querySelector('p')).toBeTruthy()
  expect(document.querySelector('button')).toBeTruthy()
})

test('updates state', () => {
  renderDOM(getApp())
  expect(document.querySelector('p').textContent).toBe('1')
  document.querySelector('button').click()
  expect(document.querySelector('p').textContent).toBe('2')
})

test('state update changes only this component', () => {
  renderDOM(() => html`
    ${getApp()}
    ${getApp()}
    ${getApp()}`)
  const components = document.querySelectorAll('div')
  expect(components[0].querySelector('p').textContent).toBe('1')
  expect(components[1].querySelector('p').textContent).toBe('1')
  expect(components[2].querySelector('p').textContent).toBe('1')
  components[1].querySelector('button').click()
  components[2].querySelector('button').click()
  components[2].querySelector('button').click()
  expect(components[0].querySelector('p').textContent).toBe('1')
  expect(components[1].querySelector('p').textContent).toBe('2')
  expect(components[2].querySelector('p').textContent).toBe('3')
})

test('renders to target node', () => {
  document.body.appendChild(document.createElement('div'))
  document.body.appendChild(document.createElement('div'))
  document.querySelectorAll('div')[0].id = 'empty'
  document.querySelectorAll('div')[1].id = 'root'
  renderDOM(getApp(), '#root')
  expect(document.querySelector('#empty').children.length).toBe(0)
  expect(document.querySelector('#root').children.length).toBe(1)
})

test('setState mutates only provided properties', () => {
  renderDOM(getApp())
  expect(document.querySelectorAll('p')[0].textContent).toBe('1')
  expect(document.querySelectorAll('p')[1].textContent).toBe('false')
  document.querySelector('button').click()
  expect(document.querySelectorAll('p')[0].textContent).toBe('2')
  expect(document.querySelectorAll('p')[1].textContent).toBe('false')
})

// changes to state directly does not mutate state
test('changes to state directly does not mutate state', () => {
  renderDOM(getApp())
  expect(document.querySelectorAll('p')[1].textContent).toBe('false')
  document.querySelector('button').dispatchEvent(new Event('keypress'))
  expect(document.querySelectorAll('p')[1].textContent).toBe('false')
  document.querySelector('button').click()
  expect(document.querySelectorAll('p')[1].textContent).toBe('false')
})

// state deep clone

// can pass props

// can mount to selector or node
