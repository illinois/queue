import React from 'react'
import {
  Navbar,
  NavbarBrand,
} from 'reactstrap'

import Link from 'next/link'

const Header = () => (
  <Navbar color="dark" dark className="mb-3">
    <Link href="/" passHref>
      <NavbarBrand>
          CS@Illinois Queues
      </NavbarBrand>
    </Link>
  </Navbar>
)

export default Header
