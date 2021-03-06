# lit-state
[![npm](https://img.shields.io/npm/v/lit-state.svg)](https://github.com/Amoroth/lit-state)
[![npm bundle size](https://img.shields.io/bundlephobia/min/lit-state.svg)](https://github.com/Amoroth/lit-state)

A helpful wrapper for creating functional components with lit-html templating. It requires lit-html to be installed

## Install
``` $ npm install lit-state ```

## Usage
`lit-state` lets you hold state in functional components. To create such component you have to connect it to higher order function `connectState`.

```javascript
import { html } from 'lit-html'
import { connectState } from 'lit-state'

const initialState = {
  name: 'John'
}

const greeter = ({ state }) => html`<p>Hello ${state.name}!</p>`

export default connectState(greeter, initialState)
```

It returns a function to initialize the component. State is passed to component through an object so you can easily extract it with destructuring. The returned state is immutable though, changing it will have no effect on a component and can cause some problems by having local state "desynced" with the real state of a component.

You can change the state by using another supplyed function, `setState`.

```javascript
const initialState = {
  decision: false,
  someOther: 'value'
}

const hesitant = ({ state, setState }) => {
  const changeMind = () => setState({ decision: !state.decision })

  return html`
  <div>
    <p>Are you sure?</p>
    <button @click=${changeMind}>Change</button>
  </div>`
}
```

The state will be changed this way and triggier a rerender. It is alse worth noting, that the state will change only properties specified in setState function, without touching other values.

To pass props to a component, you can just provide an object when calling the function and extract it the same way as state.
```javascript
const showMe = connectState(({ props }) => {
  return html`<p>I can see... ${props.thing}</p>`
}, {})

const exposer = () => {
  return html`${showMe({ thing: 'banana' })}`
}
```

Rerendering the page with setState will only take place when the root component is mounted to the DOM with `renderDOM` function.

```javascript
import { html } from 'lit-html'
import { renderDOM } from 'lit-state'

const App = () => html`<div>Hello World!</div>`

renderDOM(App(), '#root')
```

You have to only supply the root component and a query selector, where to mount it in the document. If no selector was provided, component will be mounted to the document body.
