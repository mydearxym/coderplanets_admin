// import R from 'ramda'
// import Router from 'next/router'
import {
  gqRes,
  gqErr,
  makeDebugger,
  $solver,
  ERR,
  EVENT,
  TYPE,
  dispatchEvent,
} from '../../utils'

import SR71 from '../../utils/network/sr71'

import S from './schema'

const sr71$ = new SR71({
  resv_event: [EVENT.PREVIEW_CLOSE],
})
/* eslint-disable no-unused-vars */
const debug = makeDebugger('L:communitiesBanner')
/* eslint-enable no-unused-vars */

let communitiesBanner = null

export function loadCommunities() {
  sr71$.query(S.communities, { filter: {} })
}

export function loadPosts() {
  sr71$.query(S.pagedPosts, { filter: {} })
}

export function loadTags() {
  sr71$.query(S.tags, { filter: {} })
}

export function onAdd(part) {
  switch (part) {
    case 'tags': {
      debug('onAdd part: ', part)
      return dispatchEvent(EVENT.NAV_CREATE_TAG, {
        type: TYPE.PREVIEW_CREATE_TAG,
      })
    }
    default: {
      debug('onAdd part: ', part)

      return dispatchEvent(EVENT.NAV_CREATE_COMMUNITY, {
        type: TYPE.PREVIEW_CREATE_COMMUNITY,
      })
    }
  }
}

const DataSolver = [
  {
    match: gqRes('communities'),
    action: ({ communities: { totalCount } }) =>
      communitiesBanner.markState({
        totalCount,
      }),
  },
  {
    match: gqRes('tags'),
    action: ({ tags: { totalCount } }) =>
      communitiesBanner.markState({
        tagsTotalCount: totalCount,
      }),
  },
  {
    match: gqRes('pagedPosts'),
    action: ({ pagedPosts: { totalCount } }) =>
      communitiesBanner.markState({
        postsTotalCount: totalCount,
      }),
  },
  {
    match: gqRes(EVENT.PREVIEW_CLOSE),
    action: res => {
      const closeType = res[EVENT.PREVIEW_CLOSE].type
      if (closeType === TYPE.COMMUNITIES_REFRESH) {
        loadCommunities()
      } else if (closeType === TYPE.TAGS_REFRESH) {
        loadTags()
      }
    },
  },
]

const ErrSolver = [
  {
    match: gqErr(ERR.CRAPHQL),
    action: ({ details }) => {
      debug('ERR.CRAPHQL -->', details)
    },
  },
  {
    match: gqErr(ERR.TIMEOUT),
    action: ({ details }) => {
      debug('ERR.TIMEOUT -->', details)
    },
  },
  {
    match: gqErr(ERR.NETWORK),
    action: ({ details }) => {
      debug('ERR.NETWORK -->', details)
    },
  },
]

export function init(selectedStore) {
  communitiesBanner = selectedStore
  sr71$.data().subscribe($solver(DataSolver, ErrSolver))
}
