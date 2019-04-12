import { directive, render } from 'lit-html'

const stateMap = new WeakMap()

const updateDOM = comp => render(comp(), document.body)

export const renderDOM = (entryComponent) => {
  window.addEventListener('updateDOM', () => updateDOM(entryComponent))
  updateDOM(entryComponent)
}

export const connectState = directive((component, state) => (part) => {
  let myState = stateMap.get(part)
  if (myState === undefined) {
    myState = Object.assign({}, state)
    stateMap.set(part, myState)
  }
  const mySetState = (newState) => {
    stateMap.set(part, { ...myState, ...newState })
    window.dispatchEvent(new Event('updateDOM'))
  }
  part.setValue(component({
    state: Object.assign({}, myState),
    setState: mySetState,
  }))
})
