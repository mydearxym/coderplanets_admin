/*
 *
 * SocialSell
 *
 */

import React from 'react'
import T from 'prop-types'
import R from 'ramda'

import { ICON_CMD } from '@config'
import { buildLog } from '@utils'

import { Wrapper, SocalIcon } from './styles'

/* eslint-disable-next-line */
const log = buildLog('c:SocialSell:index')

const SocialSell = ({ data }) => {
  const validList = []

  R.forEachObjIndexed((v, k) => {
    if (v) {
      validList.push({ social: k, value: v })
    }
  }, data)

  return (
    <Wrapper>
      {validList.map(item => (
        <div key={item.social}>
          <a href={item.value} target="_blank" rel="noopener noreferrer">
            <SocalIcon src={`${ICON_CMD}/${item.social}.svg`} />
          </a>
        </div>
      ))}
    </Wrapper>
  )
}

SocialSell.propTypes = {
  data: T.object.isRequired,
}

SocialSell.defaultProps = {}

export default React.memo(SocialSell)
