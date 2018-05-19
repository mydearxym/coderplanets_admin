// import R from 'ramda'

import { makeDebugger, gqRes, $solver } from '../../utils'
import SR71 from '../../utils/network/sr71'

import S from './schema'

const sr71$ = new SR71()
let sub$ = null

/* eslint-disable no-unused-vars */
const debug = makeDebugger('L:CommunityBanner')
/* eslint-enable no-unused-vars */

let communityBanner = null

export function loadPosts() {
  sr71$.query(S.pagedPosts, { filter: {} })
}

export function loadTags() {
  sr71$.query(S.tags, { filter: {} })
}

export function onAdd() {}

// ###############################
// Data & Error handlers
// ###############################

const DataSolver = [
  {
    match: gqRes('pagedPosts'),
    action: ({ pagedPosts: { totalCount } }) => {
      return communityBanner.markState({
        postsTotalCount: totalCount,
      })
    },
  },
  {
    match: gqRes('tags'),
    action: ({ tags: { totalCount } }) => {
      communityBanner.markState({
        tagsTotalCount: totalCount,
      })
    },
  },
]
const ErrSolver = []

export function init(selectedStore) {
  communityBanner = selectedStore
  debug(communityBanner)
  if (sub$) sub$.unsubscribe()
  sub$ = sr71$.data().subscribe($solver(DataSolver, ErrSolver))
}