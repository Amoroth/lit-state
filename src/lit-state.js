import { directive, render, html } from 'lit-html'

const stateMap = new WeakMap()

const updateDOM = (comp, target) => {
  render(comp(), target)
}

export const renderDOM = (entryComponent, target) => {
  let wrapperComponent = entryComponent.prototype ? entryComponent : () => html`${entryComponent}`
  let targetNode = document.body
  if (target) {
    targetNode = document.querySelector(target)
    if (!targetNode) {
      throw new Error('Couldn\'t find target node!')
    }
  }
  window.addEventListener('updateDOM', () => updateDOM(wrapperComponent, targetNode))
  updateDOM(wrapperComponent, targetNode)
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
