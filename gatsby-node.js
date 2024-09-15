const heapdump = require("heapdump")
const { graphql } = require("gatsby")
// Trigger a heap dump for analysis
heapdump.writeSnapshot("./heapdump-" + Date.now() + ".heapsnapshot")
/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-node/
 */

/**
 * @type {import('gatsby').GatsbyNode['createPages']}
 */
exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage } = actions

  const result = await graphql(`
    {
      allMongodbProductsGetsby {
        edges {
          node {
            id
            productSlug
          }
        }
      }
    }
  `)

  if (result.errors) {
    reporter.panicOnBuild("Error while running GraphQL query.")
    return
  }

  const products = result.data.allMongodbProductsGetsby.edges || []

  products.forEach(({ node }) => {
    createPage({
      path: `/products/${node.productSlug}`,
      component: require.resolve("./src/templates/product-template.js"),
      context: {
        id: node.id,
      },
      defer: true,
    })
  })
}

exports.onCreateWebpackConfig = ({ actions, stage }) => {
  if (stage === "build-javascript") {
    actions.setWebpackConfig({
      optimization: {
        splitChunks: {
          chunks: "all",
        },
      },
    })
  }
}
