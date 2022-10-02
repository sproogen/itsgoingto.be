import React from 'react'
import { useHistory } from 'react-router-dom'
import { Cookies } from 'react-cookie'
import Button from '@/components/button'

type Props = {
  hasUser: boolean,
  clearUser: () => void
  cookies: Cookies
}

const AdminNavigation = ({ hasUser, clearUser, cookies }: Props): React.ReactElement | null => {
  const history = useHistory()

  const logout = () => {
    cookies.remove('itsgoingtobeUserToken', { path: '/' })
    clearUser()
    return Promise.resolve()
  }

  const viewPolls = () => {
    history.push('/admin')
    return Promise.resolve()
  }

  return (
    hasUser ? (
      <div className="logout-conatiner">
        <Button
          // id="view-polls"
          className="btn--small"
          text="View Polls"
          callback={viewPolls}
        />
        <Button
          // id="logout"
          className="btn--small"
          text="Logout"
          callback={logout}
        />
      </div>
    ) : null
  )
}

export default AdminNavigation
