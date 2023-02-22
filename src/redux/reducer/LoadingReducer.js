export const LoadingReducer = (prevState = {
  isLoading: false
}, action) => {

  let { type, payload } = action
  let newState = { ...prevState }
  switch (type) {
    case 'change_loading':
      newState.isLoading = payload
      return newState

    default:
      return prevState
  }
}