import React from 'react'
import { render } from 'react-dom'
import App from './App'
import registerServiceWorker from './registerServiceWorker'

import LocaleProvider from 'antd/lib/locale-provider'
import ptBR from 'antd/lib/locale-provider/pt_BR'

render(<LocaleProvider locale={ptBR}><App /></LocaleProvider>, document.getElementById('root'))
registerServiceWorker()
