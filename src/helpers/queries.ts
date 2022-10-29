import gql from 'graphql-tag';

export const SPACES_QUERY = gql`
  query Spaces($id_in: [String]) {
    spaces(where: { id_in: $id_in }, first: 1000) {
      id
      name
      avatar
    }
  }
`;
