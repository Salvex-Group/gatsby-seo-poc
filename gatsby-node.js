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
const chunk = (array, size) => {
  const chunkedArr = []
  for (let i = 0; i < array.length; i += size) {
    chunkedArr.push(array.slice(i, i + size))
  }
  return chunkedArr
}

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
  const chunkedProducts = chunk(products, 1000) // Adjust chunk size as needed

  await Promise.all(
    chunkedProducts.map(async productChunk => {
      await Promise.all(
        productChunk.map(({ node }) => {
          console.log(
            "Creating page for product: ",
            `/products/${node.productSlug}`
          )
          return createPage({
            path: `/products/${node.productSlug}`,
            component: require.resolve("./src/templates/product-template.js"),
            context: {
              id: node.id,
            },
            defer: true,
          })
        })
      )
    })
  )
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
