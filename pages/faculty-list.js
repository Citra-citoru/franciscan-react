import Grid from '@material-ui/core/Grid'
import { withStyles } from '@material-ui/core/styles'
import Head from 'next/head'
import React, { Component } from 'react'
import { compose, Query } from 'react-apollo'
import FacultyListItem from '../components/FacultyListItem'
import Layout from '../components/Layout'
import withRoot from '../components/withRoot'
import { FacultyListQuery } from '../lib/queries/facultyList'
import withData from '../lib/withData'

const styles = theme => ({
  gridItemFix: {
    width: '100%',
    margin: '0',
    padding: '16px',
    [theme.breakpoints.down('sm')]: {
      padding: '8px'
    }
  },
  contentContainer: {
    width: '100%',
    maxWidth: '70%',
    margin: '0 auto',
    [theme.breakpoints.down('md')]: {
      maxWidth: '85%'
    },
    [theme.breakpoints.down('sm')]: {
      maxWidth: '95%'
    }
  }
})

class FacultyList extends Component {
  static async getInitialProps ({ query: { id, type } }) {
    return { id, type }
  }
  render () {
    const { classes } = this.props
    return (
      <Layout>
        <Head>
          <link
            rel="stylesheet"
            href="/static/styles/faculty.css"
            type="text/css"
          />
          <link
            rel="stylesheet"
            href="/static/styles/faculty-list.css"
            type="text/css"
          />
        </Head>
        <Query
          query={FacultyListQuery(this.props.type)}
          variables={{ name: this.props.id }}
        >
          {result => {
            if (result.loading) {
              return <h1>Loading</h1>
            }
            if (result.error) return <h3>{result.error}</h3>

            const { data } = result
            const facultyData =
              data['facultyDepartments'].edges[0].node.faculty.edges

            return (
              <Grid
                container
                className={classes.gridItemFix}
                justify="center"
                spacing={16}
              >
                {facultyData.map(faculty => (
                  <FacultyListItem
                    key={faculty.node.slug}
                    profileName={faculty.node.displayNameField.value}
                    profileLink={`/faculty/${faculty.node.slug}`}
                    jobTitle={faculty.node.jobTitleField.value}
                    imageObj={faculty.node.featuredImage}
                  />
                ))}
              </Grid>
            )
          }}
        </Query>
      </Layout>
    )
  }
}

export default compose(
  withRoot,
  withData
)(withStyles(styles)(FacultyList))
