import React from 'react'
import Layout from 'antd/lib/layout'
import Table from 'antd/lib/table'
import Form from 'antd/lib/form'
import Button from 'antd/lib/button'
import Input from 'antd/lib/input'
import Icon from 'antd/lib/icon'
import axios from 'axios'

class App extends React.Component {
  state = {
    ready: false,
    filters: {},
    auth: false,
  }

  data = []
  dataSource = []

  async componentDidMount() {
    let { data } = await axios.get('data.json', { responseType: 'json' })

    this.data = data
    this.dataSource = this.mountDataSource(data)

    this.setState({
      ready: true,
      filters: {
        source: window.location.hash ? [window.location.hash.slice(1)] : [],
      }
    })
  }

  mountColumns({ sources, campaigns }, { source = [] }) {
    return [
      {
        title: 'Mídia',
        dataIndex: 'source',
        key: 'source',
        filteredValue: source,
        filters: sources.map(source => ({ text: source.title, value: source.title })),
        onFilter: (value, record) => record.source === value,
      }, {
        title: 'Campanha',
        dataIndex: 'medium',
        key: 'medium',
        filters: campaigns.map(campaign => ({ text: campaign.title, value: campaign.title })),
        onFilter: (value, record) => record.medium === value,
      }, {
        title: 'Source',
        dataIndex: 'lsSource',
        key: 'lsSource',
      }, {
        title: 'MID',
        dataIndex: 'mid',
        key: 'mid',
      }, {
        title: 'URL',
        dataIndex: 'url',
        key: 'url',
        render: url => <a href={url} target="_blank">{url}</a>
      }
    ]
  }

  mountDataSource({ sources, campaigns }) {
    const dataSource = []

    for (const campaign of campaigns) {
      for (const source of sources) {
        const lsSource = source.hash + 'WZ' + campaign.hash
        const url = `${campaign.url}${campaign.url.indexOf('?') === -1 ? '?' : '&'}utm_source=${source.title}&utm_medium=${campaign.title}&source=${lsSource}&mID=${source.mid}`

        dataSource.push({
          key: dataSource.length,
          source: source.title,
          medium: campaign.title,
          mid: source.mid,
          lsSource,
          url,
        })
      }
    }

    return dataSource
  }

  handleChange = (pagination, filters) => {
    this.setState({ filters })
  }

  render() {
    const { ready, filters, auth } = this.state

    if (!ready) {
      return null
    }

    const columns = this.mountColumns(this.data, filters)

    return (
      <Layout className="App">
        <Layout.Header className="Header">
          <img src="assets/img/link.gif" width="100" height="100" alt="Link" />
        </Layout.Header>

        {auth ?
          <Layout.Content className="Content">
            <Table
              dataSource={this.dataSource}
              columns={columns}
              size="small"
              pagination={false}
              onChange={this.handleChange}
            />
          </Layout.Content>
          : <WrappedLogin
            onAuth={() => this.setState({ auth: true })}
          />}
      </Layout>
    )
  }
}

class Login extends React.Component {
  handlePasswordInputChange = (event) => {
    const val = event.target.value.trim()

    if (val === 'mu1ti@link') {
      this.props.onAuth()
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form

    return (
      <Layout.Content className="Content">
        <Form onSubmit={this.handleSubmit} className="LoginForm" layout="inline">
          <Form.Item>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: 'Você não tem a senha?' }],
            })(
              <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="Senha" onChange={this.handlePasswordInputChange} />
              )}
          </Form.Item>
        </Form>
      </Layout.Content>
    )
  }
}

const WrappedLogin = Form.create()(Login)
export default App
