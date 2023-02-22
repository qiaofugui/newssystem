export const SideMenuReducer = (prevState = {
  sideMenu: []
}, action) => {

  let { type, payload } = action
  let newState = { ...prevState }
  switch (type) {
    case 'change_sideMenu':
      newState.sideMenu = payload
      console.log(newState.sideMenu)
      return newState

    default:
      return prevState
  }
}
