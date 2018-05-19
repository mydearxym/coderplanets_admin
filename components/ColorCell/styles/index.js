import styled from 'styled-components'

export const ColorCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

export const ColorDot = styled.div`
  width: 10px;
  height: 10px;
  background: ${props => props.color};
  border-radius: 100%;
`

export const ColorTitle = styled.div`
  margin-left: 5px;
`