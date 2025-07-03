import React from 'react'
import { StationManagerProvider } from '../dashboard/station_manager'


const ManagerContextWrapper = ({children}) => {
  return (
    <StationManagerProvider>
      {children}
    </StationManagerProvider>
  )
}

export default ManagerContextWrapper