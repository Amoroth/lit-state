import { directive, render, html } from 'lit-html'

const stateMap = new WeakMap()

let wrapperComponent = null
let targetNode = document.body

const updateDOM = () => {
  render(wrapperComponent(), targetNode)
}

export const renderDOM = (entryComponent, target) => {
  if (!entryComponent) {
    throw new Error('First argument has to be an html template!')
  }
  if (wrapperComponent !== entryComponent) {
    wrapperComponent = entryComponent.$statefulComponent ? () => html`${entryComponent}` : entryComponent
  }
  if (target) {
    targetNode = document.querySelector(target)
    if (!targetNode) {
      throw new Error('Couldn\'t find target node!')
    }
  } else {
    targetNode = document.body
  }
  updateDOM()
}

const stateDirective = (component, state) => {
  const innerPart = (part) => {
    let compState = stateMap.get(part)
    if (compState === undefined) {
      compState = Object.assign({}, state)
      stateMap.set(part, compState)
    }
    const compSetState = (newState) => {
      stateMap.set(part, { ...compState, ...newState })
      updateDOM()
    }
    part.setValue(component({
      state: Object.assign({}, compState),
      setState: compSetState,
    }))
  }
  innerPart.$statefulComponent = true
  return innerPart
}

export const connectState = directive(stateDirective)
