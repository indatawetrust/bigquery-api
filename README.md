# bigquery-api
A quick and easy to use package for Google Cloud BigQuery. bigquery-api requires node v7.6.0 or higher for ES2015 and async function support.

#### install
```
npm i --save bigquery-api
```

You can check this document to learn how to generate the service account key https://cloud.google.com/iam/docs/creating-managing-service-account-keys

#### usage
```js
const bigqueryapi = require('bigquery-api')

bigqueryapi({
  projectId: process.env.projectId,
  keyFilename: process.env.keyFilename,
  datasetId: "myproject",
  tables: [{
    name: 'user',
    options: {
      schema: 'name:string, date:datetime'
    }
  },{
    name: 'post',
    options: {
      schema: 'text:string, date:datetime'
    }
  }]
})
.then(async ({ bigquery, table }) => {

  // insert
  await table.user.insert({ name: "ahmet şimşek", date: "2018-04-01T12:34:56" })

  await table.post.insert({ text: "lorem ipsum", date: "2018-04-01T12:34:52" })

  // query
  await bigquery.query({ query: 'SELECT * FROM myproject.user' })

})
```

For more information https://cloud.google.com/nodejs/docs/reference/bigquery/latest
