// import R from 'ramda'
// import store from 'store'

import { EVENT, TYPE, ERR } from '@constant'
import { asyncSuit, buildLog, send } from '@utils'

import S from './schema'

/* eslint-disable no-unused-vars */
const log = buildLog('L:Header')
/* eslint-enable no-unused-vars */

const { SR71, asyncRes, asyncErr, $solver } = asyncSuit
const sr71$ = new SR71()

let store = null
let sub$ = null
/* const user_token = */

export function previewState() {
  // store.openPreview(type)
  send(EVENT.PREVIEW, {
    type: TYPE.PREVIEW_ROOT_STORE,
  })
}

export function signinGithub(code) {
  log('signin_github: ', code)
  const args = {
    code,
  }
  sr71$.mutate(S.githubSignin, args)
}

export const checkSesstionState = () => sr71$.query(S.sessionState, {})

export function previewAccount() {
  send(EVENT.PREVIEW, {
    type: TYPE.PREVIEW_ACCOUNT_VIEW,
    data: { hello: 'world --- fuck' },
  })
}

export function login() {
  log('do login')
  send(EVENT.LOGIN_PANEL)
}

export function openPreview() {
  send(EVENT.PREVIEW, {
    type: TYPE.PREVIEW_ACCOUNT_VIEW,
    data: { hello: 'world' },
  })
}

const DataSolver = [
  {
    match: asyncRes('sessionState'),
    action: ({ sessionState: state }) => store.updateSesstion(state),
  },
  {
    // TODO move it to user side view
    match: asyncRes('githubSigninRes'),
    action: ({ githubSigninRes }) => {
      log('dataResolver  --->', githubSigninRes)
    },
  },
  {
    match: asyncRes('user'),
    action: ({ user }) => {
      log('dataResolver userRes  --->', user)
      /* store.set('user', { ...data }) */
      store.updateAccount(user)
    },
  },
]

const ErrSolver = [
  {
    match: asyncErr(ERR.CRAPHQL),
    action: ({ details }) => {
      log('ERR.CRAPHQL -->', details)
    },
  },
  {
    match: asyncErr(ERR.TIMEOUT),
    action: ({ details }) => {
      log('ERR.TIMEOUT -->', details)
    },
  },
  {
    match: asyncErr(ERR.NETWORK),
    action: ({ details }) => {
      log('ERR.NETWORK -->', details)
    },
  },
]

export function init(_store) {
  store = _store

  if (sub$) return checkSesstionState()

  sr71$.data().subscribe($solver(DataSolver, ErrSolver))
  checkSesstionState()
}

export function uninit() {
  if (!sub$) return false
  log('===== do uninit')
  sub$.unsubscribe()
  sub$ = null
}
