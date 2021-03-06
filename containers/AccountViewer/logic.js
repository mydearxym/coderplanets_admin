// import R from 'ramda'
import { useEffect } from 'react'

import { EVENT, ERR, TYPE } from '@constant'
import { asyncSuit, buildLog, send, Global } from '@utils'

import S from './schema'

/* eslint-disable no-unused-vars */
const log = buildLog('L:AccountViewer')
/* eslint-enable no-unused-vars */

const { SR71, $solver, asyncRes, asyncErr } = asyncSuit
const sr71$ = new SR71({
  recieve: [EVENT.LOGIN],
})

let store = null
let sub$ = null

export const loadAccount = () => {
  markLoading(true)

  store.mark({ viewingType: 'account' })
  return sr71$.query(S.user, {})
}

export const loadUser = user => {
  store.mark({ viewingType: 'user', viewingUser: user })
  sr71$.query(S.user, { login: user.login })
}

export const changeTheme = name => store.changeTheme(name)

export const editProfile = () =>
  send(EVENT.PREVIEW_OPEN, { type: TYPE.PREVIEW_ACCOUNT_EDIT })

export const onLogout = () => {
  store.logout()

  setTimeout(() => {
    Global.location.reload(false)
  }, 2000)
  // send(EVENT.LOGOUT)
}

const markLoading = (maybe = true) => store.mark({ loading: maybe })

// ###############################
// Data & Error handlers
// ###############################
const DataSolver = [
  {
    match: asyncRes('user'),
    action: ({ user }) => {
      markLoading(false)
      if (store.viewingType === 'user') {
        return store.mark({ viewingUser: user })
      }
      return store.updateAccount(user)
    },
  },
  {
    match: asyncRes(EVENT.LOGIN),
    action: () => loadAccount(),
  },
]

const ErrSolver = [
  {
    match: asyncErr(ERR.CRAPHQL),
    action: ({ details }) => {
      log('ERR.CRAPHQL -->', details)
      markLoading(false)
    },
  },
  {
    match: asyncErr(ERR.TIMEOUT),
    action: ({ details }) => {
      log('ERR.TIMEOUT -->', details)
      markLoading(false)
    },
  },
  {
    match: asyncErr(ERR.NETWORK),
    action: ({ details }) => {
      log('ERR.NETWORK -->', details)
      markLoading(false)
    },
  },
]

export const loadUserInfo = user => {
  if (user) return loadUser(user)
  loadAccount()
}

// ###############################
// init & uninit
// ###############################
export const useInit = (_store, user) => {
  useEffect(
    () => {
      store = _store
      if (sub$) return loadUserInfo(user)
      sub$ = sr71$.data().subscribe($solver(DataSolver, ErrSolver))

      loadUserInfo(user)

      return () => {
        if (store.loading || !sub$) return false
        log('===== do uninit')
        sub$.unsubscribe()
        sub$ = null
      }
    },
    [_store, user]
  )
}
