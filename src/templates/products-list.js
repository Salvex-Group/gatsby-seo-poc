import React, { lazy, Suspense } from "react"
import { Link, graphql } from "gatsby"
import { Helmet } from "react-helmet"

const ProductStyles = lazy(() => import("../styles/ProductStyles"))

const ProductsList = ({ data, pageContext }) => {
  const products = data.allProduct.edges
  const { currentPage, numPages } = pageContext
  const isFirst = currentPage === 1
  const isLast = currentPage === numPages
  const prevPage =
    currentPage - 1 === 1 ? `/list` : `/list/page/${currentPage - 1}`
  const nextPage = `/list/page/${currentPage + 1}`

  // Dynamically inject CSS into the <head> tag

  return (
    <>
      <Helmet>
        <title> {`Products - Page ${currentPage} `}</title>
        <meta
          name="description"
          content={`Products - Page ${currentPage} of ${numPages}`}
        />
      </Helmet>
      <div>
        <h1>Products - Page {currentPage}</h1>
        <Suspense fallback={<div>Loading styles...</div>}>
          <ProductStyles />
        </Suspense>
        <table className="product-table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Product Detail</th>
            </tr>
          </thead>
          <tbody>
            {products.map(({ node }) => (
              <tr key={node.productSlug}>
                <td>{node.productName}</td>
                <td>
                  <Link to={`/products/${node.productSlug}`}>View Details</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pagination">
          {!isFirst && (
            <Link to={prevPage} rel="prev">
              ← Previous Page
            </Link>
          )}
          {!isLast && (
            <Link to={nextPage} rel="next">
              Next Page →
            </Link>
          )}
        </div>
      </div>
    </>
  )
}

export const query = graphql`
  query ($skip: Int!, $limit: Int!) {
    allProduct(skip: $skip, limit: $limit) {
      edges {
        node {
          productName
          productSlug
        }
      }
    }
  }
`

export default ProductsList
