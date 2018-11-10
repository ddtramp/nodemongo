const MongoClient = require('mongodb').MongoClient
const Acl = require('acl')
const crypto = require('./../lib/crypto')
const dbName = process.argv[2].toString();

(async () => {
  const url = 'mongodb://test:test@localhost:27017/' + dbName
  // Database Name
  const client = new MongoClient(url, {
    useNewUrlParser: true
  })

  try {
    await client.connect()
    const db = client.db(dbName)
    const mongoBackend = new Acl.mongodbBackend(db, 'acl_')
    const acl = new Acl(mongoBackend)

    // TODO only for rpc
    await acl.allow([
      {
        roles: 'admin',
        allows: [
          {
            resources: '/admin',
            permissions: '*'
          }
        ]
      },
      {
        roles: 'user',
        allows: [{
          resources: '/protected',
          permissions: 'get'
        }]
      },
      {
        roles: 'guest',
        allows: [
          {
            resources: '/',
            permissions: 'get'
          },
          {
            resources: '/index.html',
            permissions: 'get'
          },
          {
            resources: '/login.html',
            permissions: 'get'
          },
          {
            resources: '/profile',
            permissions: 'get'
          }
        ]
      }
    ])
    await acl.addRoleParents('user', 'guest')
    await acl.addRoleParents('admin', 'user')

    let adminUser = await db.collection('users').insertOne({
      email: 'wangxichao001@gmail.com',
      name: 'jack',
      password: crypto.sha1('abs122825619').toString()
    })

    let generalUser = await db.collection('users').insertOne({
      email: 'wangxichao001@hotmail.com',
      name: 'jack',
      password: crypto.sha1('abs122825619').toString()
    })

    await acl.addUserRoles(adminUser.insertedId.toString(), ['admin'])
    await acl.addRoleParents(generalUser.insertedId.toString(), ['user'])
    await acl.addUserRoles('guest', ['guest'])

    // acl.addUserRoles('admin', ['admin', 'user'], () => {
    //   client.close()
    //   console.log('DB init data done')
    //   process.exit(0)
    // })
    client.close()
    process.exit(0)
  } catch (err) {
    console.error(err.stack)
  }
})()
