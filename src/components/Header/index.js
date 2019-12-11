import React from 'react';

import { Brand } from 'utils/constants';
import ClientSelect from './ClientSelect';
import ClientAction from './ClientAction';


const Header = () => (
  <header className="app-header d-flex align-items-center justify-content-between">
    <h2 className="m-0">{Brand}</h2>

    <div className="d-flex-center">
      <ClientSelect />

      <ClientAction />
    </div>
  </header>
);

export default Header;
