// Using direct fetch instead of Apollo Client
export const graphqlRequest = async (query, variables = {}) => {
  try {
    const response = await fetch('https://classicjobs.in/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: query,
        variables: variables,
      }),
    })

    const result = await response.json()
    
    if (result.errors) {
      console.error('GraphQL errors:', result.errors)
      throw new Error(result.errors[0].message)
    }
    
    return result.data
  } catch (error) {
    console.error('GraphQL request failed:', error)
    throw error
  }
}