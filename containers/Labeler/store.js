/*
 * Labeler store
 *
 */

import { types as t, getParent } from 'mobx-state-tree'
// import R from 'ramda'
import { Tag } from '@model'

import { markStates, buildLog, stripMobx } from '@utils'
/* eslint-disable no-unused-vars */
const log = buildLog('S:Labeler')
/* eslint-enable no-unused-vars */

const Labeler = t
  .model('Labeler', {
    tags: t.optional(t.array(Tag), []),
  })
  .views(self => ({
    get root() {
      return getParent(self)
    },
    get curCommunity() {
      return stripMobx(self.root.viewing.community)
    },
    get curThread() {
      return self.root.viewing.activeThread
    },
    get tagsData() {
      return stripMobx(self.tags)
    },
  }))
  .actions(self => ({
    mark(sobj) {
      markStates(sobj, self)
    },
  }))

export default Labeler
