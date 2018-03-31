// Welcome to Launchpad!
// Log in to edit and save pads, run queries in GraphiQL on the right.
// Click "Download" above to get a zip with a standalone Node.js server.
// See docs and examples at https://github.com/apollographql/awesome-launchpad

// graphql-tools combines a schema string with resolvers.
import { makeExecutableSchema } from "graphql-tools";
import casual from "casual";
import _ from "lodash";

casual.seed(234);

const exerciseTypes = ["squal", "deadlift", "bench press"];
const exercises = () =>
  _.times(casual.integer(1, 10), () => ({
    id: casual.uuid,
    type: casual.random_element(exerciseTypes),
    reps: casual.integer(0, 100),
    sets: casual.integer(0, 5),
    comments: casual.words(casual.integer(0, 30))
  }));

const dayTypes = ["rest", "cardio", "weight"];
const days = () =>
  _.times(30, i => ({
    id: casual.uuid,
    dayType: casual.random_element(dayTypes),
    dayNumber: i,
    exercises: exercises()
  }));

const programs = _.times(10, () => ({
  id: casual.uuid,
  name: casual.title,
  days: days(),
  summary: casual.sentences(casual.random)
}));
const store = { programs: programs };

// Construct a schema, using GraphQL schema language
const typeDefs = `
	type Program {
		id: ID!
        name: String!
        days: [Day]
		summary: String 
    }
    type Day {
        id: ID!
        dayType: String!
        dayNumber: Int!
        exercises: [Exercise]
    }
	type Exercise {
        id: ID!
		reps: Int!
		sets: Int!
		type: String!
		comments: String
	}

  type Query {
    allPrograms: [Program!]
		findProgram(id: String!): Program
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    allPrograms: (root, args, context) => {
      return store.programs;
    },
    findProgram: (root, args, context) => {
      return store.programs.find(p => p.id === args.id);
    }
  }
};

// Required: Export the GraphQL.js schema object as "schema"
export const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

// Optional: Export a function to get context from the request. It accepts two
// parameters - headers (lowercased http headers) and secrets (secrets defined
// in secrets section). It must return an object (or a promise resolving to it).
export function context(headers, secrets) {
  return {
    headers,
    secrets
  };
}

// Optional: Export a root value to be passed during execution
// export const rootValue = {};

// Optional: Export a root function, that returns root to be passed
// during execution, accepting headers and secrets. It can return a
// promise. rootFunction takes precedence over rootValue.
// export function rootFunction(headers, secrets) {
//   return {
//     headers,
//     secrets,
//   };
// };
