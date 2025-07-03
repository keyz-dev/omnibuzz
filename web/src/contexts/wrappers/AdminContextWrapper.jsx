import React from 'react'
import { AdminProvider, AdminDocumentsProvider } from '../dashboard/admin'


const AdminContextWrapper = ({ children }) => {
  return (
    <AdminProvider>
      <AdminDocumentsProvider>
        {children}
      </AdminDocumentsProvider>
    </AdminProvider>
  )
}

export default AdminContextWrapper