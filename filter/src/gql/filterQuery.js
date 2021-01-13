import { gql } from "apollo-boost";

const filterQuery = gql`
    query fetchData($screen: String) {
        findFilterConfig(screenId: $screen) {
            filterConfigs {
                name
                category
                filter {
                    name
                    label
                    isRequired
                    dataType
                    initialValue
                    isSubFilter
                    isGroupFilter
                    condition {
                        label
                        value
                    }
                }
            }
        }
    }
`;
export { filterQuery };
