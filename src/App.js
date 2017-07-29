import React from 'react'
import Layout from 'antd/lib/layout'
import Table from 'antd/lib/table'
import axios from 'axios'

const columns = [
  {
    title: 'Mídia',
    dataIndex: 'source',
    key: 'source',
  }, {
    title: 'Campanha',
    dataIndex: 'medium',
    key: 'medium',
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

class App extends React.Component {
  state = {
    data: []
  }

  async componentDidMount() {
    let { data } = await axios.get('data.json', { responseType: 'json' })
    data = this.buildDataSource(data)
    this.setState({ data })
  }

  buildDataSource({ sources, campaigns }) {
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

  render() {
    return (
      <Layout className="App">
        <Layout.Header className="Header">
          <img src="assets/img/link.gif" width="100" height="100" alt="Link" />
        </Layout.Header>

        <Layout.Content className="Content">
          <Table
            dataSource={this.state.data}
            columns={columns}
            size="small"
            pagination={false}
          />
        </Layout.Content>
      </Layout>
    )
  }
}

export default App
