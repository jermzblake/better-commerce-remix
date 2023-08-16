import { Link, Form } from '@remix-run/react'
import { useSearchParams, useNavigate } from "react-router-dom"

export const NavBar = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams({ search: e.target.value })
    navigate(`?search=${e.target.value}`)
  }
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/products">Products</Link>
        </li>
      </ul>
      <div className="nav-section">
        <div>
          <input
            type="search"
            placeholder="Search..."
            value={searchParams.get('search') || ''}
            onChange={handleChange}
          />
        </div>
        <div><Link to="/cart">cart</Link></div>
      </div>
    </nav>
  )
}
