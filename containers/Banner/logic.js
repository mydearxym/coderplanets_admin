// import R from 'ramda'

import { buildLog, $solver } from '@utils'
import SR71 from 'utils/network/sr71'

const sr71$ = new SR71()
let sub$ = null

/* eslint-disable no-unused-vars */
const debug = buildLog('L:Banner')
/* eslint-enable no-unused-vars */

let store = null

export function someMethod() {}

// ###############################
// Data & Error handlers
// ###############################

const DataSolver = []
const ErrSolver = []

export function init(selectedStore) {
  store = selectedStore
  debug(store)
  if (sub$) sub$.unsubscribe()
  sub$ = sr71$.data().subscribe($solver(DataSolver, ErrSolver))
}
