const heapdump = require("heapdump")

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
exports.createPages = async ({ actions }) => {
  const { createPage } = actions

  const result = await graphql(`
    {
      allMongodbProductsGetsby {
        edges {
          node {
            id
          }
        }
      }
    }
  `)

  result.data.allMongodbProductsGetsby.edges.forEach(({ node }) => {
    createPage({
      path: `/products/${node.productSlug}`,
      component: require.resolve("./src/templates/product-template.js"),
      context: {
        id: node.id, // Pass the product id to the template context
      },
      defer: true,
    })
  })

  createPage({
    path: "/using-dsg",
    component: require.resolve("./src/templates/using-dsg.js"),
    context: {},
    defer: true,
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
