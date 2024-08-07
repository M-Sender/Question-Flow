export const config = {
  databasePath: 'database.sqlite',
};

export const tables = {
  compiledTrees: {
    tableName: 'compiledTrees',
    columns: {
      id: 'id',
      municipality_id: 'municipality_id',
      compiledTree: 'compiledTree',
    },
  },
  municipalities: {
    tableName: 'municipalities',
    columns: {
      id: 'id',
      name: 'name',
    },
  },
  steps: {
    tableName: 'steps',
    columns: {
      id: 'id',
      prompt: 'prompt',
      subText: 'subText'
    },
  },
  questionnaireResults: {
    tableName: 'questionnaireResults',
    columns: {
      id: 'id',
      timestamp: 'timestamp',
      answers: 'answers',
      municipality: 'municipality',
      result: 'result'
    },
  },
};