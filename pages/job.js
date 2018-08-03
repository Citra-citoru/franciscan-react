import Head from 'next/head'
import React, { Component } from 'react'
import { compose, Query } from 'react-apollo'
import Layout from '../components/Layout'
import withRoot from '../components/withRoot'
import { JobQuery } from '../lib/queries/job'
import withData from '../lib/withData'

class Job extends Component {
  static async getInitialProps ({ query: { id, type } }) {
    return { id, type }
  }

  render () {
    return (
      <Layout>
        <Head>
          <link
            rel="stylesheet"
            href="/static/styles/faculty.css"
            type="text/css"
          />
        </Head>
        <Query
          query={JobQuery(this.props.type)}
          variables={{ name: this.props.id }}
        >
          {result => {
            if (result.loading) {
              return <h1>Loading</h1>
            }
            if (result.error) return <h3>{JSON.stringify(result.error)}</h3>

            const cvRegex = /(<cvlink>)(<a.href=")(.+)(">)(.+)(<\/a>)(<.cvlink>)/gi

            const imgRegex = /(<img.src=")(.+)(")(.+)(\/>)/gi

            const { data } = result
            const content = data[this.props.type].edges[0].node.content
              .replace(/<Details>/g, '<div class="details">')
              .replace(/<\/Details>/g, '</div>')
              .replace(
                cvRegex,
                '<CVLink><a href="$3" title="View CV">View CV</a></CVLink>'
              )
              .replace(
                imgRegex,
                '<img src="https://storage.googleapis.com/fus-wp-storage/$2" $4 />'
              )

            return (
              <div
                data-testid="content"
                dangerouslySetInnerHTML={{
                  __html: content
                }}
              />
            )
          }}
        </Query>
      </Layout>
    )
  }
}

export default compose(withRoot, withData)(Job)
