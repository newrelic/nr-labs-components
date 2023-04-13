const patterns = [
  {
    name: 'operator',
    regex: /=|>|<|>=|<=|=<|=>|!=/g,
  },
  {
    name: 'numeric',
    regex: /\b(\d+)\b/g,
  },
  {
    name: 'string',
    regex: /('([^']|'')*')/g,
  },
  {
    name: 'keyword',
    regex:
      /\b(?:SELECT|FROM|SHOW EVENT TYPES|WHERE|AS|FACET|FACET CASES|LIMIT|SINCE|UNTIL|WITH TIMEZONE|COMPARE WITH|TIMESERIES|EXTRAPOLATE|AUTO|MAX)\b/gi,
  },
  {
    name: 'function',
    regex:
      /(apdex|average|buckets|count|eventType|filter|funnel|histogram|keyset|latest|max|median|min|percentage|percentile|rate|stddev|sum|uniqueCount|uniques)(?=\()/gi,
  },
];

export default patterns;
