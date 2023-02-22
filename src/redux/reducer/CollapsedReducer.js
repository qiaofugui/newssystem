export const CollapsedReducer = (prevState = {
  isCollapsed: false
}, action) => {

  let { type } = action
  let newState = { ...prevState }
  switch (type) {
    case 'change_collapsed':
      newState.isCollapsed = !newState.isCollapsed
      return newState

    default:
      return prevState
  }
}