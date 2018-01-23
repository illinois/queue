/* eslint-disable import/prefer-default-export */

export function makeActionCreator(type, ...argNames) {
  return (...args) => {
    const action = { type }
    argNames.forEach((arg, index) => {
      action[argNames[index]] = args[index]
    })
    return action
  }
}
