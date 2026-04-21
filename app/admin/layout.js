export const metadata = {
  title: 'Admin Login - School Website',
  description: 'Admin panel login',
}

export default function AdminLayout({ children }) {
  // No navbar for admin section
  return <>{children}</>
}
