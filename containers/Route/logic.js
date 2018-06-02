import R from 'ramda'

import { makeDebugger /*  isEmptyNil, getParameterByName */ } from '../../utils'

/* eslint-disable no-unused-vars */
const debug = makeDebugger('L:Route')
/* eslint-enable no-unused-vars */

let route = null
const INDEX = ''

const parseMainPath = R.compose(
  R.head,
  R.split('?'),
  R.head,
  R.reject(R.isEmpty),
  R.split('/'),
  R.prop('asPath')
)

const parseSubPathList = R.compose(
  R.reject(R.isEmpty),
  R.split('/'),
  R.head,
  R.reject(R.contains('=')),
  R.reject(R.isEmpty),
  R.split('?'),
  R.prop('asPath')
)

const getMainPath = routeObj => {
  if (R.isEmpty(routeObj)) return INDEX
  if (routeObj.asPath === '/') return INDEX

  return parseMainPath(routeObj)
}

const getSubPath = routeObj => {
  if (R.isEmpty(routeObj)) return INDEX
  if (routeObj.asPath === '/') return INDEX

  const asPathList = parseSubPathList(routeObj)

  return asPathList.length > 1 ? asPathList[1] : asPathList[0]
}

export function syncRoute(routeObj) {
  const mainQuery = getMainPath(routeObj)
  const subQuery = getSubPath(routeObj)

  const { query } = routeObj

  // TODO: mainQuery -> mainPath
  //       subQuery  -> subPath
  route.markState({
    mainQuery,
    subQuery,
    query,
  })
}

export function init(selectedStore) {
  route = selectedStore
}
