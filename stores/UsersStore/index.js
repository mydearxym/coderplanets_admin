/*
 * UsersStore store
 *
 */

import { types as t, getParent } from 'mobx-state-tree'
// import R from 'ramda'
import { markStates, buildLog } from '@utils'
import { User } from '@model'
/* eslint-disable no-unused-vars */
const log = buildLog('S:UsersStore')
/* eslint-enable no-unused-vars */

const UsersStore = t
  .model('UsersStore', {
    all: t.maybeNull(t.array(User)),
    visiting: User,
    // filter: ...
    // account: ..
    // curVisit: ...
    // all: ...
  })
  .views(self => ({
    get root() {
      return getParent(self)
    },
  }))
  .actions(self => ({
    mark(sobj) {
      markStates(sobj, self)
    },
  }))

export default UsersStore
