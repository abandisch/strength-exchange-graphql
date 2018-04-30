// Welcome to Launchpad!
// Log in to edit and save pads, run queries in GraphiQL on the right.
// Click "Download" above to get a zip with a standalone Node.js server.
// See docs and examples at https://github.com/apollographql/awesome-launchpad

// graphql-tools combines a schema string with resolvers.
import { makeExecutableSchema } from "graphql-tools";
import casual from "casual";
import _ from "lodash";

casual.seed(234);

const exerciseTypes = ["Overhead press", "Lunge", "Biceps curl", "Squat", "Deadlift", "Bench Press", "Leg Press", "Leg Curls", "Wide-Grip Lat Pulldown", "Triceps Pushdown"];
const exerciseComments = [
  "Hand position is important for a number of reasons, the main one being it determines which muscle groups take the majority of the load on each rep.",
  "The elbow position will also determine whether or not you’re risking injury by putting too much stress through the shoulder joint which also takes away from the pecs on each rep.",
  "Anchor your feet into the ground, lift up through the bottom of the rip cage and force your shoulder blades down into the bench.",
  "On every rep you should be taking a deep inhale before you begin the eccentric phase (the way down), holding onto it until the bar is on it’s way up where you will then exhale and repeat",
  "A weak bench press is often due to a lack of tricep strength and/or size, not so much a weak chest. Common sense would suggest increasing the strength of your triceps to aid the chest throughout a bench press.",
  "Make sure that you do not lock your knees. Your torso and the legs should make a perfect 90-degree angle. This will be your starting position.",
  "As you inhale, slowly lower the platform until your upper and lower legs make a 90-degree angle.",
  "Keep your upper body straight, with your shoulders back and relaxed and chin up (pick a point to stare at in front of you so you don't keep looking down). Always engage your core."
];
const exercises = () =>
  _.times(casual.integer(3, 4), () => ({
    id: casual.uuid,
    type: casual.random_element(exerciseTypes),
    reps: casual.integer(3, 10),
    sets: casual.integer(2, 4),
    comments: casual.random_element(exerciseComments)
  }));
  // comments: casual.words(casual.integer(10, 30))
  // comments: casual.random_element(exerciseComments)

const dayTypes = ["rest", "weight"];
const days = () =>
  _.times(30, i => ({
    id: casual.uuid,
    dayType: casual.random_element(dayTypes),
    dayNumber: i,
    exercises: exercises()
  }));

const mockSummaries = [
  "This fitness course that will get you ready for summer with a full body workout",
  "This fitness regime that will get you ready for summer with a full body workout",
  "This workout program that will get you ready for summer with a full body workout",
  "This intense workout that will get you ready for summer with a full body workout",
  "This mini-workout dedicated to abs and upperbody"
];
const mockTitles = [
  "Intensive Full Body",
  "Ripped in weeks",
  "Summer-Ready Workout",
  "Go hard or go home!",
  "Casual Workout",
  "Daily 20 minute"
];
const programs = _.times(5, () => ({
  id: casual.uuid,
  name: casual.random_element(mockTitles),
  days: days(),
  summary: casual.random_element(mockSummaries),
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
    findByDay(id: String!, dayNumber: Int!): Day
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
    },
    findByDay: (root, args, context) => {
      return store.programs
      .find(p => p.id === args.id).days
      .find(d => d.dayNumber === args.dayNumber)
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
