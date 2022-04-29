# Comments Aggregator
===============

Comments agregator collect comments in Status and provide specific output.


### Run Guide

1. You need to open VS code.
./commagg

2. Launch Chrome

3. Run environment
```bash
npm run start
```

or create new version of the js bundle

```bash
npm run nonprod:test
```

4. Run python simple server on port 7000
For serving for greasemonkey local test

```bash
conda activate py39
cd ./commagg
python -m http.server 7000

```
