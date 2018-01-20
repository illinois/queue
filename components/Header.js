import {
  Navbar,
  NavbarBrand
} from 'reactstrap';

import Link from 'next/link'

const Header = () => (
  <Navbar color="dark" dark className="mb-3">
    <Link href="/" passHref>
      <NavbarBrand>
          CS 225 Office Hours Queue
      </NavbarBrand>
    </Link>
  </Navbar>
)

export default Header
