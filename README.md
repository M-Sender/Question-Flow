# Need to do #

## Set up DB with tables

- Questions
- compiledTrees
- Submissions

## Backend ##

### Routes ###

- initialize(municipality)
- storeTempSession(cookie,answer)
- saveResult(answer)
- (optional) - small script to build compiledTrees

## Frontend ##

- connect routes to server
- build questionContainer (support different types and tree)
- nest in questionPage
  - pass in result from initialize[step]
  - passback answer
  - oneffect saveResult
