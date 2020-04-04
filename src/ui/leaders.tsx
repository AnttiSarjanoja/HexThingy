import React, { useContext } from 'react'
import LeaderImg from '../img/leader.png'
import { UIContext } from './ui-state'
import { actionsWithDispatch } from './ui-state'

type UiActions = ReturnType<typeof actionsWithDispatch>

const Leaders = ({ uiActions }: { uiActions: UiActions }) => {
  const { playerData, chosenLeader } = useContext(UIContext)
  const chosenName = chosenLeader?.name

  return (
    <div
      id={'top-bar'}
      style={{
        position: 'absolute',
        width: '100%',
        textAlign: 'center',
        pointerEvents: 'none',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      {playerData.leaders.map(({ name }) => {
        const isChosen = name === chosenName
        return (
          <div
            key={name}
            style={{
              backgroundColor: isChosen ? '#ff0000' : '#666666',
              padding: '5px',
              pointerEvents: 'all',
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            <span>{name}</span>
            <img
              src={LeaderImg}
              onClick={() => uiActions.leaderSelect({ name })}
            />
          </div>
        )
      })}
    </div>
  )
}

export default Leaders
