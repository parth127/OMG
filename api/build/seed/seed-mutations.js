"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.getSeedMutations = void 0;

const fetch = require('node-fetch');

const parse = require('csv-parse/lib/sync');

const {
  gql
} = require('@apollo/client');

const getSeedMutations = async () => {
  const res = await fetch('https://cdn.neo4jlabs.com/data/grandstack_businesses.csv');
  const body = await res.text();
  const records = parse(body, {
    columns: true
  });
  const mutations = generateMutations(records);
  return mutations;
};
/*
const generateMutations = (records) => {
  return records.map((rec) => {
    return {
      mutation: gql`
        mutation  {
          CreateUser(
            userID: ID!,
            userName: String,
            emailID: String,
            firstName: String,
            lastName: String,
            password: String,
          ): User
        }
      `,
      variables: rec,
    }
  })
}
*/


exports.getSeedMutations = getSeedMutations;