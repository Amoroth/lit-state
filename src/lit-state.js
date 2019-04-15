import { directive, render, html } from 'lit-html'

const stateMap = new WeakMap()

const updateDOM = comp => render(comp(), document.body)

export const renderDOM = (entryComponent) => {
  let wrapperComponent = entryComponent.prototype ? entryComponent : () => html`${entryComponent}`
  window.addEventListener('updateDOM', () => updateDOM(wrapperComponent))
  updateDOM(wrapperComponent)
}

export const connectState = directive((component, state) => (part) => {
  let compState = stateMap.get(part)
  if (compState === undefined) {
    compState = Object.assign({}, state)
    stateMap.set(part, compState)
  }
  const compSetState = (newState) => {
    stateMap.set(part, { ...compState, ...newState })
    window.dispatchEvent(new Event('updateDOM'))
  }
  part.setValue(component({
    state: Object.assign({}, compState),
    setState: compSetState,
  }))
})
