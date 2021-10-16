/* eslint-disable no-unused-vars */
import { neo4jgraphql } from 'neo4j-graphql-js'
import fs from 'fs'
import path from 'path'
import jwt from 'jsonwebtoken'
import { compareSync, hashSync } from 'bcrypt'
import dotenv from 'dotenv'
const filePath = require('path')

// set environment variables from .env
dotenv.config()

/*
 * Check for GRAPHQL_SCHEMA environment variable to specify schema file
 * fallback to schema.graphql if GRAPHQL_SCHEMA environment variable is not set
 */

export const typeDefs = fs
  .readFileSync(
    process.env.GRAPHQL_SCHEMA || path.join(__dirname, 'schema.graphql')
  )
  .toString('utf-8')

//Grphql Resolvers are defined below
export const resolvers = {
  Mutation: {
    signUp: (_obj, args, context, _info) => {
      args.password = hashSync(args.password, 10)
      const session = context.driver.session()

      return session
        .run(
          `
          CREATE (u:User) SET u += $args, u.noOfFriends = 0 ,u.userId = randomUUID() RETURN u`,
          { args }
        )
        .then((res) => {
          session.close()
          const { userId, username } = res.records[0].get('u').properties

          return {
            token: jwt.sign({ userId, username }, process.env.JWT_SECRET, {
              expiresIn: '30d',
            }),
          }
        })
    },
    login: (_obj, args, context, _info) => {
      const session = context.driver.session()
      return session
        .run(
          `MATCH (u:User {username: $username})
          RETURN u LIMIT 1`,
          { username: args.username }
        )
        .then((res) => {
          session.close()
          const { userId, username, password } = res.records[0].get(
            'u'
          ).properties
          if (!compareSync(args.password, password)) {
            throw new Error('Authorization Error')
          }
          return {
            token: jwt.sign({ userId, username }, process.env.JWT_SECRET, {
              expiresIn: '30d',
            }),
          }
        })
    },
    forgotpassword: (_obj, args, context, _info) => {
      const session = context.driver.session()
      // console.log(args.emailId)
      return session
        .run(
          `MATCH (u:User {emailId: $emailId})
          RETURN u LIMIT 1`,
          { emailId: args.emailId }
        )
        .then((res) => {
          session.close()
          const { userId, username, emailId } = res.records[0].get(
            'u'
          ).properties

          console.log(userId)
          return {
            token: jwt.sign(
              { userId, username, emailId },
              process.env.JWT_SECRET,
              {
                expiresIn: '1h',
              }
            ),
          }
        })
    },
    changepassword: (_obj, args, context, _info) => {
      args.password = hashSync(args.password, 10)
      const session = context.driver.session()

      return session
        .run(
          `
            MATCH (u:User {userId: $args.userId}) SET u.password= $args.password RETURN u `,
          { args }
        )
        .then((res) => {
          session.close()
          const { userId, username } = res.records[0].get('u').properties

          return {
            token: jwt.sign({ userId, username }, process.env.JWT_SECRET, {
              expiresIn: '30d',
            }),
          }
        })
    },
    AddNewPost: (_obj, args, context, _info) => {
      const { createReadStream, filename } = args.file
      const stream = createReadStream()
      const pathName = filePath.join(
        __dirname,
        `../../web-react/public/img/${filename}`
      )
      stream.pipe(fs.createWriteStream(pathName))

      const session = context.driver.session()
      return session
        .run(
          `Create (p:Post) set p.text=${args.text},p.date=${args.date},img=${pathName},p.postId=randomUUID() return p`,
          { args, pathName }
        )
        .then((_res) => {
          session.close()
          return pathName
        })
    },
  },
  Query: {
    me(object, params, ctx, resolveInfo) {
      if (!ctx.req.user) {
        throw new Error('user not authenticated')
      } else {
        return neo4jgraphql(object, params, ctx, resolveInfo)
      }
    },
  },
}
