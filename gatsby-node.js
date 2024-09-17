const heapdump = require("heapdump")
const { graphql } = require("gatsby")
heapdump.writeSnapshot("./heapdump-" + Date.now() + ".heapsnapshot")
// Function to generate a single product record
const generateProduct = index => {
  return {
    productName: `Product name ${index + 1}`,
    productSlug: `product-${index + 1}`,
    description: `Product description ${index + 1}`,
    productImage: `https://placehold.co/600x400?text=Product+name+${index + 1}`,
  }
}

// Generate 500,000 records
const records = []
const recordCount = 100000

for (let i = 0; i < recordCount; i++) {
  records.push(generateProduct(i))
}

exports.sourceNodes = async ({
  actions,
  createNodeId,
  createContentDigest,
}) => {
  const { createNode } = actions

  // Read and parse the JSON file
  const data = records

  // Create nodes from JSON data
  data.forEach(product => {
    const nodeContent = JSON.stringify(product)

    const nodeMeta = {
      id: createNodeId(`product-${product.productSlug}`),
      parent: null,
      children: [],
      internal: {
        type: "Product",
        mediaType: "application/json",
        content: nodeContent,
        contentDigest: createContentDigest(product),
      },
    }

    const node = Object.assign({}, product, nodeMeta)
    createNode(node)
  })
}
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
      allProduct {
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

  const products = result.data.allProduct.edges || []
  const chunkedProducts = chunk(products, 10000) // Adjust chunk size as needed

  const productsPerPage = 50
  const numPages = Math.ceil(products.length / productsPerPage)
  const productsListTemplate = require.resolve(
    `./src/templates/products-list.js`
  )

  // Create paginated product listing pages
  Array.from({ length: numPages }).forEach((_, i) => {
    createPage({
      path: i === 0 ? `/list` : `/list/page/${i + 1}`,
      component: productsListTemplate,
      context: {
        limit: productsPerPage,
        skip: i * productsPerPage,
        numPages,
        currentPage: i + 1,
      },
    })
  })

  chunkedProducts.map(productChunk => {
    productChunk.map(({ node }) => {
      return createPage({
        path: `/products/${node.productSlug}`,
        component: require.resolve("./src/templates/product-template.js"),
        context: {
          id: node.id,
          productSlug: node.productSlug,
        },
        defer: true,
      })
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
