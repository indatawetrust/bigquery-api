const BigQuery = require('@google-cloud/bigquery');
const to = require('await-to-js').default;

const getTables = async ({ bigquery, datasetId, tables, _tables }) => {

  let err;

  const dataset = bigquery.dataset(datasetId);

  [err, tables] = await to(Promise.all(tables.map(async table => {
    if (_tables.filter(({id}) => id == table.name).length) {
      return await Promise.resolve({
        [table.name]: dataset
                      .table(table.name)
      })
    } else {
      [err] = await to(dataset.createTable(table.name, table.options));

      if (err) {
        return Promise.reject(new Error(err));
      }

      return await Promise.resolve({
        [table.name]: dataset
                      .table(table.name)
      })
    }

  })));

  return await Promise.resolve({
    bigquery,
    table: tables.reduce((prev, next) => Object.assign(prev, next))
  });

}

const main = async (opts) => {

  opts = opts || {};

  for (let key of ['projectId', 'keyFilename', 'datasetId']) {
    if (!opts[key]) {
      return await Promise.reject(new Error(`${key} required`));
    }
  }

  let { datasetId, tables, projectId, keyFilename } = opts;

  const bigquery = new BigQuery({
    projectId,
    keyFilename
  });

  let err, datasets, _tables;

  [err, datasets] = await to(bigquery.getDatasets());

  if (err) {
    return await Promise.reject(new Error(err));
  }

  datasets = datasets[0];

  if (datasets.filter(({id}) => id == datasetId).length) {

    [err, _tables] = await to(bigquery.dataset(datasetId).getTables());

    _tables = _tables[0];

    if (!tables && !_tables.length) {

      return await Promise.resolve({ bigquery, table: { } });

    } else {

      [err, tables] = await to(getTables({ bigquery: bigquery, datasetId: datasetId, tables, _tables }));

      if (err) {
        return await Promise.reject(new Error(err));
      }

      return await Promise.resolve(tables);

    }

  } else {

    [err] = await to(bigquery.createDataset(datasetId));

    if (err) {
      return await Promise.reject(new Error(err));
    }

    [err, tables] = await to(getTables({ bigquery: bigquery, datasetId: datasetId, tables, _tables }));

    if (err) {
      return await Promise.reject(new Error(err));
    }

    return await Promise.resolve(tables);

  }

}

module.exports = main;
